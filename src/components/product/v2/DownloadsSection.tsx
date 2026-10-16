import Link from "next/link";
import type { ReactNode } from "react";
import { DownloadLink } from "@/components/DownloadLink";
import { fileExtension } from "@/components/FileTypeIcon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Asset, AssetType, ProductCard } from "@/lib/api/types";
import { formatFileSize } from "@/lib/format";
import { VerticalTabs, type VerticalTab } from "./VerticalTabs";
import { VideoGallery } from "./VideoGallery";

/** Order of the document groups, as on the brand websites. */
const TYPE_ORDER: AssetType[] = [
  "submittal",
  "manual",
  "spec_sheet",
  "brochure",
  "catalog",
  "certificate",
  "presentation",
  "other",
];

function ArrowIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  );
}

/** "PDF · 2.1 MB · Distributors only", or the link label for plain links. */
function assetMeta(asset: Asset, locale: Locale, t: Dictionary): string {
  const extension = fileExtension(asset.file_name);
  if (!extension && asset.source === "link") {
    return t.assets.open;
  }

  return [
    extension,
    formatFileSize(asset.size_bytes, locale),
    asset.language !== "all" ? asset.language.toUpperCase() : null,
    asset.visibility === "public" ? null : t.assets.distributorsOnly,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Documents (by type), accessories and videos of the product in vertical tabs,
 * plus a "download all" ZIP of the documents the visitor may download (videos excluded).
 */
export function DownloadsSection({
  productSlug,
  assets,
  videos,
  accessories,
  locale,
  t,
}: {
  productSlug: string;
  assets: Asset[];
  videos: { url: string; title: string | null }[];
  accessories: ProductCard[];
  locale: Locale;
  t: Dictionary;
}) {
  const link =
    "flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-ink transition hover:bg-surface-muted hover:text-v2-accent md:text-[15px]";
  const documents = assets.filter((asset) => asset.type !== "video");
  const byType = Map.groupBy(documents, (asset) => asset.type);

  const list = (items: { key: string | number; node: ReactNode }[]) => (
    <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line p-2 md:p-3">
      {items.map((item) => (
        <li key={item.key}>{item.node}</li>
      ))}
    </ul>
  );

  const tabs: VerticalTab[] = [
    ...TYPE_ORDER.filter((type) => byType.has(type)).map((type) => {
      const items = byType.get(type) ?? [];

      return {
        id: type,
        label: t.assets.types[type],
        count: items.length,
        content: list(
          items.map((asset) => ({
            key: asset.id,
            node: (
              <DownloadLink
                assetId={asset.id}
                locale={locale}
                isLink={asset.source === "link"}
                title={asset.title}
                extension={fileExtension(asset.file_name)}
                meta={assetMeta(asset, locale, t)}
                labels={{ preparing: t.assets.preparing, forbidden: t.assets.forbidden, error: t.assets.error }}
              />
            ),
          })),
        ),
      };
    }),
    {
      id: "accessories",
      label: t.productV2.accessories,
      count: accessories.length,
      content: list(
        accessories.map((accessory) => ({
          key: accessory.id,
          node: (
            <Link href={`/${locale}/products/${accessory.slug}`} className={link}>
              <ArrowIcon />
              {accessory.name}
            </Link>
          ),
        })),
      ),
    },
    {
      id: "videos",
      label: t.productV2.videos,
      count: videos.length,
      content: (
        <VideoGallery
          videos={videos}
          labels={{ videoCount: t.productV2.videoCount, nowPlaying: t.productV2.nowPlaying }}
        />
      ),
    },
  ].filter((tab) => tab.count > 0);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section id="downloads" className="scroll-mt-24 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-black md:text-[40px]">{t.productV2.downloads}</h2>
          {documents.length > 0 ? (
            <a
              href={`/api/products/${encodeURIComponent(productSlug)}/download-all?locale=${locale}`}
              className="inline-flex items-center gap-2 rounded-lg bg-v2-button px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              {t.productV2.downloadAll}
            </a>
          ) : null}
        </div>
        <VerticalTabs tabs={tabs} label={t.productV2.downloads} />
      </div>
    </section>
  );
}

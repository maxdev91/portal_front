import { BrandTheme } from "@/components/BrandTheme";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { FeatureBadges, FeatureCards, KeySpecs, SpecTable, keySpecs, splitFeatures } from "@/components/ProductDetails";
import { ProductDocuments } from "@/components/ProductDocuments";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductTabs, type ProductTab } from "@/components/ProductTabs";
import { VideoGrid } from "@/components/VideoGrid";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ProductDetail } from "@/lib/api/types";

/** Classic product page (v1): compact header with the gallery, then tabs. */
export function ProductViewV1({ product, locale }: { product: ProductDetail; locale: Locale }) {
  const t = getDictionary(locale);
  const { brand, category } = product;
  const { badges, highlights } = splitFeatures(product.features);
  const specCount = product.spec_groups.reduce((sum, group) => sum + group.items.length, 0);
  const videoCount = product.videos.length;

  const tabs: ProductTab[] = [
    {
      id: "overview",
      label: t.product.overview,
      content: (
        <div className="flex flex-col gap-6">
          {product.description ? (
            <div
              className="prose-portal max-w-3xl text-sm text-ink"
              // Rich text from the admin editor, sanitized by the API.
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-sm text-ink-muted">{t.product.noDescription}</p>
          )}
          {highlights.length > 0 ? (
            <div>
              <h2 className="mb-3 text-sm font-semibold">{t.product.features}</h2>
              <FeatureCards features={highlights} />
            </div>
          ) : null}
        </div>
      ),
    },
    ...(specCount > 0
      ? [
          {
            id: "specifications",
            label: t.product.specifications,
            count: specCount,
            content: <SpecTable groups={product.spec_groups} showAllLabel={t.product.showAllSpecs} />,
          },
        ]
      : []),
    {
      id: "documents",
      label: t.product.documentsShort,
      count: product.assets.length,
      content:
        product.assets.length > 0 ? (
          <ProductDocuments assets={product.assets} locale={locale} t={t.assets} />
        ) : (
          <EmptyState message={t.product.noDocuments} />
        ),
    },
    ...(videoCount > 0
      ? [
          {
            id: "videos",
            label: t.product.videos,
            count: videoCount,
            content: <VideoGrid videos={product.videos} showAllLabel={t.product.showAllVideos} />,
          },
        ]
      : []),
  ];

  return (
    <BrandTheme brand={brand}>
      <div data-surface="sunken" />
      <div className="border-b border-line bg-surface">
        <Container className="py-3">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: brand.name, href: `/${locale}/${brand.slug}` },
              ...(category.parent
                ? [{ label: category.parent.name, href: `/${locale}/${brand.slug}/${category.parent.slug}` }]
                : []),
              { label: category.name, href: `/${locale}/${brand.slug}/${category.slug}` },
              { label: product.sku },
            ]}
          />
        </Container>
      </div>

      <Container className="grid gap-8 py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} fallbackAlt={product.name} />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">{brand.name}</p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs">
              <li className="rounded-md bg-surface px-2 py-1 ring-1 ring-line">
                <span className="text-ink-muted">{t.product.sku}</span>{" "}
                <span className="font-semibold">{product.sku}</span>
              </li>
              {product.model && product.model !== product.sku ? (
                <li className="rounded-md bg-surface px-2 py-1 ring-1 ring-line">
                  <span className="text-ink-muted">{t.product.model}</span>{" "}
                  <span className="font-semibold">{product.model}</span>
                </li>
              ) : null}
              <li className="rounded-md bg-surface px-2 py-1 ring-1 ring-line">
                <span className="text-ink-muted">{t.product.category}</span>{" "}
                <span className="font-semibold">{category.name}</span>
              </li>
            </ul>
          </div>

          {product.short_description ? (
            <p className="text-[15px] leading-relaxed text-ink-muted">{product.short_description}</p>
          ) : null}

          <FeatureBadges features={badges} />

          <KeySpecs items={keySpecs(product.spec_groups)} title={t.product.atAGlance} />

          <div className="flex flex-wrap gap-2.5">
            <a
              href="#documents"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              {t.product.documentsShort}
              <span className="rounded-full bg-white/20 px-1.5 text-xs">{product.assets.length}</span>
            </a>
            {specCount > 0 ? (
              <a
                href="#specifications"
                className="rounded-full bg-surface px-4 py-2 text-sm font-semibold ring-1 ring-line hover:text-brand hover:ring-brand/40"
              >
                {t.product.specifications}
              </a>
            ) : null}
          </div>
        </div>
      </Container>

      <Container className="pb-14">
        <ProductTabs tabs={tabs} />
      </Container>
    </BrandTheme>
  );
}

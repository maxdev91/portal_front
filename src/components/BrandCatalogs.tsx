"use client";

import type { Locale } from "@/i18n/config";
import type { Asset } from "@/lib/api/types";
import { formatFileSize } from "@/lib/format";
import { useAssetDownload } from "@/lib/hooks/useAssetDownload";
import { FileTypeIcon, fileExtension } from "./FileTypeIcon";

type Labels = { heading: string; view: string; download: string; preparing: string; forbidden: string; error: string };

const action =
  "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition disabled:opacity-60";

function CatalogRow({ asset, locale, labels }: { asset: Asset; locale: Locale; labels: Labels }) {
  const isLink = asset.source === "link";
  const extension = fileExtension(asset.file_name);
  const { state, start, view } = useAssetDownload(asset.id, locale, isLink);
  const meta = [extension, formatFileSize(asset.size_bytes, locale)].filter(Boolean).join(" · ");
  const busy = state === "loading";

  return (
    <li className="rounded-xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="rounded-lg bg-white p-px">
          <FileTypeIcon extension={extension} isLink={isLink} size="sm" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold leading-5">
            {busy ? labels.preparing : asset.title}
          </span>
          {meta ? <span className="block text-[11px] leading-4 text-white/65">{meta}</span> : null}
        </span>
        {isLink ? null : (
          <button
            type="button"
            onClick={view}
            disabled={busy}
            className={`${action} text-white ring-1 ring-white/30 hover:bg-white/15`}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-3.5 w-3.5"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {labels.view}
          </button>
        )}
        <button
          type="button"
          onClick={start}
          disabled={busy}
          aria-label={`${labels.download}: ${asset.title}`}
          title={labels.download}
          className={`${action} w-8 justify-center bg-white px-0 text-ink hover:bg-white/90`}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
          </svg>
        </button>
      </div>
      {state === "forbidden" ? <p className="mt-1 px-1 text-xs text-red-200">{labels.forbidden}</p> : null}
      {state === "error" ? <p className="mt-1 px-1 text-xs text-red-200">{labels.error}</p> : null}
    </li>
  );
}

/** Catalogs of the brand (e.g. "Catalog 2026") in the brand header: view in a new tab or download. */
export function BrandCatalogs({ catalogs, locale, labels }: { catalogs: Asset[]; locale: Locale; labels: Labels }) {
  if (catalogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full sm:max-w-sm lg:w-80 lg:shrink-0">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/65">{labels.heading}</p>
      <ul className="flex flex-col gap-1.5">
        {catalogs.map((asset) => (
          <CatalogRow key={asset.id} asset={asset} locale={locale} labels={labels} />
        ))}
      </ul>
    </div>
  );
}

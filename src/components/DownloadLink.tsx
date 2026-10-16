"use client";

import type { Locale } from "@/i18n/config";
import { useAssetDownload } from "@/lib/hooks/useAssetDownload";
import { FileTypeIcon } from "./FileTypeIcon";

/** Row that downloads (or opens) a marketing asset, showing its file type and size; same rules as DownloadButton. */
export function DownloadLink({
  assetId,
  locale,
  isLink,
  title,
  extension,
  meta,
  labels,
}: {
  assetId: number;
  locale: Locale;
  isLink: boolean;
  title: string;
  extension: string | null;
  meta: string;
  labels: { preparing: string; forbidden: string; error: string };
}) {
  const { state, start } = useAssetDownload(assetId, locale, isLink);
  // Files kept on another storage still download; only plain links open a page.
  const opensPage = isLink && !extension;

  return (
    <span className="flex flex-col">
      <button
        type="button"
        onClick={start}
        disabled={state === "loading"}
        className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-surface-muted disabled:opacity-60"
      >
        <FileTypeIcon extension={extension} isLink={isLink} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink md:text-[15px]" title={title}>
            {state === "loading" ? labels.preparing : title}
          </span>
          {meta ? <span className="mt-0.5 block text-xs text-ink-muted">{meta}</span> : null}
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-v2-accent ring-1 ring-line transition group-hover:bg-v2-accent group-hover:text-white group-hover:ring-v2-accent">
          {state === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              {opensPage ? (
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              ) : (
                <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
              )}
            </svg>
          )}
        </span>
      </button>
      {state === "forbidden" ? <span className="px-3 pb-2 text-xs text-red-600">{labels.forbidden}</span> : null}
      {state === "error" ? <span className="px-3 pb-2 text-xs text-red-600">{labels.error}</span> : null}
    </span>
  );
}

"use client";

import type { Locale } from "@/i18n/config";
import { useAssetDownload } from "@/lib/hooks/useAssetDownload";

type Labels = { download: string; open: string; preparing: string; signIn: string; forbidden: string; error: string };

/** Pill button that downloads (or opens) a marketing asset. */
export function DownloadButton({
  assetId,
  locale,
  isLink,
  labels,
  size = "md",
}: {
  assetId: number;
  locale: Locale;
  isLink: boolean;
  labels: Labels;
  size?: "md" | "sm";
}) {
  const { state, start } = useAssetDownload(assetId, locale, isLink);

  const label = state === "loading" ? labels.preparing : isLink ? labels.open : labels.download;
  const sizing = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2 text-sm";

  return (
    <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={start}
        disabled={state === "loading"}
        className={`inline-flex items-center gap-1.5 rounded-full bg-brand font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60 ${sizing}`}
      >
        <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}>
          <path d="M10 3a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 11.586V4a1 1 0 0 1 1-1Zm-6 13a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
        </svg>
        {label}
      </button>
      {state === "forbidden" ? <p className="text-xs text-red-600">{labels.forbidden}</p> : null}
      {state === "error" ? <p className="text-xs text-red-600">{labels.error}</p> : null}
    </div>
  );
}

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Asset } from "@/lib/api/types";
import { formatFileSize } from "@/lib/format";
import { DownloadButton } from "./DownloadButton";
import { FileTypeIcon, fileExtension } from "./FileTypeIcon";

/** Product documents grouped by type, in compact rows. */
export function ProductDocuments({ assets, locale, t }: { assets: Asset[]; locale: Locale; t: Dictionary["assets"] }) {
  const groups = Map.groupBy(assets, (asset) => asset.type);

  return (
    <div className="flex flex-col gap-6">
      {[...groups].map(([type, items]) => (
        <section key={type}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {t.types[type]} <span className="font-normal">({items.length})</span>
          </h3>
          <ul className="divide-y divide-line/70">
            {items.map((asset) => {
              const size = formatFileSize(asset.size_bytes, locale);
              const extension = fileExtension(asset.file_name);

              return (
                <li key={asset.id} className="flex items-center gap-3 py-2.5">
                  <FileTypeIcon extension={extension} isLink={asset.source === "link"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" title={asset.title}>
                      {asset.title}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {[size, asset.visibility === "public" ? null : t.distributorsOnly].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <DownloadButton
                    assetId={asset.id}
                    locale={locale}
                    isLink={asset.source === "link"}
                    size="sm"
                    labels={{
                      download: t.download,
                      // Files kept on another storage are still a download for the user.
                      open: asset.file_name ? t.download : t.open,
                      preparing: t.preparing,
                      signIn: t.signInToDownload,
                      forbidden: t.forbidden,
                      error: t.error,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

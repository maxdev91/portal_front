import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { formatFileSize } from "@/lib/format";
import type { Asset } from "@/lib/api/types";
import { DownloadButton } from "./DownloadButton";
import { FileTypeIcon, fileExtension } from "./FileTypeIcon";

export function AssetList({ assets, locale, t }: { assets: Asset[]; locale: Locale; t: Dictionary["assets"] }) {
  return (
    <ul className="divide-y divide-line">
      {assets.map((asset) => {
        const size = formatFileSize(asset.size_bytes, locale);

        return (
          <li key={asset.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <FileTypeIcon extension={fileExtension(asset.file_name)} isLink={asset.source === "link"} />
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-medium text-brand">
                    {t.types[asset.type]}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-medium ${
                      asset.visibility === "public" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {asset.visibility === "public" ? t.public : t.distributorsOnly}
                  </span>
                  {asset.language !== "all" ? <span className="uppercase text-ink-muted">{asset.language}</span> : null}
                </div>
                <p className="truncate font-medium">{asset.title}</p>
                {size ? <p className="text-sm text-ink-muted">{size}</p> : null}
              </div>
            </div>
            <DownloadButton
              assetId={asset.id}
              locale={locale}
              isLink={asset.source === "link"}
              labels={{
                download: t.download,
                open: t.open,
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
  );
}

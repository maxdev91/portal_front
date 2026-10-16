import Link from "next/link";
import type { PaginationMeta } from "@/lib/api/types";
import { pageItems } from "@/lib/pagination";

type Labels = { previous: string; next: string; page: string; of: string };

/** Numbered pagination with previous/next arrows; keeps the current query (filters, sort) on every link. */
export function Pagination({
  meta,
  baseHref,
  labels,
  query = {},
}: {
  meta: PaginationMeta;
  baseHref: string;
  labels: Labels;
  query?: Record<string, string | undefined>;
}) {
  if (meta.last_page <= 1) {
    return null;
  }

  const href = (page: number): string => {
    const params = new URLSearchParams(
      Object.entries(query).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    if (page > 1) {
      params.set("page", String(page));
    }
    const search = params.toString();
    return search ? `${baseHref}?${search}` : baseHref;
  };

  const current = meta.current_page;
  const box = "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium";
  const idle = `${box} bg-surface ring-1 ring-line hover:text-brand hover:ring-brand/50`;

  return (
    <nav className="mt-10 flex flex-col items-center gap-3" aria-label="Pagination">
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          {current > 1 ? (
            <Link href={href(current - 1)} className={idle} aria-label={labels.previous}>
              ‹
            </Link>
          ) : (
            <span className={`${box} text-ink-muted/40`} aria-hidden>
              ‹
            </span>
          )}
        </li>
        {pageItems(current, meta.last_page).map((item, index) => (
          <li key={item === "gap" ? `gap-${index}` : item}>
            {item === "gap" ? (
              <span className={`${box} text-ink-muted`} aria-hidden>
                …
              </span>
            ) : item === current ? (
              <span className={`${box} bg-brand text-white`} aria-current="page">
                {item}
              </span>
            ) : (
              <Link href={href(item)} className={idle} aria-label={`${labels.page} ${item}`}>
                {item}
              </Link>
            )}
          </li>
        ))}
        <li>
          {current < meta.last_page ? (
            <Link href={href(current + 1)} className={idle} aria-label={labels.next}>
              ›
            </Link>
          ) : (
            <span className={`${box} text-ink-muted/40`} aria-hidden>
              ›
            </span>
          )}
        </li>
      </ul>
      <p className="text-xs text-ink-muted">
        {labels.page} {current} {labels.of} {meta.last_page}
      </p>
    </nav>
  );
}

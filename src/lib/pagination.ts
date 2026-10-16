export type PageItem = number | "gap";

/**
 * Page numbers to show: always the first and last pages, the current one and its neighbours,
 * with a gap where pages are skipped. Short ranges are listed in full.
 */
export function pageItems(current: number, last: number, neighbours = 2): PageItem[] {
  if (last <= neighbours * 2 + 5) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }

  const start = Math.max(2, current - neighbours);
  const end = Math.min(last - 1, current + neighbours);
  const items: PageItem[] = [1];

  if (start > 2) {
    items.push("gap");
  }
  for (let page = start; page <= end; page++) {
    items.push(page);
  }
  if (end < last - 1) {
    items.push("gap");
  }
  items.push(last);

  return items;
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LISTING_SORTS, type CategoryFacets, type ListingQuery } from "@/lib/api/types";

type FacetKey = "type" | "capacity" | "voltage" | "refrigerant";
type Option = { value: string; label: string; count: number };

const FACETS: FacetKey[] = ["type", "capacity", "voltage", "refrigerant"];

function selectedValues(query: ListingQuery, key: FacetKey): string[] {
  return query[key]?.split(",").filter(Boolean) ?? [];
}

/**
 * Filter state lives in the URL, so every filtered page can be shared and is rendered (and cached) on the server.
 */
function useListingNavigation(query: ListingQuery) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const navigate = (changes: Partial<Record<keyof ListingQuery, string | undefined>>) => {
    const next = { ...query, ...changes };
    const params = new URLSearchParams(
      Object.entries(next).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    const search = params.toString();
    startTransition(() => router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false }));
  };

  const toggle = (key: FacetKey, value: string) => {
    const current = selectedValues(query, key);
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    navigate({ [key]: next.join(",") || undefined });
  };

  return { pending, navigate, toggle };
}

export function CatalogFilters({
  facets,
  query,
  labels,
  t,
}: {
  facets: CategoryFacets;
  query: ListingQuery;
  labels: Record<FacetKey, Record<string, string>>;
  t: Dictionary["category"];
}) {
  const { pending, navigate, toggle } = useListingNavigation(query);
  const activeCount = FACETS.reduce((sum, key) => sum + selectedValues(query, key).length, 0);

  const groups = FACETS.map((key) => {
    const options: Option[] = facets[key].map((option) => ({
      value: String(option.value),
      label: labels[key][String(option.value)] ?? String(option.value),
      count: option.count,
    }));
    // A selected value with no results still shows, so it can be unticked.
    for (const value of selectedValues(query, key)) {
      if (!options.some((option) => option.value === value)) {
        options.push({ value, label: labels[key][value] ?? value, count: 0 });
      }
    }
    return { key, options };
  }).filter((group) => group.options.length > 0);

  const panel = (
    <div className={`flex flex-col gap-6 transition ${pending ? "opacity-60" : ""}`}>
      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{t[group.key]}</legend>
          <ul className="flex flex-col gap-0.5">
            {group.options.map((option) => {
              const checked = selectedValues(query, group.key).includes(option.value);

              return (
                <li key={option.value}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-muted">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(group.key, option.value)}
                      className="h-4 w-4 rounded border-line accent-[var(--brand-primary)]"
                    />
                    <span className={`flex-1 ${checked ? "font-medium" : ""}`}>{option.label}</span>
                    <span className="text-xs tabular-nums text-ink-muted">{option.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => navigate({ type: undefined, capacity: undefined, voltage: undefined, refrigerant: undefined })}
          className="self-start text-sm font-medium text-brand hover:underline"
        >
          {t.clearAll}
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{panel}</div>
      <details className="group rounded-card bg-surface ring-1 ring-line lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
          <span>
            {t.filters}
            {activeCount > 0 ? (
              <span className="ml-2 rounded-full bg-brand px-1.5 py-0.5 text-[11px] text-white">{activeCount}</span>
            ) : null}
          </span>
          <span aria-hidden className="text-ink-muted transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-line p-4">{panel}</div>
      </details>
    </>
  );
}

/** Search box, sort and the chips of the active filters, above the results. */
export function CatalogToolbar({
  query,
  labels,
  total,
  categoryName,
  t,
}: {
  query: ListingQuery;
  labels: Record<FacetKey, Record<string, string>>;
  total: number;
  categoryName: string;
  t: Dictionary["category"];
}) {
  const { pending, navigate, toggle } = useListingNavigation(query);
  const chips = FACETS.flatMap((key) =>
    selectedValues(query, key).map((value) => ({ key, value, label: labels[key][value] ?? value })),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("q");
            navigate({ q: typeof value === "string" && value.trim() ? value.trim() : undefined });
          }}
        >
          <input
            key={query.q ?? ""}
            type="search"
            name="q"
            defaultValue={query.q ?? ""}
            placeholder={t.searchIn.replace("{name}", categoryName)}
            aria-label={t.searchIn.replace("{name}", categoryName)}
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-brand/15"
          />
        </form>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="shrink-0">{t.sortBy}</span>
          <select
            value={query.sort ?? LISTING_SORTS[0]}
            onChange={(event) =>
              navigate({ sort: event.target.value === LISTING_SORTS[0] ? undefined : event.target.value })
            }
            className="rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:ring-4 focus:ring-brand/15"
          >
            {LISTING_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {t.sorts[sort]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={`flex flex-wrap items-center gap-2 text-sm transition ${pending ? "opacity-60" : ""}`}>
        <span className="font-medium text-ink">{t.results.replace("{count}", String(total))}</span>
        {chips.map((chip) => (
          <button
            key={`${chip.key}-${chip.value}`}
            type="button"
            onClick={() => toggle(chip.key, chip.value)}
            className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/15"
          >
            {chip.label}
            <span aria-hidden>×</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import type { ProductDetail } from "@/lib/api/types";

type SpecItem = ProductDetail["spec_groups"][number]["items"][number];
type Feature = ProductDetail["features"][number];

const VISIBLE_SPECS = 12;

/** Specs most buyers look for first, in display order. */
const KEY_SPEC_PATTERNS = [
  /cooling capacity/i,
  /heating capacity/i,
  /\bseer2?\b/i,
  /\bhspf2?\b/i,
  /power|voltage/i,
  /refrigerant/i,
];

export function keySpecs(groups: ProductDetail["spec_groups"], limit = 4): SpecItem[] {
  const items = groups.flatMap((group) => group.items);
  const picked: SpecItem[] = [];

  for (const pattern of KEY_SPEC_PATTERNS) {
    const match = items.find((item) => pattern.test(item.label) && !picked.includes(item));
    if (match) {
      picked.push(match);
    }
  }

  return (picked.length > 0 ? picked : items).slice(0, limit);
}

/** Short highlights are badges; key features and highlights with a description are cards. */
export function splitFeatures(features: Feature[]): { badges: Feature[]; highlights: Feature[] } {
  const isBadge = (feature: Feature): boolean => feature.type === "highlight" && !feature.description;

  return { badges: features.filter(isBadge), highlights: features.filter((feature) => !isBadge(feature)) };
}

export function KeySpecs({ items, title }: { items: SpecItem[]; title: string }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      <dl className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-surface px-3 py-2.5 ring-1 ring-line">
            <dt className="truncate text-[11px] text-ink-muted" title={item.label}>
              {item.label}
            </dt>
            <dd className="mt-0.5 truncate text-sm font-semibold" title={item.value}>
              {item.value}
              {item.unit ? <span className="ml-1 font-normal text-ink-muted">{item.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function FeatureBadges({ features, limit = 10 }: { features: Feature[]; limit?: number }) {
  if (features.length === 0) {
    return null;
  }

  const hidden = features.length - limit;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {features.slice(0, limit).map((feature) => (
        <li
          key={feature.title}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-2.5 py-1 text-xs font-medium text-brand"
        >
          <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
          </svg>
          {feature.title}
        </li>
      ))}
      {hidden > 0 ? (
        <li className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted">+{hidden}</li>
      ) : null}
    </ul>
  );
}

export function FeatureCards({ features }: { features: Feature[] }) {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <li key={feature.title} className="flex gap-3 rounded-xl bg-surface-muted p-3.5">
          {feature.icon_url ? (
            <img src={feature.icon_url} alt="" loading="lazy" className="h-9 w-9 shrink-0 object-contain" />
          ) : (
            <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold">{feature.title}</p>
            {feature.description ? (
              <p className="mt-0.5 text-[13px] leading-5 text-ink-muted">{feature.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SpecRows({ items }: { items: SpecItem[] }) {
  return (
    <dl className="grid gap-x-8 lg:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2 text-[13px]"
        >
          <dt className="text-ink-muted">{item.label}</dt>
          <dd className="text-right font-medium tabular-nums">
            {item.value}
            {item.unit ? <span className="ml-1 font-normal text-ink-muted">{item.unit}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Compact two-column spec sheet; long lists collapse behind "show all" (no JavaScript needed). */
export function SpecTable({ groups, showAllLabel }: { groups: ProductDetail["spec_groups"]; showAllLabel: string }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  if (groups.length === 1 && !groups[0].name) {
    const items = groups[0].items;

    return (
      <div>
        <SpecRows items={items.slice(0, VISIBLE_SPECS)} />
        {items.length > VISIBLE_SPECS ? (
          <details className="group">
            <summary className="mt-4 inline-flex cursor-pointer list-none rounded-full px-4 py-2 text-sm font-medium ring-1 ring-line hover:text-brand hover:ring-brand/40 group-open:hidden">
              {showAllLabel.replace("{count}", String(total))}
            </summary>
            <SpecRows items={items.slice(VISIBLE_SPECS)} />
          </details>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, index) => (
        <div key={`${group.name}-${index}`}>
          {group.name ? (
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">{group.name}</h3>
          ) : null}
          <SpecRows items={group.items} />
        </div>
      ))}
    </div>
  );
}

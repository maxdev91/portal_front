import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** `light` sits on the brand gradient; `dark` on a plain surface. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const styles =
    tone === "light"
      ? { base: "text-white/80", link: "hover:text-white", current: "text-white" }
      : { base: "text-ink-muted", link: "hover:text-brand", current: "font-medium text-ink" };

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${styles.base}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

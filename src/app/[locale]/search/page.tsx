import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { ProductGrid } from "@/components/ProductCard";
import { GridSkeleton } from "@/components/Skeleton";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { searchCatalog } from "@/lib/api/catalog";

export default async function SearchPage(props: PageProps<"/[locale]/search">) {
  const { locale: rawLocale } = await props.params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);

  return (
    <Container className="py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t.search.title}</h1>
      <Suspense fallback={<GridSkeleton />}>
        <SearchResults {...props} />
      </Suspense>
    </Container>
  );
}

async function SearchResults({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);
  const raw = (await searchParams).q;
  const term = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim().slice(0, 100);

  return (
    <>
      <form className="mb-8 flex max-w-xl gap-3">
        <input
          type="search"
          name="q"
          required
          minLength={2}
          defaultValue={term}
          placeholder={t.nav.searchPlaceholder}
          className="w-full rounded-full border border-line bg-surface px-5 py-3 outline-none focus:ring-4 focus:ring-brand/20"
        />
        <button type="submit" className="rounded-full bg-brand px-6 font-semibold text-white">
          {t.nav.search}
        </button>
      </form>
      {term.length < 2 ? (
        <p className="text-ink-muted">{t.search.hint}</p>
      ) : (
        <SearchList locale={locale} term={term} t={t.search} />
      )}
    </>
  );
}

async function SearchList({ locale, term, t }: { locale: Locale; term: string; t: Dictionary["search"] }) {
  const { products, categories } = await searchCatalog(locale, term);

  if (products.length === 0 && categories.length === 0) {
    return <EmptyState message={t.empty} />;
  }

  return (
    <div className="flex flex-col gap-10">
      {categories.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t.categories}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={`${category.brand.slug}-${category.slug}`}>
                <Link
                  href={`/${locale}/${category.brand.slug}/${category.slug}`}
                  className="group flex h-full items-center gap-3 rounded-card bg-surface p-3 ring-1 ring-line transition hover:shadow-card hover:ring-brand/40"
                >
                  <span className="grid h-14 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-line">
                    {category.image_url ? (
                      <img src={category.image_url} alt="" loading="lazy" className="h-full w-full object-contain" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-brand">
                      {category.brand.name}
                    </span>
                    <span className="block truncate text-sm font-semibold group-hover:text-brand">{category.name}</span>
                    {category.path.length > 0 ? (
                      <span className="block truncate text-xs text-ink-muted">{category.path.join(" › ")}</span>
                    ) : null}
                  </span>
                  <span
                    className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                    title={t.productsCount.replace("{count}", String(category.products_total))}
                  >
                    {category.products_total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {products.length > 0 ? (
        <section>
          {categories.length > 0 ? <h2 className="mb-4 text-lg font-semibold">{t.products}</h2> : null}
          <ProductGrid products={products} locale={locale} />
        </section>
      ) : null}
    </div>
  );
}

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandCatalogs } from "@/components/BrandCatalogs";
import { BrandMark } from "@/components/BrandMark";
import { BrandTheme } from "@/components/BrandTheme";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogFilters, CatalogToolbar } from "@/components/CatalogFilters";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { Pagination } from "@/components/Pagination";
import { ProductGrid } from "@/components/ProductCard";
import { GridSkeleton, HeroSkeleton } from "@/components/Skeleton";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBrandPage, getBrands, getCategoryPage } from "@/lib/api/catalog";
import { LISTING_SORTS, type Category, type ListingQuery } from "@/lib/api/types";
import { formatCapacity } from "@/lib/format";

/** Every brand/category pair, built bottom-up so it does not depend on the parent segment's params. */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : locales[0];
  const brands = await getBrands(locale);
  const pages = await Promise.all(brands.map((brand) => getBrandPage(locale, brand.slug)));

  return pages
    .filter((page) => page !== null)
    .flatMap((page) =>
      flattenCategories(page.categories).map((item) => ({
        brand: page.brand.slug,
        category: item.slug,
      })),
    );
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children ?? [])]);
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const text = Array.isArray(value) ? value[0] : value;
  return text?.trim() ? text.trim() : undefined;
}

function listingQuery(params: SearchParams): ListingQuery {
  const sort = first(params.sort);

  return {
    type: first(params.type),
    capacity: first(params.capacity),
    voltage: first(params.voltage),
    refrigerant: first(params.refrigerant),
    q: first(params.q),
    sort: LISTING_SORTS.find((item) => item === sort),
  };
}

export default function CategoryPage(props: PageProps<"/[locale]/[brand]/[category]">) {
  return (
    <Suspense
      fallback={
        <>
          <HeroSkeleton />
          <Container className="py-12">
            <GridSkeleton />
          </Container>
        </>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  );
}

async function CategoryContent({ params, searchParams }: PageProps<"/[locale]/[brand]/[category]">) {
  const { locale: rawLocale, brand: brandSlug, category: categorySlug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);
  const rawSearch = await searchParams;
  const page = Math.max(1, Number(first(rawSearch.page)) || 1);
  const query = listingQuery(rawSearch);

  const result = await getCategoryPage(locale, brandSlug, categorySlug, page, query);

  if (!result) {
    notFound();
  }

  const { brand, category, parent, products, facets, catalogs } = result.data;
  const filtered = Boolean(query.type || query.capacity || query.voltage || query.refrigerant || query.q);
  const labels = {
    type: Object.fromEntries((category.children ?? []).map((child) => [child.slug, child.name])),
    capacity: Object.fromEntries(
      facets.capacity.map((option) => [String(option.value), formatCapacity(option.value, locale)]),
    ),
    voltage: {},
    refrigerant: {},
  };

  return (
    <BrandTheme brand={brand}>
      {/* Brand colors and logo, so it is clear which brand's catalog this is. */}
      <PageHero compact>
        <Breadcrumbs
          items={[
            { label: brand.name, href: `/${locale}/${brand.slug}` },
            ...(parent ? [{ label: parent.name, href: `/${locale}/${brand.slug}/${parent.slug}` }] : []),
            { label: category.name },
          ]}
        />
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandMark brand={brand} />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
              <p className="mt-1 text-sm text-white/75">
                {t.brand.productsCount.replace("{count}", String(category.products_total ?? result.meta.total))}
              </p>
            </div>
          </div>
          <BrandCatalogs
            catalogs={catalogs ?? []}
            locale={locale}
            labels={{
              heading: t.brand.catalogs,
              view: t.brand.viewCatalog,
              download: t.assets.download,
              preparing: t.assets.preparing,
              forbidden: t.assets.forbidden,
              error: t.assets.error,
            }}
          />
        </div>
      </PageHero>

      <Container className="grid gap-6 py-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CatalogFilters facets={facets} query={query} labels={labels} t={t.category} />
        </aside>

        <div className="flex flex-col gap-5">
          <CatalogToolbar
            query={query}
            labels={labels}
            total={result.meta.total}
            categoryName={category.name}
            t={t.category}
          />

          {products.length > 0 ? (
            <ProductGrid products={products} locale={locale} />
          ) : (
            <EmptyState message={filtered ? t.category.noResults : t.category.empty} />
          )}

          <Pagination
            meta={result.meta}
            baseHref={`/${locale}/${brand.slug}/${category.slug}`}
            labels={t.category}
            query={query}
          />
        </div>
      </Container>
    </BrandTheme>
  );
}

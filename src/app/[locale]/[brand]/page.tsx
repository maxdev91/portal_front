import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandCatalogs } from "@/components/BrandCatalogs";
import { BrandMark } from "@/components/BrandMark";
import { BrandTheme } from "@/components/BrandTheme";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductCard";
import { GridSkeleton, HeroSkeleton } from "@/components/Skeleton";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { getBrandPage, getBrands } from "@/lib/api/catalog";
import type { Brand, Category } from "@/lib/api/types";

const VISIBLE_SUBCATEGORIES = 5;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const brands = await getBrands(isLocale(params.locale) ? params.locale : locales[0]);
  return brands.map((brand) => ({ brand: brand.slug }));
}

export default function BrandPage(props: PageProps<"/[locale]/[brand]">) {
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
      <BrandContent {...props} />
    </Suspense>
  );
}

async function BrandContent({ params }: PageProps<"/[locale]/[brand]">) {
  const { locale: rawLocale, brand: brandSlug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);
  const page = await getBrandPage(locale, brandSlug);

  if (!page) {
    notFound();
  }

  const { brand, categories, featured_products: featured } = page;

  return (
    <BrandTheme brand={brand}>
      <PageHero>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <BrandMark brand={brand} size="lg" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{brand.name}</h1>
              {brand.description ? <p className="mt-2 max-w-2xl text-white/80">{brand.description}</p> : null}
              <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                <li className="rounded-full bg-white/15 px-3 py-1 font-medium">
                  {t.brand.productsCount.replace("{count}", String(page.products_total))}
                </li>
                <li className="rounded-full bg-white/15 px-3 py-1 font-medium">
                  {t.brand.categoriesCount.replace("{count}", String(categories.length))}
                </li>
              </ul>
            </div>
          </div>
          <BrandCatalogs
            catalogs={page.catalogs ?? []}
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

      <Container className="py-10">
        <h2 className="mb-5 text-xl font-semibold">{t.brand.browse}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} brand={brand} locale={locale} t={t} />
          ))}
        </div>

        {featured.length > 0 ? (
          <>
            <h2 className="mb-5 mt-14 text-xl font-semibold">{t.brand.featured}</h2>
            <ProductGrid products={featured} locale={locale} />
          </>
        ) : null}
      </Container>
    </BrandTheme>
  );
}

function CategoryCard({
  category,
  brand,
  locale,
  t,
}: {
  category: Category;
  brand: Brand;
  locale: Locale;
  t: Dictionary;
}) {
  const href = (slug: string) => `/${locale}/${brand.slug}/${slug}`;
  const children = category.children ?? [];
  const hidden = children.length - VISIBLE_SUBCATEGORIES;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-line transition hover:shadow-card hover:ring-brand/30">
      <Link href={href(category.slug)} className="flex items-center gap-4 p-5">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-line">
          {category.image_url ? (
            <img
              src={category.image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-2xl font-bold text-brand/30">{category.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug group-hover:text-brand">{category.name}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {t.brand.productsCount.replace("{count}", String(category.products_total ?? 0))}
          </p>
        </div>
        <span
          aria-hidden
          className="ml-auto text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
        >
          →
        </span>
      </Link>
      {children.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5 border-t border-line/70 px-5 py-3.5">
          {children.slice(0, VISIBLE_SUBCATEGORIES).map((child) => (
            <li key={child.id}>
              <Link
                href={href(child.slug)}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted hover:bg-brand/10 hover:text-brand"
              >
                {child.name}
                <span className="text-[10px] opacity-70">{child.products_total}</span>
              </Link>
            </li>
          ))}
          {hidden > 0 ? (
            <li>
              <Link
                href={href(category.slug)}
                className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium text-brand hover:underline"
              >
                +{hidden}
              </Link>
            </li>
          ) : null}
        </ul>
      ) : null}
    </article>
  );
}

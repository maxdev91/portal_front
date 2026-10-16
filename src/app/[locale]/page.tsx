import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { BrandTheme } from "@/components/BrandTheme";
import { Container } from "@/components/Container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBrandPage, getBrands } from "@/lib/api/catalog";
import { getSiteSettings } from "@/lib/api/site";
import type { BrandPage } from "@/lib/api/types";
import { COMFORTSIDE_COLORS } from "@/lib/company";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);
  const [brands, site] = await Promise.all([getBrands(locale), getSiteSettings(locale)]);
  const pages = (await Promise.all(brands.map((brand) => getBrandPage(locale, brand.slug)))).filter(
    (page): page is BrandPage => page !== null,
  );
  const number = new Intl.NumberFormat(locale);

  return (
    <BrandTheme brand={site ?? COMFORTSIDE_COLORS}>
      <section className="relative overflow-hidden bg-gradient-to-br from-hero-from to-hero-to text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl"
        />
        <Container className="relative py-16 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{t.home.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{t.home.subtitle}</p>
          <form
            action={`/${locale}/search`}
            role="search"
            className="mt-8 flex max-w-xl gap-2 rounded-full bg-white p-1.5 shadow-xl"
          >
            <input
              type="search"
              name="q"
              required
              minLength={2}
              placeholder={t.nav.searchPlaceholder}
              aria-label={t.nav.search}
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t.nav.search}
            </button>
          </form>
        </Container>
      </section>

      <Container className="grid gap-5 pt-16 sm:grid-cols-2 sm:pt-20 xl:grid-cols-4">
        {pages.map(({ brand, products_total: total, categories }) => (
          <Link
            key={brand.id}
            href={`/${locale}/${brand.slug}`}
            className="group relative flex min-h-60 flex-col overflow-hidden rounded-card p-6 text-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, ${brand.primary_color}, ${brand.accent_color})` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
            />
            <span className="relative">
              <BrandMark brand={brand} />
            </span>

            <ul className="relative mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <li className="rounded-full bg-white/15 px-2.5 py-1">
                {t.brand.productsCount.replace("{count}", number.format(total))}
              </li>
              <li className="rounded-full bg-white/15 px-2.5 py-1">
                {t.brand.categoriesCount.replace("{count}", String(categories.length))}
              </li>
            </ul>

            {brand.description ? (
              <p className="relative mt-4 line-clamp-2 text-sm text-white/80">{brand.description}</p>
            ) : null}

            <span className="relative mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">
              {t.home.exploreBrand} {brand.name}
              <span aria-hidden className="transition group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </Container>
    </BrandTheme>
  );
}

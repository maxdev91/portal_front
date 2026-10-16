import { BrandTheme } from "@/components/BrandTheme";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ProductDetail } from "@/lib/api/types";
import { formatCapacity } from "@/lib/format";
import { DownloadsSection } from "./DownloadsSection";
import { HeroGallery } from "./HeroGallery";
import { ProductV2Theme } from "./ProductV2Theme";
import { SpecList } from "./SpecList";

/**
 * Immersive product page (v2), enabled per brand in the admin. Sections without data are left out,
 * and every color comes from the brand's product theme.
 */
export function ProductViewV2({ product, locale }: { product: ProductDetail; locale: Locale }) {
  const t = getDictionary(locale);
  const { brand, category } = product;
  const specs = product.spec_groups.flatMap((group) => group.items);
  const badges = [
    product.capacity_btu ? formatCapacity(product.capacity_btu, locale) : null,
    product.voltage,
    product.refrigerant,
  ].filter((badge): badge is string => Boolean(badge));
  const action =
    "inline-flex items-center rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition";

  return (
    <BrandTheme brand={brand}>
      <ProductV2Theme theme={brand.product_theme}>
        <section className="bg-[radial-gradient(circle_at_center,var(--v2-hero-from)_0%,var(--v2-hero-to)_100%)] pb-24 pt-3">
          <Container className="mb-3">
            <Breadcrumbs
              items={[
                { label: brand.name, href: `/${locale}/${brand.slug}` },
                ...(category.parent
                  ? [{ label: category.parent.name, href: `/${locale}/${brand.slug}/${category.parent.slug}` }]
                  : []),
                { label: category.name, href: `/${locale}/${brand.slug}/${category.slug}` },
                { label: product.sku },
              ]}
            />
          </Container>
          <HeroGallery images={product.images} name={product.name} t={t.productV2} />
        </section>

        <div className="relative z-10 mx-auto -mt-24 mb-6 flex w-[calc(100%-40px)] max-w-[1440px] flex-col gap-2 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgb(0_0_0/0.1)] md:p-8">
          <h1 className="text-[22px] font-bold leading-tight text-ink md:text-[28px]">{product.name}</h1>
          {product.short_description ? (
            <p className="text-sm leading-snug text-ink-muted md:text-lg">{product.short_description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <a href="#downloads" className={`${action} bg-v2-button text-white hover:brightness-110`}>
                {t.productV2.downloads}
              </a>
              {specs.length > 0 ? (
                <a href="#specifications" className={`${action} border border-line text-ink hover:border-v2-accent`}>
                  {t.productV2.technicalSpecifications}
                </a>
              ) : null}
            </div>
            {badges.length > 0 ? (
              <ul className="flex flex-wrap justify-end gap-3">
                {badges.map((badge) => (
                  <li key={badge} className="rounded-full bg-line px-4 py-1.5 text-[13px] font-semibold text-ink">
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {product.description ? (
          <section className="bg-v2-description pb-8 pt-4 md:pb-16 md:pt-8">
            <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
              <h2 className="mb-4 text-[22px] font-bold text-ink md:text-[32px]">{t.productV2.fullDescription}</h2>
              <div
                className="prose-portal text-sm leading-relaxed text-ink-muted md:text-lg md:leading-[1.8]"
                // Rich text from the brand's back office, sanitized by the API.
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </section>
        ) : null}

        {specs.length > 0 ? (
          <section id="specifications" className="scroll-mt-24 bg-v2-specifications py-10 md:py-16">
            <div className="mx-auto max-w-[1440px] px-5">
              <h2 className="mb-5 text-2xl font-bold text-ink md:mb-8 md:text-[32px]">
                {t.productV2.technicalSpecifications}
              </h2>
              <SpecList specs={specs} t={t.productV2} />
            </div>
          </section>
        ) : null}

        <DownloadsSection
          productSlug={product.slug}
          assets={product.assets}
          videos={product.videos}
          accessories={product.accessories}
          locale={locale}
          t={t}
        />
      </ProductV2Theme>
    </BrandTheme>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductViewV1 } from "@/components/product/ProductViewV1";
import { ProductViewV2 } from "@/components/product/v2/ProductViewV2";
import { HeroSkeleton } from "@/components/Skeleton";
import { isLocale } from "@/i18n/config";
import { getProduct, getProductSlugs } from "@/lib/api/catalog";

/**
 * Every product page is prerendered at build time, so even the first visit gets the full page (no loading state).
 * Admin changes revalidate them through the "catalog" cache tag.
 */
export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  if (slugs.length === 0) {
    throw new Error("No products to prerender: the API must be reachable during the build.");
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(isLocale(locale) ? locale : "en", slug);

  return product
    ? { title: `${product.name} (${product.sku})`, description: product.short_description ?? undefined }
    : {};
}

export default function ProductPage(props: PageProps<"/[locale]/products/[slug]">) {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <ProductContent {...props} />
    </Suspense>
  );
}

async function ProductContent({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const product = await getProduct(locale, slug);

  if (!product) {
    notFound();
  }

  // Each brand chooses its product page design in the admin.
  return product.brand.product_layout === "v2" ? (
    <ProductViewV2 product={product} locale={locale} />
  ) : (
    <ProductViewV1 product={product} locale={locale} />
  );
}

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { apiRequest } from "./client";
import type {
  Brand,
  BrandPage,
  CategoryPage,
  ListingQuery,
  PaginationMeta,
  ProductCard,
  ProductDetail,
  SearchCategory,
} from "./types";

/**
 * Catalog reads are cached by Next.js and tagged "catalog". The API calls POST /api/revalidate
 * after any admin change, which marks every catalog entry stale (stale-while-revalidate).
 */
export const CATALOG_TAG = "catalog";

export async function getBrands(locale: Locale): Promise<Brand[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: Brand[] }>("brands", { locale });
  return response?.data ?? [];
}

export async function getBrandPage(locale: Locale, brandSlug: string): Promise<BrandPage | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: BrandPage }>(`brands/${encodeURIComponent(brandSlug)}`, { locale });
  return response?.data ?? null;
}

export async function getCategoryPage(
  locale: Locale,
  brandSlug: string,
  categorySlug: string,
  page: number,
  filters: ListingQuery = {},
): Promise<{ data: CategoryPage; meta: PaginationMeta } | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  return apiRequest<{ data: CategoryPage; meta: PaginationMeta }>(
    `brands/${encodeURIComponent(brandSlug)}/categories/${encodeURIComponent(categorySlug)}`,
    { locale, query: { ...filters, page } },
  );
}

/** Slugs of every active product, to prerender all product pages at build time. */
export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: string[] }>("product-slugs");
  return response?.data ?? [];
}

export async function getProduct(locale: Locale, productSlug: string): Promise<ProductDetail | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: ProductDetail }>(`products/${encodeURIComponent(productSlug)}`, { locale });
  return response?.data ?? null;
}

/** Products by model, SKU or name, plus the categories whose name matches (with their products). */
export async function searchCatalog(
  locale: Locale,
  term: string,
): Promise<{ products: ProductCard[]; categories: SearchCategory[] }> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const response = await apiRequest<{ data: ProductCard[]; categories: SearchCategory[] }>("search", {
    locale,
    query: { q: term },
  });
  return { products: response?.data ?? [], categories: response?.categories ?? [] };
}

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { CATALOG_TAG } from "./catalog";
import { apiRequest } from "./client";
import type { ContentPage, SiteSettings } from "./types";

/**
 * Company content edited in the admin. It shares the "catalog" tag, so any admin change revalidates it too.
 */
export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: SiteSettings }>("site", { locale });
  return response?.data ?? null;
}

export async function getContentPage(locale: Locale, slug: string): Promise<ContentPage | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  const response = await apiRequest<{ data: ContentPage }>(`pages/${encodeURIComponent(slug)}`, { locale });
  return response?.data ?? null;
}

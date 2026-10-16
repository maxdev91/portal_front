import "server-only";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { getSessionToken } from "@/lib/session";
import { ApiError, apiRequest } from "./client";
import type { Asset, PaginationMeta, SessionUser } from "./types";

/**
 * The signed-in user, or null for guests and expired sessions. Request-time only; memoized per request,
 * so several components can ask without calling the API again.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  try {
    const response = await apiRequest<{ data: SessionUser }>("me", { token });
    return response?.data ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});

export type LibraryFilters = {
  brand_id?: string;
  type?: string;
  q?: string;
  page?: string;
};

/** Marketing library for the current session (public material for guests). Never cached: depends on the user. */
export async function getLibrary(
  locale: Locale,
  filters: LibraryFilters,
): Promise<{ data: Asset[]; meta: PaginationMeta }> {
  const token = await getSessionToken();
  const response = await apiRequest<{ data: Asset[]; meta: PaginationMeta }>("assets", {
    locale,
    token,
    query: filters,
  });

  return response ?? { data: [], meta: { current_page: 1, last_page: 1, per_page: 30, total: 0 } };
}

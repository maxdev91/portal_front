import "server-only";
import type { Locale } from "@/i18n/config";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | null,
    /** Field errors of a 422 response. */
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(`API request failed with status ${status}${code ? ` (${code})` : ""}`);
  }
}

type ApiRequest = {
  locale?: Locale;
  token?: string | null;
  method?: "GET" | "POST";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
};

function apiBaseUrl(): string {
  const url = process.env.API_INTERNAL_URL;
  if (!url) {
    throw new Error("API_INTERNAL_URL is not set");
  }
  return url.replace(/\/$/, "");
}

/**
 * Server-side call to the Laravel API. Session tokens never reach the browser:
 * they are read from the httpOnly cookie on the server and sent as a Bearer token here.
 * Returns null on 404 so pages can render notFound().
 */
export async function apiRequest<T>(path: string, request: ApiRequest = {}): Promise<T | null> {
  const url = new URL(`${apiBaseUrl()}/${path.replace(/^\//, "")}`);

  if (request.locale) {
    url.searchParams.set("locale", request.locale);
  }
  for (const [key, value] of Object.entries(request.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (request.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (request.token) {
    headers.Authorization = `Bearer ${request.token}`;
  }

  const response = await fetch(url, {
    method: request.method ?? "GET",
    headers,
    body: request.body !== undefined ? JSON.stringify(request.body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      errors?: Record<string, string[]>;
    } | null;
    throw new ApiError(response.status, payload?.message ?? null, payload?.errors ?? {});
  }

  if (response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

/**
 * Server-side call that returns the raw response, for binary payloads that are passed on as a stream
 * (e.g. a ZIP). No timeout: large archives take as long as they take.
 */
export async function apiStream(path: string, request: Pick<ApiRequest, "locale" | "token"> = {}): Promise<Response> {
  const url = new URL(`${apiBaseUrl()}/${path.replace(/^\//, "")}`);
  if (request.locale) {
    url.searchParams.set("locale", request.locale);
  }

  return fetch(url, {
    headers: request.token ? { Authorization: `Bearer ${request.token}` } : {},
    cache: "no-store",
  });
}

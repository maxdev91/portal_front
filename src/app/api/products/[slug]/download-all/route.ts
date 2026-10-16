import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { apiStream } from "@/lib/api/client";
import { getSessionToken } from "@/lib/session";
import { publicUrl } from "@/lib/url";

/**
 * "Download all" of a product: streams the API's ZIP to the browser with the session token from the
 * httpOnly cookie, so distributor-only documents are included for signed-in users.
 */
export async function GET(request: NextRequest, context: RouteContext<"/api/products/[slug]/download-all">) {
  const { slug } = await context.params;
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const upstream = await apiStream(`products/${encodeURIComponent(slug)}/download-all`, {
    locale,
    token: await getSessionToken(),
  });

  if (upstream.status === 401) {
    return NextResponse.redirect(publicUrl(`/${locale}/login`));
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": upstream.headers.get("content-disposition") ?? 'attachment; filename="documents.zip"',
      "Cache-Control": "no-store",
    },
  });
}

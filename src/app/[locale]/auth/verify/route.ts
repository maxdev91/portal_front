import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { ApiError, apiRequest } from "@/lib/api/client";
import { setSessionToken } from "@/lib/session";
import { publicUrl } from "@/lib/url";

/** Landing URL of the magic link e-mail: exchanges the link for a session cookie, then opens the library. */
export async function GET(request: NextRequest, context: RouteContext<"/[locale]/auth/verify">) {
  const { locale: rawLocale } = await context.params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const email = request.nextUrl.searchParams.get("email") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";

  try {
    const response = await apiRequest<{ data: { token: string } }>("auth/verify", {
      method: "POST",
      body: { email, token },
    });

    if (response) {
      await setSessionToken(response.data.token);
      return NextResponse.redirect(publicUrl(`/${locale}/library`));
    }
  } catch (error) {
    if (!(error instanceof ApiError) || error.status >= 500) {
      throw error;
    }
  }

  return NextResponse.redirect(publicUrl(`/${locale}/login?error=invalid_link`));
}

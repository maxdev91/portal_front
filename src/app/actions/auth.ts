"use server";

import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { apiRequest } from "@/lib/api/client";
import { clearSessionToken, getSessionToken } from "@/lib/session";

export type MagicLinkState = { status: "idle" | "sent" | "error" };

export async function requestMagicLink(_previous: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();
  const locale = String(formData.get("locale") ?? "en");

  if (!email || !email.includes("@") || !isLocale(locale)) {
    return { status: "error" };
  }

  try {
    await apiRequest("auth/magic-link", { method: "POST", locale, body: { email } });
    return { status: "sent" };
  } catch {
    return { status: "error" };
  }
}

export async function signOut(locale: Locale): Promise<never> {
  const token = await getSessionToken();

  if (token) {
    await apiRequest("auth/logout", { method: "POST", token }).catch(() => null);
  }

  await clearSessionToken();
  redirect(`/${locale}`);
}

"use server";

import { isLocale } from "@/i18n/config";
import { ApiError, apiRequest } from "@/lib/api/client";

export type ContactFormState = {
  status: "idle" | "sent" | "invalid" | "error" | "throttled";
  errors: Record<string, string[]>;
};

const FIELDS = ["first_name", "last_name", "email", "phone", "company", "message", "website"] as const;

export async function sendContactMessage(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const locale = String(formData.get("locale") ?? "en");
  const body: Record<string, string | boolean> = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  );
  body.sms_consent = formData.get("sms_consent") === "on";
  body.accept_terms = formData.get("accept_terms") === "on";

  try {
    await apiRequest("contact", { method: "POST", locale: isLocale(locale) ? locale : "en", body });
    return { status: "sent", errors: {} };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return { status: "invalid", errors: error.errors };
    }
    if (error instanceof ApiError && error.status === 429) {
      return { status: "throttled", errors: {} };
    }
    return { status: "error", errors: {} };
  }
}

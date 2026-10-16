"use client";

import { useActionState } from "react";
import { requestMagicLink, type MagicLinkState } from "@/app/actions/auth";
import type { Locale } from "@/i18n/config";

type Labels = { email: string; submit: string; sending: string; sent: string; error: string };

export function LoginForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [state, action, pending] = useActionState<MagicLinkState, FormData>(requestMagicLink, { status: "idle" });

  if (state.status === "sent") {
    return <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">{labels.sent}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {labels.email}
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-xl border border-line bg-surface px-4 py-3 text-base outline-none ring-brand/30 focus:ring-4"
        />
      </label>
      {state.status === "error" ? <p className="text-sm text-red-600">{labels.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? labels.sending : labels.submit}
      </button>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { sendContactMessage, type ContactFormState } from "@/app/actions/contact";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

type Texts = {
  heading: string | null;
  intro: string | null;
  sms_consent: string | null;
  disclaimer: string | null;
  terms_url: string | null;
  privacy_url: string | null;
};

const INITIAL: ContactFormState = { status: "idle", errors: {} };

const inputClass =
  "w-full rounded-lg border bg-surface px-3.5 text-sm text-ink shadow-xs outline-none transition placeholder:text-ink-muted/60 hover:border-ink/25 focus:border-brand focus:ring-4 focus:ring-brand/15";

function Label({ label, required, optional }: { label: string; required: boolean; optional: string }) {
  return (
    <span className="flex items-baseline justify-between gap-2 text-[13px] font-medium text-ink">
      <span>
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      {required ? null : <span className="text-xs font-normal text-ink-muted">{optional}</span>}
    </span>
  );
}

function Field({
  name,
  label,
  optional,
  error,
  type = "text",
  required = false,
  autoComplete,
}: {
  name: string;
  label: string;
  optional: string;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label label={label} required={required} optional={optional} />
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`h-10 ${inputClass} ${error ? "border-red-400" : "border-line"}`}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function ContactForm({ locale, texts, t }: { locale: Locale; texts: Texts; t: Dictionary["contact"] }) {
  const [state, action, pending] = useActionState(sendContactMessage, INITIAL);
  const [formKey, setFormKey] = useState(0);
  const error = (field: string) => state.errors[field]?.[0];

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-start gap-3 py-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            className="h-6 w-6"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        <p className="text-lg font-semibold text-ink">{t.sentTitle}</p>
        <p className="text-sm text-ink-muted">{t.sentText}</p>
        <button
          type="button"
          onClick={() => setFormKey((key) => key + 1)}
          className="text-sm font-semibold text-brand hover:underline"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form key={formKey} action={action} className="flex flex-col gap-4" noValidate>
      {texts.heading || texts.intro ? (
        <div>
          {texts.heading ? <h2 className="text-xl font-bold tracking-tight text-ink">{texts.heading}</h2> : null}
          {texts.intro ? <p className="mt-1 text-sm text-ink-muted">{texts.intro}</p> : null}
        </div>
      ) : null}

      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {/* On wide screens: contact fields on the left, the message on the right, so the form stays short. */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="first_name"
              label={t.firstName}
              optional={t.optional}
              required
              autoComplete="given-name"
              error={error("first_name")}
            />
            <Field
              name="last_name"
              label={t.lastName}
              optional={t.optional}
              autoComplete="family-name"
              error={error("last_name")}
            />
            <Field
              name="email"
              type="email"
              label={t.email}
              optional={t.optional}
              required
              autoComplete="email"
              error={error("email")}
            />
            <Field
              name="phone"
              type="tel"
              label={t.phone}
              optional={t.optional}
              autoComplete="tel"
              error={error("phone")}
            />
          </div>
          <Field
            name="company"
            label={t.company}
            optional={t.optional}
            autoComplete="organization"
            error={error("company")}
          />
        </div>
        <label className="flex flex-col gap-1.5">
          <Label label={t.message} required={false} optional={t.optional} />
          <textarea
            name="message"
            rows={4}
            aria-invalid={Boolean(error("message"))}
            className={`min-h-24 flex-1 resize-y py-2.5 ${inputClass} ${error("message") ? "border-red-400" : "border-line"}`}
          />
          {error("message") ? <span className="text-xs text-red-600">{error("message")}</span> : null}
        </label>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-line pt-4">
        {texts.sms_consent ? (
          <label className="flex gap-3 text-xs leading-5 text-ink-muted">
            <input
              type="checkbox"
              name="sms_consent"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
            />
            <span>{texts.sms_consent}</span>
          </label>
        ) : null}
        <label className="flex gap-3 text-xs leading-5 text-ink-muted">
          <input
            type="checkbox"
            name="accept_terms"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
          />
          <span className={error("accept_terms") ? "text-red-600" : ""}>
            {t.acceptTerms}{" "}
            {texts.terms_url ? (
              <a href={texts.terms_url} target="_blank" rel="noreferrer" className="font-medium text-brand underline">
                {t.terms}
              </a>
            ) : (
              t.terms
            )}{" "}
            {t.and}{" "}
            {texts.privacy_url ? (
              <a href={texts.privacy_url} target="_blank" rel="noreferrer" className="font-medium text-brand underline">
                {t.privacy}
              </a>
            ) : (
              t.privacy
            )}
          </span>
        </label>
      </div>

      {state.status !== "idle" ? (
        <p role="alert" className="text-sm text-red-600">
          {state.status === "invalid" ? t.invalid : state.status === "throttled" ? t.throttled : t.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:brightness-105 disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {pending ? t.sending : t.submit}
        {pending ? null : (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
      {texts.disclaimer ? <p className="text-[11px] leading-4 text-ink-muted">{texts.disclaimer}</p> : null}
    </form>
  );
}

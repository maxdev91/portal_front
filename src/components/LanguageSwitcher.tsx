"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full bg-surface-muted p-1 text-xs font-semibold" aria-label={label}>
      {locales.map((locale) => {
        const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${locale}`);

        return (
          <Link
            key={locale}
            href={href}
            aria-current={locale === current}
            className={`rounded-full px-2.5 py-1 uppercase ${locale === current ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}

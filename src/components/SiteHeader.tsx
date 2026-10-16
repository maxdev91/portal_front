import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getCurrentUser } from "@/lib/api/account";
import { getBrands } from "@/lib/api/catalog";
import { getSiteSettings } from "@/lib/api/site";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

const desktopLink = "rounded-full px-3 py-1.5 transition hover:text-ink";
const desktopActive = "bg-brand/10 text-brand hover:text-brand";
const mobileLink = "rounded-lg px-3 py-2.5 text-ink hover:bg-surface-muted hover:text-brand";
const mobileActive = "bg-brand/10 font-semibold text-brand!";

export async function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [brands, site] = await Promise.all([getBrands(locale), getSiteSettings(locale)]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-3 lg:gap-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight">
          {site?.logo_url ? (
            <img src={site.logo_url} alt={site.company_name} className="h-6 w-auto sm:h-7" />
          ) : (
            <span className="text-lg font-extrabold">{site?.company_name ?? "Comfortside"}</span>
          )}
          <span className="hidden border-l border-line pl-2.5 text-[10px] font-semibold uppercase leading-tight tracking-widest text-ink-muted lg:block">
            Distributor
            <br />
            Portal
          </span>
        </Link>
        <nav className="hidden items-center gap-1 whitespace-nowrap text-sm font-medium text-ink-muted lg:flex">
          {brands.map((brand) => (
            <NavLink
              key={brand.id}
              href={`/${locale}/${brand.slug}`}
              className={`hidden 2xl:inline ${desktopLink}`}
              activeClassName={desktopActive}
            >
              {brand.name}
            </NavLink>
          ))}
          <Suspense fallback={null}>
            <LibraryLink
              locale={locale}
              label={t.nav.library}
              className={desktopLink}
              activeClassName={desktopActive}
            />
          </Suspense>
          <NavLink href={`/${locale}/about`} className={desktopLink} activeClassName={desktopActive}>
            {t.nav.about}
          </NavLink>
          <NavLink href={`/${locale}/contact`} className={desktopLink} activeClassName={desktopActive}>
            {t.nav.contact}
          </NavLink>
        </nav>
        <HeaderSearch locale={locale} t={t} className="ml-auto hidden min-w-44 flex-1 md:flex md:max-w-xs" />
        {/* On small phones the language switcher moves into the menu to leave room for the menu button. */}
        <div className="ml-auto hidden sm:block md:ml-0">
          <LanguageSwitcher current={locale} label={t.nav.language} />
        </div>
        <span className="ml-auto sm:hidden" />
        <Suspense fallback={<span className="h-9 w-20 animate-pulse rounded-full bg-surface-muted" />}>
          <UserMenu locale={locale} t={t} />
        </Suspense>
        <MobileMenu label={t.nav.menu}>
          <Container className="flex flex-col gap-4 py-4">
            <HeaderSearch locale={locale} t={t} className="flex md:hidden" inputClassName="py-2.5" />
            <nav aria-label={t.nav.menu} className="flex flex-col text-[15px] font-medium">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{t.nav.brands}</p>
              {brands.map((brand) => (
                <NavLink
                  key={brand.id}
                  href={`/${locale}/${brand.slug}`}
                  className={mobileLink}
                  activeClassName={mobileActive}
                >
                  {brand.name}
                </NavLink>
              ))}
              <span className="my-2 border-t border-line" />
              <Suspense fallback={null}>
                <LibraryLink
                  locale={locale}
                  label={t.nav.library}
                  className={mobileLink}
                  activeClassName={mobileActive}
                />
              </Suspense>
              <NavLink href={`/${locale}/about`} className={mobileLink} activeClassName={mobileActive}>
                {t.nav.about}
              </NavLink>
              <NavLink href={`/${locale}/contact`} className={mobileLink} activeClassName={mobileActive}>
                {t.nav.contact}
              </NavLink>
            </nav>
            <div className="flex items-center justify-between border-t border-line pt-4 sm:hidden">
              <span className="text-sm text-ink-muted">{t.nav.language}</span>
              <LanguageSwitcher current={locale} label={t.nav.language} />
            </div>
          </Container>
        </MobileMenu>
      </Container>
    </header>
  );
}

function HeaderSearch({
  locale,
  t,
  className,
  inputClassName = "py-2",
}: {
  locale: Locale;
  t: Dictionary;
  className: string;
  inputClassName?: string;
}) {
  return (
    <form action={`/${locale}/search`} role="search" className={`relative ${className}`}>
      <input
        type="search"
        name="q"
        required
        minLength={2}
        placeholder={t.nav.searchPlaceholder}
        aria-label={t.nav.search}
        className={`w-full rounded-full border border-line bg-surface-muted pl-4 pr-11 text-sm outline-none focus:ring-4 focus:ring-brand/20 ${inputClassName}`}
      />
      <button
        type="submit"
        aria-label={t.nav.search}
        className="absolute inset-y-0 right-1 my-auto grid h-8 w-8 place-items-center rounded-full text-ink-muted transition hover:bg-surface hover:text-brand"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}

/** The marketing library is for distributors: the link only shows to signed-in users. */
async function LibraryLink({
  locale,
  label,
  className,
  activeClassName,
}: {
  locale: Locale;
  label: string;
  className: string;
  activeClassName: string;
}) {
  const user = await getCurrentUser();

  return user ? (
    <NavLink href={`/${locale}/library`} className={className} activeClassName={activeClassName}>
      {label}
    </NavLink>
  ) : null;
}

async function UserMenu({ locale, t }: { locale: Locale; t: Dictionary }) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href={`/${locale}/login`}
        className="shrink-0 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/85"
      >
        {t.nav.signIn}
      </Link>
    );
  }

  return (
    <form action={signOut.bind(null, locale)} className="flex shrink-0 items-center gap-3">
      <span className="hidden text-right text-xs leading-tight sm:block">
        <span className="block font-semibold text-ink">{user.name}</span>
        {user.company_name ? <span className="text-ink-muted">{user.company_name}</span> : null}
      </span>
      <button
        type="submit"
        className="rounded-full px-3 py-2 text-sm font-medium text-ink-muted ring-1 ring-line hover:text-ink"
      >
        {t.nav.signOut}
      </button>
    </form>
  );
}

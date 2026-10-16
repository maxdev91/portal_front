import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getSiteSettings } from "@/lib/api/site";
import { Container } from "./Container";
import { ContactIcon } from "./content/Icons";

function ContactItem({ icon, children }: { icon: "address" | "phone" | "email"; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/80">
        <ContactIcon name={icon} className="h-4 w-4" />
      </span>
      <span className="pt-2 text-sm leading-snug">{children}</span>
    </li>
  );
}

/** Company footer; every value comes from Site settings in the admin. */
export async function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const site = await getSiteSettings(locale);
  const phone = site?.footer_phone;
  const email = site?.footer_email;

  return (
    <footer className="mt-20 text-white/85" style={{ backgroundColor: site?.accent_color ?? "#28373D" }}>
      <Container className="grid gap-10 py-12 sm:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[auto_auto_minmax(0,1fr)] xl:items-start xl:gap-16">
        <div>
          {site?.logo_light_url ? (
            <img src={site.logo_light_url} alt={site.company_name} className="h-9 w-auto" />
          ) : (
            <p className="text-2xl font-extrabold text-white">{site?.company_name ?? t.meta.title}</p>
          )}
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50">Distributor Portal</p>
        </div>

        <nav aria-label={t.footer.navigation}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{t.footer.navigation}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm font-medium">
            <li>
              <Link href={`/${locale}/about`} className="text-white/85 hover:text-white">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="text-white/85 hover:text-white">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="grid gap-6 sm:col-span-2 sm:grid-cols-3 xl:col-span-1">
          {site?.address ? <ContactItem icon="address">{site.address}</ContactItem> : null}
          {phone ? (
            <ContactItem icon="phone">
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                {phone}
              </a>
              {site?.sms_note ? <span className="mt-1 block text-xs text-white/55">{site.sms_note}</span> : null}
            </ContactItem>
          ) : null}
          {email ? (
            <ContactItem icon="email">
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </ContactItem>
          ) : null}
        </ul>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {site?.legal_name ?? site?.company_name ?? "Comfortside"}. {t.footer.rights}
          </span>
          {site && site.social_links.length > 0 ? (
            <ul className="flex gap-4">
              {site.social_links.map((social) => (
                <li key={social.url}>
                  <a href={social.url} target="_blank" rel="noreferrer" className="capitalize hover:text-white">
                    {social.network}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}

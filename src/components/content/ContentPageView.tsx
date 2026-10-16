import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getContentPage, getSiteSettings } from "@/lib/api/site";
import { COMFORTSIDE_COLORS } from "@/lib/company";
import { BrandTheme } from "../BrandTheme";
import { Container } from "../Container";
import { PageBlocks } from "./PageBlocks";

/**
 * A content page edited in the admin, in the company colors: photo hero with the title, then its blocks.
 * The compact hero (contact) is a short photo band with the blocks below it.
 */
export async function ContentPageView({
  locale,
  slug,
  hero = "full",
}: {
  locale: Locale;
  slug: string;
  hero?: "full" | "compact";
}) {
  const [page, site] = await Promise.all([getContentPage(locale, slug), getSiteSettings(locale)]);

  if (!page) {
    notFound();
  }

  const t = getDictionary(locale);
  const compact = hero === "compact";

  return (
    <BrandTheme brand={site ?? COMFORTSIDE_COLORS}>
      <section className="relative overflow-hidden bg-brand-accent text-white">
        {page.hero_image_url ? (
          <img src={page.hero_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/90 via-brand-accent/60 to-brand-accent/20" />
        {compact ? (
          <Container className="relative flex min-h-[160px] flex-col justify-center py-10 sm:min-h-[200px]">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
            {page.subtitle ? <p className="mt-2 max-w-xl text-white/80">{page.subtitle}</p> : null}
          </Container>
        ) : (
          <Container className="relative flex min-h-[320px] flex-col justify-center pb-28 pt-16 sm:min-h-[380px]">
            <span className="mb-5 block h-1 w-12 rounded-full bg-brand" />
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">{page.title}</h1>
            {page.subtitle ? <p className="mt-4 max-w-xl text-lg text-white/85">{page.subtitle}</p> : null}
          </Container>
        )}
      </section>
      <div className={compact ? "pt-8 sm:pt-10" : "pt-14 sm:pt-16"}>
        <PageBlocks blocks={page.blocks} locale={locale} site={site} t={t} dense={compact} />
      </div>
    </BrandTheme>
  );
}

export async function contentPageTitle(locale: Locale, slug: string): Promise<string | undefined> {
  return (await getContentPage(locale, slug))?.title;
}

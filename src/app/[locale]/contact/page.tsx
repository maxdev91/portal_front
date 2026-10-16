import type { Metadata } from "next";
import { ContentPageView, contentPageTitle } from "@/components/content/ContentPageView";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return { title: await contentPageTitle(isLocale(locale) ? locale : "en", "contact") };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  return <ContentPageView locale={isLocale(locale) ? locale : "en"} slug="contact" hero="compact" />;
}

import type { Metadata } from "next";
import { ContentPageView, contentPageTitle } from "@/components/content/ContentPageView";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return { title: await contentPageTitle(isLocale(locale) ? locale : "en", "about") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  return <ContentPageView locale={isLocale(locale) ? locale : "en"} slug="about" />;
}

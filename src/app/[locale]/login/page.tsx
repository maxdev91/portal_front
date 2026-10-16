import { Suspense } from "react";
import { Container } from "@/components/Container";
import { LoginForm } from "@/components/LoginForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function LoginPage(props: PageProps<"/[locale]/login">) {
  const { locale: rawLocale } = await props.params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-md rounded-card bg-surface p-8 shadow-card ring-1 ring-line">
        <h1 className="text-2xl font-bold tracking-tight">{t.login.title}</h1>
        <p className="mb-6 mt-2 text-ink-muted">{t.login.subtitle}</p>
        <Suspense>
          <InvalidLinkNotice {...props} message={t.login.invalidLink} />
        </Suspense>
        <LoginForm locale={locale} labels={t.login} />
      </div>
    </Container>
  );
}

async function InvalidLinkNotice({ searchParams, message }: PageProps<"/[locale]/login"> & { message: string }) {
  const { error } = await searchParams;

  return error === "invalid_link" ? (
    <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>
  ) : null;
}

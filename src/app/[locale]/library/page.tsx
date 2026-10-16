import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AssetList } from "@/components/AssetList";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCurrentUser, getLibrary } from "@/lib/api/account";
import { getBrands } from "@/lib/api/catalog";
import type { AssetType } from "@/lib/api/types";

export default async function LibraryPage(props: PageProps<"/[locale]/library">) {
  const { locale: rawLocale } = await props.params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.library.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">{t.library.subtitle}</p>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-card bg-surface ring-1 ring-line" />}>
        <LibraryContent {...props} />
      </Suspense>
    </Container>
  );
}

async function LibraryContent({ params, searchParams }: PageProps<"/[locale]/library">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = getDictionary(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const query = await searchParams;
  const pick = (key: string): string | undefined => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  const filters = { brand_id: pick("brand_id"), type: pick("type"), q: pick("q"), page: pick("page") };

  const [library, brands] = await Promise.all([getLibrary(locale, filters), getBrands(locale)]);
  const visibleBrands = user.all_brands ? brands : brands.filter((brand) => user.brand_ids.includes(brand.id));
  const types = Object.keys(t.assets.types) as AssetType[];

  const baseQuery = new URLSearchParams(
    Object.entries({ brand_id: filters.brand_id, type: filters.type, q: filters.q }).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  ).toString();

  return (
    <>
      <form className="mt-8 flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card ring-1 ring-line md:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder={t.nav.searchPlaceholder}
          className="flex-1 rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-4 focus:ring-brand/20"
        />
        <select
          name="brand_id"
          defaultValue={filters.brand_id ?? ""}
          className="rounded-xl border border-line px-4 py-2.5"
        >
          <option value="">{t.library.allBrands}</option>
          {visibleBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={filters.type ?? ""} className="rounded-xl border border-line px-4 py-2.5">
          <option value="">{t.library.allTypes}</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {t.assets.types[type]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-brand px-6 py-2.5 font-semibold text-white">
          {t.library.filter}
        </button>
      </form>

      <div className="mt-6 rounded-card bg-surface px-6 shadow-card ring-1 ring-line">
        {library.data.length > 0 ? (
          <AssetList assets={library.data} locale={locale} t={t.assets} />
        ) : (
          <div className="py-6">
            <EmptyState message={t.library.empty} />
          </div>
        )}
      </div>

      <Pagination
        meta={library.meta}
        baseHref={`/${locale}/library${baseQuery ? `?${baseQuery}` : ""}`}
        labels={t.category}
      />
    </>
  );
}

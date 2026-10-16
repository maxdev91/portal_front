import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ProductCard as ProductCardData } from "@/lib/api/types";
import { formatCapacity } from "@/lib/format";

export function ProductCard({ product, locale }: { product: ProductCardData; locale: Locale }) {
  const attributes = [
    product.capacity_btu ? formatCapacity(product.capacity_btu, locale) : null,
    product.voltage,
    product.refrigerant,
  ].filter((value): value is string => Boolean(value));

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-card hover:ring-brand/40"
    >
      <div className="aspect-[4/3] overflow-hidden bg-white">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.04]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-line/70 p-4">
        <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-brand">{product.name}</h3>
        {product.short_description ? (
          <p className="line-clamp-2 text-xs leading-5 text-ink-muted">{product.short_description}</p>
        ) : null}
        {attributes.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {attributes.map((attribute) => (
              <li
                key={attribute}
                className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink-muted"
              >
                {attribute}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}

export function ProductGrid({ products, locale }: { products: ProductCardData[]; locale: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}

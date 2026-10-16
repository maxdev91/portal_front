import type { Brand } from "@/lib/api/types";

/**
 * The brand logo on a white tile (logos are drawn for light backgrounds); the name in the brand color until a logo is uploaded.
 */
export function BrandMark({ brand, size = "md" }: { brand: Brand; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-20 px-5" : "h-14 px-4";

  return (
    <span className={`inline-flex items-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${box}`}>
      {brand.logo_url ? (
        <img
          src={brand.logo_url}
          alt={brand.name}
          className={size === "lg" ? "h-12 w-auto max-w-44 object-contain" : "h-8 w-auto max-w-32 object-contain"}
        />
      ) : (
        <span
          className={`font-extrabold tracking-tight ${size === "lg" ? "text-2xl" : "text-lg"}`}
          style={{ color: brand.primary_color }}
        >
          {brand.name}
        </span>
      )}
    </span>
  );
}

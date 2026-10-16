import type { CSSProperties, ReactNode } from "react";
import type { Brand } from "@/lib/api/types";

/** Applies a brand's colors to everything inside (bg-brand, text-brand, …). */
export function BrandTheme({
  brand,
  children,
}: {
  brand: Pick<Brand, "primary_color" | "accent_color">;
  children: ReactNode;
}) {
  const style = {
    "--brand-primary": brand.primary_color,
    "--brand-accent": brand.accent_color,
  } as CSSProperties;

  return <div style={style}>{children}</div>;
}

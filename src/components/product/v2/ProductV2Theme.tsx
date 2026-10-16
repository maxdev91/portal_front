import type { CSSProperties, ReactNode } from "react";
import type { ProductTheme } from "@/lib/api/types";

/**
 * Exposes the brand's product page colors as CSS variables, read by the `v2-*` color tokens in globals.css.
 */
export function ProductV2Theme({ theme, children }: { theme: ProductTheme; children: ReactNode }) {
  const style = Object.fromEntries(
    Object.entries(theme).map(([key, color]) => [`--v2-${key.replaceAll("_", "-")}`, color]),
  ) as CSSProperties;

  return <div style={style}>{children}</div>;
}

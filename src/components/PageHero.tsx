import type { ReactNode } from "react";
import { Container } from "./Container";

/** Gradient header in the current brand's colors; `compact` for listing pages that need the content close. */
export function PageHero({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-accent text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <Container className={`relative ${compact ? "py-6 sm:py-8" : "py-12 sm:py-16"}`}>{children}</Container>
    </section>
  );
}

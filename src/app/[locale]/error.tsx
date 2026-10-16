"use client";

import { Container } from "@/components/Container";
import { en } from "@/i18n/dictionaries/en";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-bold">{en.errors.title}</h1>
      <button type="button" onClick={reset} className="mt-8 rounded-full bg-brand px-6 py-3 font-semibold text-white">
        {en.errors.retry}
      </button>
    </Container>
  );
}

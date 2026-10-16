import Link from "next/link";
import { Container } from "@/components/Container";
import { en } from "@/i18n/dictionaries/en";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-3 text-3xl font-bold">{en.errors.notFoundTitle}</h1>
      <p className="mt-2 text-ink-muted">{en.errors.notFoundText}</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">
        {en.errors.backHome}
      </Link>
    </Container>
  );
}

import type { ReactNode } from "react";

/** Line icons for the "highlights" block; the admin picks one of these names. */
const HIGHLIGHT_ICONS: Record<string, ReactNode> = {
  equipment: (
    <>
      <rect x="3" y="5" width="18" height="10" rx="2" />
      <path d="M7 9h10M7 12h6M8 15v3M16 15v3M6 18h12" />
    </>
  ),
  support: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5M16.5 5.5 19 3M19 8h2" />
    </>
  ),
  logistics: (
    <>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  usa: (
    <>
      <path d="M3 8l3-2 4 1 4-2 3 1 4 2-1 4-3 2-1 3-3-1-3 1-3-2-2-3z" />
      <path d="M9 11l2 2 3-3" />
    </>
  ),
  delivery: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9M8 5.2l8 4.5" />
    </>
  ),
  warranty: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  training: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6" />
    </>
  ),
  quality: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
};

export function HighlightIcon({ name, className = "h-9 w-9" }: { name: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {HIGHLIGHT_ICONS[name] ?? HIGHLIGHT_ICONS.quality}
    </svg>
  );
}

const CONTACT_ICONS = {
  address: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
};

export function ContactIcon({ name, className = "h-4 w-4" }: { name: keyof typeof CONTACT_ICONS; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {CONTACT_ICONS[name]}
    </svg>
  );
}

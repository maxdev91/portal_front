"use client";

import { useRef, type ReactNode } from "react";

/**
 * Menu button for phones and tablets. A native <details> opens the panel (it works without JavaScript);
 * this component only closes it after a link or a search, because the header stays mounted between pages.
 */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);

  const close = (): void => {
    if (menu.current) {
      menu.current.open = false;
    }
  };

  return (
    <details ref={menu} className="group lg:hidden">
      <summary
        aria-label={label}
        className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full text-ink ring-1 ring-line hover:bg-surface-muted [&::-webkit-details-marker]:hidden"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <path className="group-open:hidden" d="M4 7h16M4 12h16M4 17h16" />
          <path className="hidden group-open:block" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>
      <div
        className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface shadow-lg"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) {
            close();
          }
        }}
        onSubmit={close}
      >
        {children}
      </div>
    </details>
  );
}

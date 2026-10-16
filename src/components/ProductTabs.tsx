"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type ProductTab = { id: string; label: string; count?: number; content: ReactNode };

/**
 * Tabs for the product sections. Every panel is server-rendered (inactive ones are only hidden),
 * and links like `#documents` open the matching tab.
 */
export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const container = useRef<HTMLDivElement>(null);
  const ids = tabs.map((tab) => tab.id).join(",");

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!ids.split(",").includes(id)) {
        return;
      }

      setActive(id);
      container.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Clear the hash so the same link works again after switching tabs.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [ids]);

  return (
    <div ref={container} className="scroll-mt-24 overflow-hidden rounded-card bg-surface ring-1 ring-line">
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line px-3">
        {tabs.map((tab) => {
          const selected = tab.id === active;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-medium transition ${
                selected ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {tab.count !== undefined ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                    selected ? "bg-brand/10 text-brand" : "bg-surface-muted text-ink-muted"
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className="p-5 sm:p-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

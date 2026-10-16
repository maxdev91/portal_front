"use client";

import { useState, type ReactNode } from "react";

export type VerticalTab = { id: string; label: string; count: number; content: ReactNode };

/**
 * Tabs listed on the left with the active panel on the right; on small screens the tabs scroll horizontally on top.
 * Panels are server-rendered and only hidden when inactive.
 */
export function VerticalTabs({ tabs, label }: { tabs: VerticalTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;

          return (
            <button
              key={tab.id}
              id={`downloads-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`downloads-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold uppercase transition md:border-l-4 md:rounded-l-none ${
                selected
                  ? "bg-v2-description text-v2-accent md:border-v2-accent"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink md:border-transparent"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] leading-none ${
                  selected ? "bg-v2-accent text-white" : "bg-surface-muted text-ink-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`downloads-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`downloads-tab-${tab.id}`}
          hidden={tab.id !== active}
          className="min-w-0"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

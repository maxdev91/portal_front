"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

type Spec = { label: string; value: string; unit: string | null };

const VISIBLE = 8;

/** Full-width spec rows: the first eight, and the rest behind "expand list". */
export function SpecList({ specs, t }: { specs: Spec[]; t: Dictionary["productV2"] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? specs : specs.slice(0, VISIBLE);

  return (
    <div>
      <dl className="border-t border-ink-muted/25">
        {visible.map((spec, index) => (
          <div
            key={`${spec.label}-${index}`}
            className="flex flex-col gap-0.5 border-b border-ink-muted/25 py-2 text-[13px] sm:flex-row sm:py-2 sm:text-[15px]"
          >
            <dt className="flex-1 text-ink-muted">{spec.label}</dt>
            <dd className="flex-1 font-bold text-ink">
              {spec.value}
              {spec.unit ? <span className="ml-1 font-normal text-ink-muted">{spec.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      {specs.length > VISIBLE ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase text-v2-accent hover:opacity-80"
          >
            <span aria-hidden className={`transition ${expanded ? "rotate-180" : ""}`}>
              ▾
            </span>
            {expanded ? t.collapseList : t.expandList}
          </button>
        </div>
      ) : null}
    </div>
  );
}

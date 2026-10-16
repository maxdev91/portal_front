"use client";

import { useState } from "react";

type Image = { url: string; alt: string | null };

export function ProductGallery({ images, fallbackAlt }: { images: Image[]; fallbackAlt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[4/3] rounded-card bg-surface ring-1 ring-line" />;
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/3] overflow-hidden rounded-card bg-white ring-1 ring-line">
        <img src={current.url} alt={current.alt ?? fallbackAlt} className="h-full w-full object-contain p-6" />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={image.alt ?? `${fallbackAlt} ${index + 1}`}
              aria-current={index === active}
              className={`h-16 w-16 overflow-hidden rounded-xl bg-white ring-1 transition ${
                index === active ? "ring-2 ring-brand" : "ring-line opacity-70 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Modal } from "./Modal";

type Image = { url: string; alt: string | null };

const SWIPE_THRESHOLD = 40;

/** Large product slider on the dark hero: arrows, swipe, loop, and a full-screen zoom on click. */
export function HeroGallery({ images, name, t }: { images: Image[]; name: string; t: Dictionary["productV2"] }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const count = images.length;

  const go = (step: number): void => setIndex((current) => (current + step + count) % count);

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    if (swipeStart.current === null) {
      return;
    }
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > SWIPE_THRESHOLD && count > 1) {
      go(distance < 0 ? 1 : -1);
    }
  };

  if (count === 0) {
    return <div className="mx-auto grid h-72 place-items-center text-sm text-white/60">{t.imageUnavailable}</div>;
  }

  const current = images[index];
  const arrow =
    "absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-2xl text-v2-accent shadow-lg transition hover:bg-white";

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-5 lg:px-16">
      <div
        className="touch-pan-y select-none overflow-hidden"
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={handlePointerUp}
      >
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((image, position) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={t.openImage}
              tabIndex={position === index ? 0 : -1}
              className="flex h-[340px] w-full shrink-0 cursor-zoom-in items-center justify-center sm:h-[480px] lg:h-[640px] 2xl:h-[720px]"
            >
              <img
                src={image.url}
                alt={image.alt ?? name}
                draggable={false}
                loading={position === 0 ? "eager" : "lazy"}
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </button>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.previousImage}
            className={`${arrow} left-2 lg:left-4`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.nextImage}
            className={`${arrow} right-2 lg:right-4`}
          >
            ›
          </button>
        </>
      ) : null}

      <Modal open={zoomed} onClose={() => setZoomed(false)} closeLabel={t.close}>
        <img src={current.url} alt={current.alt ?? name} className="max-h-full max-w-full object-contain" />
      </Modal>
    </div>
  );
}

"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";

/**
 * Shows the section image with a play button; the YouTube player only loads when the visitor presses play.
 */
export function LiteYouTube({ url, image, label }: { url: string; image: string | null; label: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youTubeId(url);

  if (!id) {
    return image ? <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" /> : null;
  }

  if (playing) {
    return (
      <iframe
        title={label}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={label}
      className="group relative block h-full w-full"
    >
      <img
        src={image ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/20">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-brand shadow-xl ring-8 ring-white/30 transition group-hover:scale-105">
          <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="ml-1 h-7 w-7">
            <path d="M6.3 4.1A1 1 0 0 0 5 5v10a1 1 0 0 0 1.5.9l8-5a1 1 0 0 0 0-1.8l-8-5a1 1 0 0 0-.2-.1Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";

type Video = { url: string; title: string | null };

const INITIAL_COUNT = 6;

/**
 * Thumbnails first; the YouTube player only loads for the video the user plays.
 */
export function VideoGrid({ videos, showAllLabel }: { videos: Video[]; showAllLabel: string }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const embeddable = videos
    .map((video) => ({ ...video, id: youTubeId(video.url) }))
    .filter((video): video is Video & { id: string } => video.id !== null);
  const visible = expanded ? embeddable : embeddable.slice(0, INITIAL_COUNT);

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((video) => (
          <li key={video.id}>
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              {playing === video.id ? (
                <iframe
                  title={video.title ?? video.id}
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                  allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(video.id)}
                  aria-label={video.title ?? video.id}
                  className="group relative block h-full w-full"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand shadow-lg transition group-hover:scale-105">
                      <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-5 w-5">
                        <path d="M6.3 4.1A1 1 0 0 0 5 5v10a1 1 0 0 0 1.5.9l8-5a1 1 0 0 0 0-1.8l-8-5a1 1 0 0 0-.2-.1Z" />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>
            {video.title ? <p className="mt-2 line-clamp-2 text-sm font-medium">{video.title}</p> : null}
          </li>
        ))}
      </ul>
      {embeddable.length > INITIAL_COUNT && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-5 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-line hover:text-brand hover:ring-brand/40"
        >
          {showAllLabel.replace("{count}", String(embeddable.length))}
        </button>
      ) : null}
    </div>
  );
}

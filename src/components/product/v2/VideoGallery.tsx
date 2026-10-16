"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";

type Video = { url: string; title: string | null };

function PlayIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.3 4.1A1 1 0 0 0 5 5v10a1 1 0 0 0 1.5.9l8-5a1 1 0 0 0 0-1.8l-8-5a1 1 0 0 0-.2-.1Z" />
    </svg>
  );
}

/**
 * Player with a playlist next to it (below it on smaller screens), like a video site.
 * The YouTube player only loads once the user presses play; picking a video from the list plays it.
 */
export function VideoGallery({
  videos,
  labels,
}: {
  videos: Video[];
  labels: { videoCount: string; nowPlaying: string };
}) {
  const embeddable = videos
    .map((video) => ({ ...video, id: youTubeId(video.url) }))
    .filter((video): video is Video & { id: string } => video.id !== null);
  const [currentId, setCurrentId] = useState(embeddable[0]?.id);
  const [playing, setPlaying] = useState(false);

  const current = embeddable.find((video) => video.id === currentId) ?? embeddable[0];
  if (!current) {
    return null;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-xl shadow-ink/10">
          {playing ? (
            <iframe
              key={current.id}
              title={current.title ?? current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1`}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={current.title ?? current.id}
              title={current.title ?? undefined}
              className="group relative block h-full w-full"
            >
              <img
                src={`https://i.ytimg.com/vi/${current.id}/hqdefault.jpg`}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-v2-accent shadow-2xl ring-8 ring-white/20 transition group-hover:scale-110">
                  <PlayIcon className="ml-1 h-7 w-7" />
                </span>
              </span>
            </button>
          )}
        </div>
        {current.title ? (
          <p className="mt-4 text-lg font-semibold leading-snug text-ink md:text-xl">{current.title}</p>
        ) : null}
      </div>

      {embeddable.length > 1 ? (
        // On wide screens the list is exactly as tall as the player and scrolls inside.
        <div className="relative overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-line">
          <p className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {labels.videoCount.replace("{count}", String(embeddable.length))}
          </p>
          <ol className="max-h-[420px] overflow-y-auto p-2 xl:absolute xl:inset-x-0 xl:bottom-0 xl:top-[41px] xl:max-h-none">
            {embeddable.map((video, position) => {
              const active = video.id === current.id;

              return (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentId(video.id);
                      setPlaying(true);
                    }}
                    aria-current={active}
                    title={video.title ?? video.url}
                    className={`group flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                      active ? "bg-surface shadow-sm ring-1 ring-line" : "hover:bg-surface"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-center text-xs font-medium tabular-nums text-ink-muted">
                      {active ? <PlayIcon className="mx-auto h-3 w-3 text-v2-accent" /> : position + 1}
                    </span>
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-ink">
                      <img
                        src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </span>
                    <span className="min-w-0">
                      {active ? (
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-v2-accent">
                          {labels.nowPlaying}
                        </span>
                      ) : null}
                      <span
                        className={`line-clamp-2 text-[13px] font-medium leading-5 ${
                          active ? "text-ink" : "text-ink-muted group-hover:text-ink"
                        }`}
                      >
                        {video.title ?? video.url}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

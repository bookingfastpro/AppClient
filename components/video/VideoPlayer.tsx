"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { CustomVideoPlayer } from "@/components/video/CustomVideoPlayer";

/**
 * Click-to-load embed: the YouTube IFrame Player API script and player
 * only mount once the user actually presses play, not on page load —
 * keeps the video detail page light and avoids loading a third-party
 * player for content the visitor may never press play on.
 */
export function VideoPlayer({
  youtubeId,
  title,
  videoId,
  startAt = 0,
}: {
  youtubeId: string;
  title: string;
  videoId?: string;
  startAt?: number;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <CustomVideoPlayer
        youtubeId={youtubeId}
        title={title}
        videoId={videoId}
        startAt={startAt}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={startAt > 0 ? `Reprendre ${title}` : `Lire ${title}`}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-forest-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${youtubeThumbnailUrl(youtubeId)})` }}
    >
      <div className="absolute inset-0 bg-forest-900/40 transition-colors duration-200 ease-[var(--ease-standard)] group-hover:bg-forest-900/55" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-pill bg-cream/90 text-forest-900 shadow-[var(--shadow-ambient-md)] backdrop-blur-sm transition-transform duration-200 ease-[var(--ease-standard)] hover:scale-110">
          <Play className="size-7 translate-x-0.5" aria-hidden fill="currentColor" />
        </span>
      </span>
    </button>
  );
}

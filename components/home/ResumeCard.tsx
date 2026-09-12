import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Play } from "lucide-react";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import type { VideoSummary } from "@/types/database.types";

export function ResumeCard({
  video,
  progressSeconds,
  locked = false,
}: {
  video: VideoSummary;
  progressSeconds: number;
  locked?: boolean;
}) {
  const percent =
    video.duration_seconds > 0
      ? Math.min(100, Math.round((progressSeconds / video.duration_seconds) * 100))
      : 0;
  const remaining = Math.max(0, video.duration_seconds - progressSeconds);

  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group flex items-stretch gap-3 overflow-hidden rounded-md bg-sand transition-transform duration-150 ease-[var(--ease-standard)] active:scale-[0.99] sm:gap-4"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-sand sm:aspect-video sm:w-44">
        <Image
          src={youtubeThumbnailUrl(video.youtube_id)}
          alt=""
          fill
          sizes="(min-width: 640px) 176px, 112px"
          className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-105"
        />
        {percent > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-forest-900/25">
            <div className="h-full bg-sage-500" style={{ width: `${percent}%` }} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-2.5 sm:gap-4 sm:py-4 sm:pr-4">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[0.9375rem] leading-snug font-semibold tracking-tight text-ink-900 sm:text-base">
            {video.title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-600">
            <Clock className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {percent > 0 ? `${formatDuration(remaining)} restantes` : formatDuration(video.duration_seconds)}
          </p>
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-forest-800 text-cream transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110 sm:size-12">
          {locked ? (
            <Lock className="size-4 sm:size-5" aria-hidden />
          ) : (
            <Play className="size-4 translate-x-px sm:size-5" aria-hidden fill="currentColor" />
          )}
        </span>
      </div>
    </Link>
  );
}

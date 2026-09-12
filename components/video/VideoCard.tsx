import Image from "next/image";
import Link from "next/link";
import { BarChart3, Clock, Lock } from "lucide-react";
import { PremiumBadge } from "@/components/ui/Badge";
import { formatDuration, formatLevel } from "@/lib/video/thumbnail-url";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { cn } from "@/lib/utils";
import type { VideoSummary } from "@/types/database.types";

/**
 * No card chrome: the rounded thumbnail is the object, and the title and
 * metadata sit directly on the page. On a pure-white background a white
 * card separated only by a shadow added weight without adding meaning.
 */
export function VideoCard({
  video,
  categoryName,
  locked = false,
  className,
}: {
  video: VideoSummary;
  categoryName?: string;
  locked?: boolean;
  className?: string;
}) {
  const level = formatLevel(video.level);
  const duration = formatDuration(video.duration_seconds);

  return (
    <Link
      href={`/videos/${video.slug}`}
      className={cn("group block active:scale-[0.98] transition-transform duration-150 ease-[var(--ease-standard)]", className)}
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-sand">
        <Image
          src={youtubeThumbnailUrl(video.youtube_id)}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 50vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-105"
        />

        <span className="absolute top-2 right-2 rounded-xs bg-cream/95 px-1.5 py-0.5 text-[11px] font-semibold text-ink-900 shadow-[var(--shadow-ambient-low)]">
          {duration}
        </span>

        {locked ? (
          <>
            <div className="absolute inset-0 bg-forest-900/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-9 items-center justify-center rounded-pill bg-cream text-ink-900 shadow-[var(--shadow-ambient-md)]">
                <Lock className="size-4" aria-hidden />
              </span>
            </span>
          </>
        ) : (
          video.is_premium && <PremiumBadge className="absolute top-2 left-2" />
        )}
      </div>

      <h3 className="mt-2 line-clamp-2 text-[0.9375rem] leading-snug font-semibold tracking-tight text-ink-900 md:text-base">
        {video.title}
      </h3>

      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-600">
        {level && (
          <span className="flex items-center gap-1">
            <BarChart3 className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {level}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          {duration}
        </span>
        {categoryName && <span>{categoryName}</span>}
      </p>
    </Link>
  );
}

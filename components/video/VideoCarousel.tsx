import { VideoCard } from "@/components/video/VideoCard";
import type { VideoSummary } from "@/types/database.types";

export function VideoCarousel({
  videos,
  isSubscriber = false,
}: {
  videos: VideoSummary[];
  isSubscriber?: boolean;
}) {
  if (videos.length === 0) return null;

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pt-2 pb-2 md:-mx-8 md:gap-4 md:px-8">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          locked={video.is_premium && !isSubscriber}
          // Narrow enough on a phone that the next card peeks in and the
          // row reads as scrollable; full width again from md up.
          className="w-44 shrink-0 sm:w-52 md:w-64"
        />
      ))}
    </div>
  );
}

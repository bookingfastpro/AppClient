import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideoBySlug, getWatchProgress } from "@/lib/db/queries";
import { getUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { hasActivePremiumAccess } from "@/lib/access/subscription";
import { Lock } from "lucide-react";
import { formatDuration, formatLevel } from "@/lib/video/thumbnail-url";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { FavoriteButton } from "@/components/video/FavoriteButton";
import { PremiumBadge } from "@/components/ui/Badge";
import { UpgradeCard } from "@/components/billing/UpgradeCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  return { title: video?.title ?? "Séance" };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const user = await getUser();

  const [access, favorited, resumeAt] = await Promise.all([
    video.is_premium && user ? hasActivePremiumAccess(user.id) : Promise.resolve(null),
    user ? isFavorited(user.id, video.id) : Promise.resolve(false),
    user ? getWatchProgress(user.id, video.id) : Promise.resolve(0),
  ]);

  const canPlay = !video.is_premium || access?.hasAccess === true;
  const category = (video as { categories?: { name: string; slug: string } | null }).categories;

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      {canPlay ? (
        <VideoPlayer
          youtubeId={video.youtube_id}
          title={video.title}
          videoId={video.id}
          startAt={resumeAt}
        />
      ) : (
        <div
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${youtubeThumbnailUrl(video.youtube_id)})` }}
        >
          <div className="absolute inset-0 bg-forest-900/55" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-pill bg-cream/90 text-forest-900 shadow-[var(--shadow-ambient-md)] backdrop-blur-sm">
              <Lock className="size-7" aria-hidden />
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          {category && (
            <p className="text-label text-sage-600">{category.name}</p>
          )}
          <h1 className="text-headline text-ink-900">{video.title}</h1>
          <p className="text-label text-ink-600">
            {formatDuration(video.duration_seconds)} · {formatLevel(video.level)}
            {video.is_premium && (
              <>
                {" "}
                · <PremiumBadge className="ml-1 align-middle" />
              </>
            )}
          </p>
        </div>
        {user && <FavoriteButton videoId={video.id} initialFavorited={favorited} />}
      </div>

      <p className="text-body text-ink-900">{video.description}</p>

      {video.instructor && (
        <p className="text-sm text-ink-600">Animé par {video.instructor}</p>
      )}

      {!canPlay && <UpgradeCard title={video.title} />}
    </div>
  );
}

async function isFavorited(userId: string, videoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();
  return !!data;
}

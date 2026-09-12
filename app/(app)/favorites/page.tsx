import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getFavoriteVideos } from "@/lib/db/queries";
import { hasActivePremiumAccess } from "@/lib/access/subscription";
import { FavoriteButton } from "@/components/video/FavoriteButton";
import { buttonVariants } from "@/components/ui/Button";
import { formatDuration, formatLevel } from "@/lib/video/thumbnail-url";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";

export default async function FavoritesPage() {
  const user = await requireUser();
  const [videos, access] = await Promise.all([
    getFavoriteVideos(user.id),
    hasActivePremiumAccess(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-display text-ink-900">Favoris</h1>
        {videos.length > 0 && (
          <p className="text-body mt-1 text-ink-600">
            {videos.length} séance{videos.length > 1 ? "s" : ""} enregistrée
            {videos.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-body text-ink-600">Vos séances favorites apparaîtront ici.</p>
          <Link href="/explore" className={buttonVariants({ variant: "primary" })}>
            Explorer les séances
          </Link>
        </div>
      ) : (
        <ul className="animate-fade-in-up flex flex-col gap-3">
          {videos.map((video) => {
            const locked = video.is_premium && !access.hasAccess;
            return (
              <li
                key={video.id}
                className="flex items-center gap-3 rounded-md border border-beige bg-surface p-3 transition-shadow duration-200 ease-[var(--ease-standard)] hover:shadow-[var(--shadow-ambient-low)]"
              >
                <Link href={`/videos/${video.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-sand">
                    <Image
                      src={youtubeThumbnailUrl(video.youtube_id)}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-forest-900/45">
                        <Lock className="size-4 text-cream" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-title truncate text-ink-900">{video.title}</h3>
                    <p className="text-label mt-0.5 text-ink-600">
                      {formatDuration(video.duration_seconds)} · {formatLevel(video.level)}
                    </p>
                  </div>
                </Link>
                <FavoriteButton videoId={video.id} initialFavorited />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

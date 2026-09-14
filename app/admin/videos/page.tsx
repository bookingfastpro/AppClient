import Link from "next/link";
import Image from "next/image";
import { Video } from "lucide-react";
import { getAllVideosForAdmin } from "@/lib/admin/queries";
import { EmptyState } from "@/components/ui/EmptyState";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { buttonVariants } from "@/components/ui/Button";
import { DeleteVideoButton } from "@/components/admin/DeleteVideoButton";

export default async function AdminVideosPage() {
  const videos = await getAllVideosForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-headline text-ink-900">Vidéos</h1>
        <Link href="/admin/videos/new" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Ajouter une vidéo
        </Link>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="Aucune vidéo pour le moment"
          description="Ajoutez la première à partir d'un lien YouTube."
          action={{ href: "/admin/videos/new", label: "Ajouter une vidéo" }}
        />
      ) : (
        <ul className="animate-fade-in-up flex flex-col gap-2 [animation-delay:80ms]">
          {videos.map((video) => (
            <li
              key={video.id}
              /* flex-wrap, not a single row: the thumbnail, title and two
                 action buttons do not fit side by side on a phone, and
                 they used to squeeze the title to nothing. The actions
                 drop onto their own full-width line below 640px. */
              className="flex flex-wrap items-center gap-3 rounded-md border border-beige bg-surface p-3 transition-colors duration-150 ease-[var(--ease-standard)] hover:border-ink-300/40"
            >
              <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xs bg-sand">
                <Image
                  src={youtubeThumbnailUrl(video.youtube_id)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{video.title}</p>
                <p className="text-xs text-ink-600">
                  {(video as { categories?: { name: string } | null }).categories?.name ?? "Sans catégorie"}
                  {" · "}
                  {formatDuration(video.duration_seconds)}
                  {video.is_premium ? " · Premium" : " · Gratuit"}
                </p>
              </div>
              <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                <Link
                  href={`/admin/videos/${video.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Modifier
                </Link>
                <DeleteVideoButton videoId={video.id} title={video.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

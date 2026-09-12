import Link from "next/link";
import Image from "next/image";
import { getAllVideosForAdmin } from "@/lib/admin/queries";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { buttonVariants } from "@/components/ui/Button";
import { DeleteVideoButton } from "@/components/admin/DeleteVideoButton";

export default async function AdminVideosPage() {
  const videos = await getAllVideosForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline text-ink-900">Vidéos</h1>
        <Link href="/admin/videos/new" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Ajouter une vidéo
        </Link>
      </div>

      {videos.length === 0 ? (
        <p className="text-body text-ink-600">
          Aucune vidéo pour le moment. Ajoutez la première depuis un lien YouTube.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {videos.map((video) => (
            <li
              key={video.id}
              className="flex items-center gap-4 rounded-md border border-beige bg-surface p-3"
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
              <Link
                href={`/admin/videos/${video.id}/edit`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Modifier
              </Link>
              <DeleteVideoButton videoId={video.id} title={video.title} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { getCategories } from "@/lib/db/queries";
import { getVideoForAdmin } from "@/lib/admin/queries";
import { updateVideoAction } from "@/lib/admin/actions";
import { VideoForm } from "@/components/admin/VideoForm";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, video] = await Promise.all([getCategories(), getVideoForAdmin(id)]);
  if (!video) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline text-ink-900">Modifier la vidéo</h1>
      <VideoForm
        categories={categories}
        action={updateVideoAction.bind(null, id)}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          youtubeUrl: video.youtube_id,
          title: video.title,
          description: video.description,
          categoryId: video.category_id,
          level: video.level ?? "",
          instructor: video.instructor,
          durationMinutes: Math.round(video.duration_seconds / 60),
          isPremium: video.is_premium,
        }}
      />
    </div>
  );
}

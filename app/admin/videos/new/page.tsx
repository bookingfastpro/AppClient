import { getCategories } from "@/lib/db/queries";
import { createVideoAction } from "@/lib/admin/actions";
import { VideoForm } from "@/components/admin/VideoForm";

export default async function NewVideoPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline text-ink-900">Ajouter une vidéo</h1>
      <VideoForm categories={categories} action={createVideoAction} submitLabel="Ajouter la vidéo" />
    </div>
  );
}

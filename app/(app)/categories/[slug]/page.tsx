import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getVideosByCategory } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Catégorie" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, { isSubscriber }] = await Promise.all([
    getCategoryBySlug(slug),
    getViewerAccess(),
  ]);
  if (!category) notFound();

  const videos = await getVideosByCategory(category.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in-up">
        <h1 className="text-display text-ink-900">{category.name}</h1>
        {category.description && (
          <p className="text-body mt-1 text-ink-600">{category.description}</p>
        )}
      </div>

      {videos.length === 0 ? (
        <p className="text-body text-ink-600">Aucune séance dans cette catégorie pour le moment.</p>
      ) : (
        <div className="animate-fade-in-up grid grid-cols-2 gap-4 [animation-delay:80ms] sm:grid-cols-3 md:grid-cols-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              categoryName={category.name}
              locked={video.is_premium && !isSubscriber}
            />
          ))}
        </div>
      )}
    </div>
  );
}

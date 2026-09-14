import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sprout } from "lucide-react";
import { getCategoryBySlug, getVideosByCategory } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";
import { EmptyState } from "@/components/ui/EmptyState";

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
        <EmptyState
          icon={Sprout}
          title="Rien ici pour l'instant"
          description="Cet univers n'a pas encore de séance publiée. Les autres vous attendent."
          action={{ href: "/explore", label: "Voir les univers" }}
        />
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

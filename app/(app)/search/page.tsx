import { SearchX } from "lucide-react";
import { searchVideos } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";
import { SearchInput } from "@/components/video/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [results, { isSubscriber }] = await Promise.all([
    q.trim() ? searchVideos(q) : Promise.resolve([]),
    getViewerAccess(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-display text-ink-900">Recherche</h1>
      <SearchInput defaultValue={q} />

      {q.trim() && results.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={`Aucun résultat pour « ${q} »`}
          description="Essayez un mot plus court, ou parcourez les univers pour trouver une séance."
          action={{ href: "/explore", label: "Voir les univers" }}
        />
      )}

      {results.length > 0 && (
        <div className="animate-fade-in-up grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              locked={video.is_premium && !isSubscriber}
            />
          ))}
        </div>
      )}
    </div>
  );
}

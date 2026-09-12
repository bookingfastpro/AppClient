import { searchVideos } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";
import { SearchInput } from "@/components/video/SearchInput";

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
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-body text-ink-600">
            Aucune séance ne correspond à &laquo; {q} &raquo;.
          </p>
        </div>
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

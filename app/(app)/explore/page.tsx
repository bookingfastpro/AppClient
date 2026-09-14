import type { Metadata } from "next";
import { Compass, Search } from "lucide-react";
import { getCategoriesWithSample } from "@/lib/db/queries";
import { UniverseCard } from "@/components/video/UniverseCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Explorer" };

export default async function ExplorePage() {
  const categories = await getCategoriesWithSample();

  return (
    <div className="flex flex-col gap-6">
      {/* Plain GET form: search keeps working with JavaScript disabled, and
          the results page already reads ?q=. */}
      <form action="/search" className="animate-fade-in-up relative">
        <label htmlFor="q" className="sr-only">
          Rechercher une séance
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-300"
          aria-hidden
        />
        {/* Font size stays at 16px on purpose: below that, iOS Safari zooms
            the page when the field takes focus. The height comes down
            through the padding instead. */}
        <input
          id="q"
          name="q"
          type="search"
          placeholder="Rechercher une séance"
          className="w-full rounded-pill border border-beige bg-surface py-2.5 pr-4 pl-11 text-base text-ink-900 outline-none transition-colors duration-150 ease-[var(--ease-standard)] placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </form>

      <div className="animate-fade-in-up [animation-delay:60ms]">
        <p className="text-label text-sage-600">Explorer</p>
        <h1 className="text-display mt-1 text-ink-900">Nos univers</h1>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Les univers arrivent bientôt"
          description="Aucun univers n'est encore publié. Ils apparaîtront ici dès leur création."
        />
      ) : (
        <div className="animate-fade-in-up grid grid-cols-2 gap-3 [animation-delay:120ms] lg:grid-cols-3">
          {categories.map((category) => (
            <UniverseCard
              key={category.id}
              universe={{
                id: category.id,
                slug: category.slug,
                name: category.name,
                imagePath: category.image_path,
                sampleYoutubeId: category.sampleYoutubeId,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

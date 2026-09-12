import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { cn } from "@/lib/utils";

export type Universe = {
  id: string;
  slug: string;
  name: string;
  imagePath: string | null;
  sampleYoutubeId: string | null;
};

/**
 * categories.image_path predates the YouTube pivot and still holds
 * Supabase Storage keys ("categories/yoga.jpg") for rows the universes
 * migration has not rewritten yet. Those are not renderable by next/image
 * and throw "Invalid URL", so only absolute paths and absolute URLs are
 * accepted here; anything else falls through to the video thumbnail.
 */
function toImageSrc(imagePath: string | null) {
  if (!imagePath) return null;
  return imagePath.startsWith("/") || imagePath.startsWith("https://") ? imagePath : null;
}

/**
 * Artwork comes from public/univers/ when the team has supplied it, and
 * falls back to a thumbnail from one of the universe's own videos while a
 * file is missing. The scrim is applied unconditionally rather than only
 * over dark photos: the label has to stay readable whatever image lands
 * here later, and we cannot know a photo's luminance ahead of time.
 */
export function UniverseCard({ universe }: { universe: Universe }) {
  const src =
    toImageSrc(universe.imagePath) ??
    (universe.sampleYoutubeId ? youtubeThumbnailUrl(universe.sampleYoutubeId) : null);

  return (
    <Link
      href={`/categories/${universe.slug}`}
      className="group relative flex aspect-[3/2] items-end overflow-hidden rounded-md bg-sage-100 transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient-md)] active:translate-y-0 active:scale-[0.98]"
    >
      {src && (
        <>
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, 50vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/25 to-transparent" />
        </>
      )}

      <div className="relative flex w-full items-center gap-2 p-4">
        <span
          className={cn(
            "text-title flex-1 text-balance",
            src ? "text-cream" : "text-forest-900",
          )}
        >
          {universe.name}
        </span>
        <ChevronRight
          className={cn(
            "size-5 shrink-0 transition-transform duration-200 ease-[var(--ease-standard)] group-hover:translate-x-0.5",
            src ? "text-cream/80" : "text-forest-900/60",
          )}
          aria-hidden
        />
      </div>
    </Link>
  );
}

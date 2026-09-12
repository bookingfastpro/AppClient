import Image from "next/image";
import Link from "next/link";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { cn } from "@/lib/utils";

type CategoryWithSample = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sampleYoutubeId: string | null;
};

export function CategoryTile({
  category,
  variant = "grid",
  className,
}: {
  category: CategoryWithSample;
  variant?: "grid" | "feature" | "pill";
  className?: string;
}) {
  const hasImage = !!category.sampleYoutubeId;

  if (variant === "pill") {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group flex shrink-0 items-center gap-2.5 rounded-pill border border-beige bg-surface py-1.5 pl-1.5 pr-4 transition-all duration-150 ease-[var(--ease-standard)] hover:border-sage-300 hover:bg-sage-50 active:scale-[0.96]",
          className,
        )}
      >
        <span className="relative size-9 shrink-0 overflow-hidden rounded-pill bg-sage-100">
          {hasImage && (
            <Image
              src={youtubeThumbnailUrl(category.sampleYoutubeId!)}
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
          )}
        </span>
        <span className="text-sm font-semibold text-ink-900">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-lg bg-sage-100 transition-transform duration-150 ease-[var(--ease-standard)] hover:-translate-y-0.5 active:scale-[0.97]",
        variant === "grid" && "aspect-square p-4",
        variant === "feature" && "aspect-[2/1] p-6 sm:aspect-[3/1]",
        className,
      )}
    >
      {hasImage && (
        <>
          <Image
            src={youtubeThumbnailUrl(category.sampleYoutubeId!)}
            alt=""
            fill
            sizes={variant === "feature" ? "100vw" : "(min-width: 640px) 33vw, 50vw"}
            className="object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/10 to-transparent" />
        </>
      )}
      <span
        className={cn(
          "relative",
          variant === "feature" ? "text-headline" : "text-title",
          hasImage ? "text-cream" : "text-forest-900",
        )}
      >
        {category.name}
      </span>
      {variant === "feature" && category.description && (
        <span
          className={cn(
            "text-body relative mt-1 line-clamp-1 max-w-md",
            hasImage ? "text-cream/80" : "text-forest-900/70",
          )}
        >
          {category.description}
        </span>
      )}
    </Link>
  );
}

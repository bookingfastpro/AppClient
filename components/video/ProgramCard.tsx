import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Program = Database["public"]["Tables"]["programs"]["Row"];

/**
 * next/image throws "Invalid URL" on anything that is neither an absolute
 * path nor an absolute URL, so a stray value in image_path must degrade to
 * the plain tinted card rather than crashing the page that renders it.
 */
function toImageSrc(imagePath: string | null) {
  if (!imagePath) return null;
  return imagePath.startsWith("/") || imagePath.startsWith("https://") ? imagePath : null;
}

export function ProgramCard({ program }: { program: Program }) {
  const src = toImageSrc(program.image_path);

  return (
    <Link
      href={`/programmes/${program.slug}`}
      // Kept a step wider than a video card so the row still reads as the
      // more prominent unit, without swallowing the screen on a phone.
      className="group relative flex aspect-[16/10] w-52 shrink-0 items-end overflow-hidden rounded-md bg-sage-100 transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient-md)] active:translate-y-0 sm:w-60 md:w-72"
    >
      {src && (
        <>
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 768px) 288px, (min-width: 640px) 240px, 208px"
            className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/25 to-transparent" />
        </>
      )}

      <div className="relative flex flex-col gap-0.5 p-3 md:p-4">
        <span className={src ? "text-label text-cream/80" : "text-label text-sage-700"}>
          Programme
        </span>
        <span
          className={cn(
            "line-clamp-2 text-base leading-snug font-semibold tracking-tight md:text-[1.0625rem]",
            src ? "text-cream" : "text-forest-900",
          )}
        >
          {program.title}
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { MOODS, OTHER_MOOD } from "@/lib/moods";
import { cn } from "@/lib/utils";

function Tile({
  href,
  label,
  icon: Icon,
  tint,
  className,
  delay,
}: {
  href: string;
  label: string;
  icon: typeof OTHER_MOOD.icon;
  /** Omitted for "Autre besoin", which shows a bare glyph instead of a badge. */
  tint?: string;
  className?: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-fade-in-up group flex min-h-[118px] flex-col items-center justify-center gap-2.5 rounded-lg border border-beige/50 bg-surface px-2 py-4 text-center transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-beige hover:shadow-[var(--shadow-ambient-low)] active:translate-y-0 active:scale-[0.98] sm:min-h-[132px] sm:px-3 sm:py-5",
        className,
      )}
    >
      {tint ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-pill transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110 sm:size-12",
            tint,
          )}
        >
          <Icon className="size-5 sm:size-6" strokeWidth={1.75} aria-hidden />
        </span>
      ) : (
        <Icon
          className="size-6 shrink-0 text-ink-900 transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
      <span className="text-[13px] leading-tight font-semibold text-balance text-ink-900 sm:text-sm">
        {label}
      </span>
    </Link>
  );
}

export function MoodGrid() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {MOODS.map((mood, index) => (
        <Tile
          key={mood.slug}
          href={`/besoins/${mood.slug}`}
          label={mood.label}
          icon={mood.icon}
          tint={mood.tint}
          delay={60 + index * 40}
        />
      ))}
      <Tile
        href={OTHER_MOOD.href}
        label={OTHER_MOOD.label}
        icon={OTHER_MOOD.icon}
        delay={60 + MOODS.length * 40}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}

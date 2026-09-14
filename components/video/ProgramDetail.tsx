import Image from "next/image";
import Link from "next/link";
import { BarChart3, Check, Clock, ListVideo, Play } from "lucide-react";
import type { getProgramBySlug } from "@/lib/db/queries";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ProgramData = NonNullable<Awaited<ReturnType<typeof getProgramBySlug>>>;

function Meta({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm text-ink-600">
      <Icon className="size-[18px] shrink-0 text-sage-600" strokeWidth={1.75} aria-hidden />
      {children}
    </span>
  );
}

/** Guards next/image against legacy or malformed values in image_path. */
function toImageSrc(imagePath: string | null) {
  if (!imagePath) return null;
  return imagePath.startsWith("/") || imagePath.startsWith("https://") ? imagePath : null;
}

/** "20 à 30 min" when the sessions vary, "22 min" when they don't. */
function durationRange(seconds: number[]) {
  if (seconds.length === 0) return null;
  const min = Math.round(Math.min(...seconds) / 60);
  const max = Math.round(Math.max(...seconds) / 60);
  return min === max ? `${min} min` : `${min} à ${max} min`;
}

/**
 * The whole programme view, from cover image to session list.
 *
 * Shared by the full page at /programmes/[slug] and by the intercepted
 * modal that opens over the home screen, so the two cannot drift.
 *
 * `heroOverlay` is how the two differ: the page puts its own back arrow
 * on the cover, while the modal leaves the slot empty because the dialog
 * already supplies a close button in that corner.
 */
export function ProgramDetail({
  program,
  sessions,
  heroOverlay,
  className,
}: ProgramData & {
  heroOverlay?: React.ReactNode;
  className?: string;
}) {
  const range = durationRange(sessions.map((s) => s.video.duration_seconds));

  // Resume at the first unfinished session so the CTA means "continue"
  // once the programme is under way, without a second button.
  const nextSession = sessions.find((s) => !s.completed) ?? sessions[0];
  const started = sessions.some((s) => s.completed);
  const cover = toImageSrc(program.image_path);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-sage-100" />
        )}
        {heroOverlay}
      </div>

      <div className="flex flex-col gap-5 px-4 pt-6 md:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-label text-sage-600">Programme</p>
          <h1 className="text-display text-balance text-ink-900">{program.title}</h1>
          {program.subtitle && <p className="text-body text-ink-600">{program.subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Meta icon={ListVideo}>
            {sessions.length} séance{sessions.length > 1 ? "s" : ""}
          </Meta>
          {range && <Meta icon={Clock}>{range}</Meta>}
          {program.level && <Meta icon={BarChart3}>{program.level}</Meta>}
        </div>

        {nextSession && (
          <Link
            href={`/videos/${nextSession.video.slug}`}
            className={cn(buttonVariants({ variant: "primary" }), "w-full")}
          >
            {started ? "Reprendre le programme" : "Commencer le programme"}
          </Link>
        )}

        {program.description && <p className="text-body text-ink-600">{program.description}</p>}
      </div>

      <section className="flex flex-col gap-4 px-4 pt-8 md:px-8">
        <h2 className="text-headline text-ink-900">Séances</h2>

        {sessions.length === 0 ? (
          <p className="text-body text-ink-600">Les séances de ce programme arrivent bientôt.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {sessions.map((session) => (
              <li key={session.video.id}>
                <Link
                  href={`/videos/${session.video.slug}`}
                  className="group flex items-center gap-4 rounded-md transition-transform duration-150 ease-[var(--ease-standard)] active:scale-[0.99]"
                >
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-sm bg-sand">
                    <Image
                      src={youtubeThumbnailUrl(session.video.youtube_id)}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-8 items-center justify-center rounded-pill bg-cream/80 text-forest-900 backdrop-blur-sm transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110">
                        <Play className="size-3.5 translate-x-px" aria-hidden fill="currentColor" />
                      </span>
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-title line-clamp-2 text-ink-900">
                      {session.position}. {session.video.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                      <Clock className="size-4 shrink-0 text-sage-600" strokeWidth={1.75} aria-hidden />
                      {formatDuration(session.video.duration_seconds)}
                    </p>
                  </div>

                  <span
                    aria-label={session.completed ? "Séance terminée" : "Séance non terminée"}
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-pill transition-colors duration-200 ease-[var(--ease-standard)]",
                      session.completed ? "bg-forest-800 text-cream" : "bg-sand text-ink-600",
                    )}
                  >
                    <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

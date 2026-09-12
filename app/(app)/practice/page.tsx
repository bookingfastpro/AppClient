import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { getUser } from "@/lib/auth/session";
import { getPracticeStats, getWatchHistory } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";
import { buttonVariants } from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Ma pratique" };

/**
 * Rounding to minutes turns anything under 30s into "0 min", which reads
 * as "nothing recorded" right after a session was in fact recorded.
 */
function formatPractised(seconds: number) {
  if (seconds > 0 && seconds < 60) return "moins d'une minute";
  return `${Math.round(seconds / 60)} min`;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-beige/60 bg-surface px-5 py-4">
      <span className="text-3xl font-bold tracking-tight text-ink-900">{value}</span>
      <span className="text-sm text-ink-600">{label}</span>
    </div>
  );
}

export default async function PracticePage() {
  const user = await getUser();
  if (!user) redirect("/sign-in?next=/practice");

  const [{ isSubscriber }, stats, history] = await Promise.all([
    getViewerAccess(),
    getPracticeStats(user.id),
    getWatchHistory(user.id),
  ]);

  const [lastSession, ...earlier] = history;

  return (
    <div className="flex flex-col gap-10">
      <section className="animate-fade-in-up flex flex-col gap-1">
        <h1 className="text-display text-ink-900">Ma pratique</h1>
        <p className="text-body text-ink-600">
          {stats.totalSessions === 0
            ? "Votre parcours commence à la première séance."
            : "Ce que vous avez pratiqué jusqu'ici."}
        </p>
      </section>

      {stats.totalSessions === 0 ? (
        <section className="animate-fade-in-up flex flex-col items-start gap-4 rounded-lg border border-beige/60 bg-surface px-6 py-10 [animation-delay:80ms]">
          <p className="text-title text-ink-900">Rien à afficher pour l&apos;instant</p>
          <p className="text-body max-w-prose text-ink-600">
            Dès que vous lancez une séance, elle apparaît ici avec le temps pratiqué et
            l&apos;endroit où vous vous êtes arrêtée.
          </p>
          <Link href="/home" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Trouver une séance
          </Link>
        </section>
      ) : (
        <>
          <section className="animate-fade-in-up grid grid-cols-2 gap-3 [animation-delay:80ms] sm:grid-cols-4">
            <Stat value={`${stats.totalSessions}`} label="Séances commencées" />
            <Stat value={`${stats.completedSessions}`} label="Séances terminées" />
            <Stat
              value={stats.totalMinutes === 0 ? "< 1 min" : `${stats.totalMinutes} min`}
              label="Temps de pratique"
            />
            <Stat value={`${stats.sessionsThisWeek}`} label="Cette semaine" />
          </section>

          {lastSession && (
            <section className="flex flex-col gap-4">
              <h2 className="animate-fade-in-up text-headline text-ink-900 [animation-delay:160ms]">
                Dernière séance
              </h2>
              <Link
                href={`/videos/${lastSession.video.slug}`}
                className="animate-fade-in-up group flex flex-col gap-2 rounded-lg border border-beige/60 bg-surface p-5 transition-all duration-200 ease-[var(--ease-standard)] [animation-delay:200ms] hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient-low)]"
              >
                <p className="text-title text-ink-900">{lastSession.video.title}</p>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" aria-hidden />
                    {formatPractised(lastSession.progressSeconds)} pratiquée{lastSession.progressSeconds >= 120 ? "s" : ""}
                  </span>
                  {lastSession.completed && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-sage-600">
                      <CheckCircle2 className="size-4" aria-hidden />
                      Terminée
                    </span>
                  )}
                  <span>{formatRelativeTime(lastSession.updatedAt)}</span>
                </p>
              </Link>
            </section>
          )}

          {earlier.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="animate-fade-in-up text-headline text-ink-900 [animation-delay:240ms]">
                Historique
              </h2>
              <div className="animate-fade-in-up grid grid-cols-2 gap-4 [animation-delay:280ms] lg:grid-cols-3">
                {earlier.map((entry) => (
                  <VideoCard
                    key={entry.video.id}
                    video={entry.video}
                    locked={entry.video.is_premium && !isSubscriber}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

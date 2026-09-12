import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getMostFavoritedVideos,
  getPrograms,
  getRecentVideos,
  getResumableVideo,
} from "@/lib/db/queries";
import { ProgramCard } from "@/components/video/ProgramCard";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { MoodGrid } from "@/components/home/MoodGrid";
import { ResumeCard } from "@/components/home/ResumeCard";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function SectionHeader({
  title,
  href,
  delay,
}: {
  title: string;
  href?: string;
  delay: string;
}) {
  return (
    <div
      className="animate-fade-in-up flex items-center justify-between gap-4"
      style={{ animationDelay: delay }}
    >
      {/* Wraps rather than truncates: "Reprends là où tu t'étais arrêtée"
          overflows a 320px screen, and a clipped heading reads as a bug. */}
      <h2 className="text-headline min-w-0 text-balance text-ink-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-sage-600 transition-colors duration-150 hover:text-sage-700"
        >
          Voir tout
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const { user, isSubscriber } = await getViewerAccess();

  const [resumable, latest, popular, programs] = await Promise.all([
    user ? getResumableVideo(user.id) : Promise.resolve(null),
    getRecentVideos(10),
    getMostFavoritedVideos(10),
    getPrograms(),
  ]);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];

  return (
    <div className="flex flex-col gap-10">
      <section className="animate-fade-in-up flex flex-col gap-1">
        {/* The name and the wave are glued with a non-breaking space so the
            emoji never orphans onto a line of its own on narrow screens. */}
        <h1 className="text-display text-balance text-ink-900">
          {greeting()}{" "}
          <span className="whitespace-nowrap">
            {firstName ? `${firstName} ` : ""}
            <span aria-hidden>👋</span>
          </span>
        </h1>
        <p className="text-body text-ink-600">Comment te sens-tu aujourd&apos;hui ?</p>
      </section>

      <section aria-label="Choisir selon votre besoin">
        <MoodGrid />
      </section>

      {programs.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeader title="Programmes" delay="340ms" />
          <div className="animate-fade-in-up -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-2 [animation-delay:380ms] md:-mx-8 md:px-8">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>
      )}

      {resumable && (
        <section className="flex flex-col gap-4">
          <SectionHeader title="Reprends là où tu t'étais arrêtée" delay="360ms" />
          <div className="animate-fade-in-up [animation-delay:400ms]">
            <ResumeCard
              video={resumable.video}
              progressSeconds={resumable.progressSeconds}
              locked={resumable.video.is_premium && !isSubscriber}
            />
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeader title="Derniers ajouts" href="/explore" delay="440ms" />
          <VideoCarousel videos={latest} isSubscriber={isSubscriber} />
        </section>
      )}

      {popular.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeader title="Les plus appréciées" href="/explore" delay="500ms" />
          <VideoCarousel videos={popular} isSubscriber={isSubscriber} />
        </section>
      )}
    </div>
  );
}

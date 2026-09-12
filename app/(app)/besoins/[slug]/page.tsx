import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMoodBySlug } from "@/lib/moods";
import { getVideosByCategorySlugs } from "@/lib/db/queries";
import { getViewerAccess } from "@/lib/access/subscription";
import { VideoCard } from "@/components/video/VideoCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mood = getMoodBySlug(slug);
  return { title: mood ? mood.headline : "Séances" };
}

export default async function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mood = getMoodBySlug(slug);
  if (!mood) notFound();

  const [{ isSubscriber }, videos] = await Promise.all([
    getViewerAccess(),
    getVideosByCategorySlugs(mood.categorySlugs),
  ]);

  const Icon = mood.icon;

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up flex flex-col gap-5">
        <Link
          href="/home"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors duration-150 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Accueil
        </Link>

        <div className="flex items-center gap-4">
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-pill ${mood.tint}`}
          >
            <Icon className="size-7" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="text-label text-sage-600">{mood.label}</p>
            <h1 className="text-headline text-ink-900">{mood.headline}</h1>
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="text-body text-ink-600">
          Aucune séance disponible pour ce besoin pour le moment. Revenez bientôt, de
          nouveaux contenus arrivent chaque semaine.
        </p>
      ) : (
        <div className="animate-fade-in-up grid grid-cols-2 gap-4 [animation-delay:80ms] lg:grid-cols-3">
          {videos.map((video) => (
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

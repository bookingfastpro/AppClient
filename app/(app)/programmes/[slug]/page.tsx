import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramBySlug } from "@/lib/db/queries";
import { getUser } from "@/lib/auth/session";
import { ProgramDetail } from "@/components/video/ProgramDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const user = await getUser();
  const result = await getProgramBySlug(slug, user?.id ?? null);
  return { title: result?.program.title ?? "Programme" };
}

/**
 * The full page. Reached on a refresh, from a shared link, or from
 * anywhere outside the (app) layout — clicks on a programme card inside
 * the app are intercepted by app/(app)/@modal/(.)programmes/[slug] and
 * open over the current screen instead.
 *
 * The negative margins cancel the app shell's own horizontal padding so
 * the cover image bleeds edge to edge, which is why <ProgramDetail />
 * carries its own padding rather than inheriting it.
 */
export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getUser();
  const result = await getProgramBySlug(slug, user?.id ?? null);
  if (!result) notFound();

  return (
    <ProgramDetail
      {...result}
      className="-mx-4 md:-mx-8"
      heroOverlay={
        <Link
          href="/home"
          aria-label="Retour"
          className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-pill bg-cream/85 text-ink-900 shadow-[var(--shadow-ambient-low)] backdrop-blur-sm transition-transform duration-150 ease-[var(--ease-standard)] hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
      }
    />
  );
}

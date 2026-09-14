import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/db/queries";
import { getUser } from "@/lib/auth/session";
import { ProgramDetail } from "@/components/video/ProgramDetail";

/**
 * Intercepts /programmes/[slug] on a client-side navigation — a tap on a
 * programme card from the home screen or a listing — and opens it over
 * whatever the member was already looking at.
 *
 * `(.)` is right even though this file is three folders deep: the
 * matcher counts route segments, and neither `(app)` (a route group) nor
 * `@modal` (a slot) is one. This therefore sits at the root level, where
 * `programmes` is a direct child.
 *
 * The dialog itself is in layout.tsx, so that it stays mounted while
 * loading.tsx hands over to this file.
 */
export default async function InterceptedProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();
  const result = await getProgramBySlug(slug, user?.id ?? null);
  if (!result) notFound();

  return <ProgramDetail {...result} />;
}

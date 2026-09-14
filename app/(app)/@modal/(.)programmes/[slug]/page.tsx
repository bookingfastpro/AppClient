import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/db/queries";
import { getUser } from "@/lib/auth/session";
import { ProgramDetail } from "@/components/video/ProgramDetail";
import { RouteModal } from "@/components/ui/RouteModal";

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
 * `hideTitle` keeps the programme's name as the dialog's accessible name
 * while letting the cover image lead, exactly as it does on the page. A
 * visible header above the cover would invert that order.
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

  // bodyClassName drops the modal's own padding: the cover image has to
  // reach the panel's edges, so ProgramDetail carries its own instead.
  return (
    <RouteModal
      title={result.program.title}
      hideTitle
      className="sm:max-w-lg"
      bodyClassName="px-0 pt-0"
    >
      <ProgramDetail {...result} />
    </RouteModal>
  );
}

import { notFound } from "next/navigation";
import { getProgramForAdmin } from "@/lib/admin/queries";
import { ProgramEditor } from "@/components/admin/ProgramEditor";
import { RouteModal } from "@/components/ui/RouteModal";

/**
 * Intercepts /admin/programs/[id] when it is reached by a client-side
 * navigation — that is, by clicking a programme in the list — and opens
 * it over the list instead of replacing it.
 *
 * `(.)` and not `(..)`: the convention counts route segments, and
 * `@modal` is a slot rather than a segment, so this file sits at the
 * /admin level where `programs` is a direct child.
 *
 * A refresh or a pasted link is a hard navigation, which skips the
 * interception entirely and renders app/admin/programs/[id] full-page.
 */
export default async function InterceptedProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProgramForAdmin(id);
  if (!result) notFound();

  return (
    <RouteModal title={result.program.title} className="sm:max-w-2xl">
      <ProgramEditor {...result} />
    </RouteModal>
  );
}

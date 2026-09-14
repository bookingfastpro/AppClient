import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgramForAdmin } from "@/lib/admin/queries";
import { ProgramEditor } from "@/components/admin/ProgramEditor";

/**
 * The full page. Reached by refreshing, by a shared link, or by any
 * navigation that isn't a click from the programme list — clicks from
 * the list are intercepted by app/admin/@modal/(.)programs/[id] and open
 * over it instead. Both render the same <ProgramEditor />.
 */
export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProgramForAdmin(id);
  if (!result) notFound();

  return (
    <div className="animate-fade-in-up flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/programs"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors duration-150 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Programmes
        </Link>
        <h1 className="text-headline text-balance text-ink-900">{result.program.title}</h1>
      </div>

      <ProgramEditor {...result} />
    </div>
  );
}

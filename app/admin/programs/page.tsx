import Link from "next/link";
import { getAllProgramsForAdmin } from "@/lib/admin/queries";
import { buttonVariants } from "@/components/ui/Button";

export default async function AdminProgramsPage() {
  const programs = await getAllProgramsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-headline text-ink-900">Programmes</h1>
        <Link
          href="/admin/programs/new"
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          Nouveau programme
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="text-body text-ink-600">
          Aucun programme pour le moment. Créez-en un, puis ajoutez-y des séances dans
          l&apos;ordre souhaité.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {programs.map((program) => (
            <li key={program.id}>
              <Link
                href={`/admin/programs/${program.id}`}
                className="flex items-center justify-between gap-4 rounded-md border border-beige bg-surface p-4 transition-colors duration-150 hover:bg-sand"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{program.title}</p>
                  <p className="truncate text-xs text-ink-600">/{program.slug}</p>
                </div>
                <span
                  className={
                    program.published
                      ? "shrink-0 rounded-pill bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-700"
                      : "shrink-0 rounded-pill bg-sand px-2.5 py-1 text-xs font-semibold text-ink-600"
                  }
                >
                  {program.published ? "Publié" : "Brouillon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

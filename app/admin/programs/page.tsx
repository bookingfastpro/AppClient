import Link from "next/link";
import { LayoutList } from "lucide-react";
import { getAllProgramsForAdmin } from "@/lib/admin/queries";
import { buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminProgramsPage() {
  const programs = await getAllProgramsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-headline text-ink-900">Programmes</h1>
        <Link
          href="/admin/programs/new"
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          Nouveau programme
        </Link>
      </div>

      {programs.length === 0 ? (
        <EmptyState
          icon={LayoutList}
          title="Aucun programme pour le moment"
          description="Créez-en un, puis ajoutez-y des séances dans l'ordre souhaité."
          action={{ href: "/admin/programs/new", label: "Nouveau programme" }}
        />
      ) : (
        <ul className="animate-fade-in-up flex flex-col gap-2 [animation-delay:80ms]">
          {programs.map((program) => (
            <li key={program.id}>
              <Link
                href={`/admin/programs/${program.id}`}
                className="flex items-center justify-between gap-4 rounded-md border border-beige bg-surface p-4 transition-all duration-150 ease-[var(--ease-standard)] hover:bg-sand active:scale-[0.99]"
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

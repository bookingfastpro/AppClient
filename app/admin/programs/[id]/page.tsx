import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import { getProgramForAdmin } from "@/lib/admin/queries";
import {
  addProgramVideoAction,
  deleteProgramAction,
  moveProgramVideoAction,
  removeProgramVideoAction,
} from "@/lib/admin/program-actions";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { Button } from "@/components/ui/Button";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProgramForAdmin(id);
  if (!result) notFound();

  const { program, sessions, availableVideos } = result;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/programs"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Programmes
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-headline text-ink-900">{program.title}</h1>
          <Link
            href={`/programmes/${program.slug}`}
            className="shrink-0 text-sm font-semibold text-sage-600 hover:text-sage-700"
          >
            Voir la page
          </Link>
        </div>
      </div>

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-6">
        <h2 className="text-title text-ink-900">Détails</h2>
        <ProgramForm
          program={{
            id: program.id,
            title: program.title,
            subtitle: program.subtitle,
            description: program.description,
            imagePath: program.image_path,
            level: program.level,
            published: program.published,
          }}
        />
      </section>

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-title text-ink-900">Séances</h2>
          <p className="text-sm text-ink-600">
            L&apos;ordre défini ici est celui affiché aux utilisateurs.
          </p>
        </div>

        {sessions.length === 0 ? (
          <p className="text-sm text-ink-600">Aucune séance dans ce programme.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {sessions.map((video, index) => (
              <li
                key={video.id}
                className="flex items-center gap-3 rounded-md border border-beige/70 p-3"
              >
                <span className="w-5 shrink-0 text-sm font-semibold text-ink-300">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{video.title}</p>
                  <p className="text-xs text-ink-600">
                    {formatDuration(video.duration_seconds)}
                  </p>
                </div>

                <form action={moveProgramVideoAction}>
                  <input type="hidden" name="programId" value={program.id} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label="Monter"
                    className="flex size-8 items-center justify-center rounded-sm text-ink-600 hover:bg-sand disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" aria-hidden />
                  </button>
                </form>

                <form action={moveProgramVideoAction}>
                  <input type="hidden" name="programId" value={program.id} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === sessions.length - 1}
                    aria-label="Descendre"
                    className="flex size-8 items-center justify-center rounded-sm text-ink-600 hover:bg-sand disabled:opacity-30"
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                </form>

                <form action={removeProgramVideoAction}>
                  <input type="hidden" name="programId" value={program.id} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <button
                    type="submit"
                    aria-label="Retirer du programme"
                    className="flex size-8 items-center justify-center rounded-sm text-error hover:bg-sand"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </form>
              </li>
            ))}
          </ol>
        )}

        {availableVideos.length > 0 && (
          <form action={addProgramVideoAction} className="flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="programId" value={program.id} />
            <label htmlFor="videoId" className="sr-only">
              Ajouter une séance
            </label>
            <select
              id="videoId"
              name="videoId"
              required
              defaultValue=""
              className="h-12 min-w-0 flex-1 rounded-md border border-beige bg-surface px-4 text-base text-ink-900 outline-none focus:border-sage-500"
            >
              <option value="" disabled>
                Choisir une vidéo…
              </option>
              {availableVideos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </select>
            <Button type="submit" variant="ghost" size="sm" className="shrink-0">
              Ajouter
            </Button>
          </form>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-beige bg-surface p-6">
        <h2 className="text-title text-ink-900">Supprimer</h2>
        <p className="text-sm text-ink-600">
          Le programme sera supprimé. Les vidéos qu&apos;il contient ne sont pas
          supprimées.
        </p>
        <form action={deleteProgramAction}>
          <input type="hidden" name="id" value={program.id} />
          <button
            type="submit"
            className="text-sm font-semibold text-error hover:underline"
          >
            Supprimer ce programme
          </button>
        </form>
      </section>
    </div>
  );
}

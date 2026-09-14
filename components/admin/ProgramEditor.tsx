import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, X } from "lucide-react";
import type { getProgramForAdmin } from "@/lib/admin/queries";
import {
  addProgramVideoAction,
  deleteProgramAction,
  moveProgramVideoAction,
  removeProgramVideoAction,
} from "@/lib/admin/program-actions";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { formatDuration } from "@/lib/video/thumbnail-url";
import { Button } from "@/components/ui/Button";
import { ConfirmActionButton } from "@/components/ui/ConfirmActionButton";

/**
 * Everything below the programme's title: details, session ordering, and
 * deletion.
 *
 * Shared verbatim by the full page at /admin/programs/[id] and by the
 * intercepted modal that opens over the list. Keeping one component
 * means the two can't drift — a field added to the page but forgotten in
 * the modal would be invisible to anyone who only ever clicks through
 * from the list.
 */
type ProgramData = NonNullable<Awaited<ReturnType<typeof getProgramForAdmin>>>;

export function ProgramEditor({ program, sessions, availableVideos }: ProgramData) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/programmes/${program.slug}`}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-sage-600 transition-colors duration-150 hover:text-sage-700"
      >
        Voir la page publique
        <ExternalLink className="size-3.5" aria-hidden />
      </Link>

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-5 sm:p-6">
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

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-title text-ink-900">Séances</h2>
          <p className="text-sm text-ink-600">
            L&apos;ordre défini ici est celui affiché aux utilisateurs.
          </p>
        </div>

        {sessions.length === 0 ? (
          <p className="text-sm text-ink-600">
            Aucune séance dans ce programme. Ajoutez-en une ci-dessous.
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {sessions.map((video, index) => (
              <li
                key={video.id}
                className="flex items-center gap-2 rounded-md border border-beige/70 p-3 transition-colors duration-150 ease-[var(--ease-standard)] hover:border-beige"
              >
                <span className="w-5 shrink-0 text-sm font-semibold text-ink-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{video.title}</p>
                  <p className="text-xs text-ink-600">{formatDuration(video.duration_seconds)}</p>
                </div>

                <form action={moveProgramVideoAction}>
                  <input type="hidden" name="programId" value={program.id} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label={`Monter « ${video.title} »`}
                    className="flex size-9 items-center justify-center rounded-sm text-ink-600 transition-all duration-150 ease-[var(--ease-standard)] hover:bg-sand active:scale-90 disabled:opacity-30 disabled:active:scale-100"
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
                    aria-label={`Descendre « ${video.title} »`}
                    className="flex size-9 items-center justify-center rounded-sm text-ink-600 transition-all duration-150 ease-[var(--ease-standard)] hover:bg-sand active:scale-90 disabled:opacity-30 disabled:active:scale-100"
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                </form>

                <form action={removeProgramVideoAction}>
                  <input type="hidden" name="programId" value={program.id} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <button
                    type="submit"
                    aria-label={`Retirer « ${video.title} » du programme`}
                    className="flex size-9 items-center justify-center rounded-sm text-error transition-all duration-150 ease-[var(--ease-standard)] hover:bg-error/10 active:scale-90"
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
              className="h-12 min-w-0 flex-1 rounded-md border border-beige bg-surface px-4 text-base text-ink-900 outline-none transition-colors duration-150 focus:border-sage-500"
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

      <section className="flex flex-col gap-3 rounded-lg border border-beige bg-surface p-5 sm:p-6">
        <h2 className="text-title text-ink-900">Supprimer</h2>
        <p className="text-sm text-ink-600">
          Le programme sera supprimé. Les vidéos qu&apos;il contient ne sont pas supprimées.
        </p>
        {/*
          Was a bare submit that deleted on the first click, with no
          confirmation of any kind — the one destructive action in the
          admin that had none.
        */}
        <ConfirmActionButton
          action={deleteProgramAction}
          fields={{ id: program.id }}
          triggerLabel="Supprimer ce programme"
          title={`Supprimer « ${program.title} » ?`}
          description="Le programme et l'ordre de ses séances seront perdus. Les vidéos elles-mêmes sont conservées. Cette action est irréversible."
          confirmLabel="Supprimer définitivement"
          className="w-fit px-0 hover:bg-transparent hover:underline"
        />
      </section>
    </div>
  );
}

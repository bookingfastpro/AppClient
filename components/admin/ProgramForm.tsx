"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  createProgramAction,
  updateProgramAction,
  type ProgramFormState,
} from "@/lib/admin/program-actions";

const initialState: ProgramFormState = { error: null };

type Values = {
  id?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  imagePath?: string | null;
  level?: string | null;
  published?: boolean;
};

export function ProgramForm({ program }: { program?: Values }) {
  const isEdit = !!program?.id;
  const [state, formAction, pending] = useActionState(
    isEdit ? updateProgramAction : createProgramAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isEdit && <input type="hidden" name="id" value={program.id} />}

      <Input
        label="Titre"
        name="title"
        required
        maxLength={120}
        defaultValue={program?.title ?? ""}
        placeholder="Yoga prénatal"
      />

      <Input
        label="Accroche"
        name="subtitle"
        maxLength={300}
        defaultValue={program?.subtitle ?? ""}
        placeholder="Un programme complet pour vivre une grossesse sereine."
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-label text-ink-600">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={program?.description ?? ""}
          className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-label text-ink-600">
          Image de couverture
        </label>

        {program?.imagePath && (
          <div className="relative aspect-[16/10] w-48 overflow-hidden rounded-sm bg-sand">
            {/* Unoptimised: the uploaded file already sits at its display
                size in storage, and this preview is admin-only. */}
            <Image
              src={program.imagePath}
              alt="Couverture actuelle"
              fill
              sizes="192px"
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="w-full rounded-md border border-beige bg-surface px-4 py-3 text-sm text-ink-900 outline-none file:mr-3 file:rounded-pill file:border-0 file:bg-sage-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-sage-700 focus:border-sage-500"
        />
        <p className="text-xs text-ink-600">
          JPG, PNG ou WebP, 5 Mo maximum.{" "}
          {program?.imagePath
            ? "Laissez vide pour conserver l'image actuelle."
            : "Format paysage recommandé."}
        </p>
      </div>

      <Input
        label="Niveau"
        name="level"
        maxLength={60}
        defaultValue={program?.level ?? ""}
        placeholder="Tous niveaux"
      />

      <label className="flex items-center gap-2.5 text-sm text-ink-900">
        <input
          type="checkbox"
          name="published"
          defaultChecked={program?.published ?? true}
          className="size-4 rounded-xs border-beige"
        />
        Publié
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} className="self-start">
        {isEdit ? "Enregistrer" : "Créer le programme"}
      </Button>
    </form>
  );
}

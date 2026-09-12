"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchYoutubeMetadataAction } from "@/lib/admin/actions";
import type { VideoFormState } from "@/lib/admin/actions";

type Category = { id: string; name: string };

export type VideoFormInitialValues = {
  youtubeUrl: string;
  title: string;
  description: string;
  categoryId: string;
  level: "beginner" | "intermediate" | "advanced" | "";
  instructor: string;
  durationMinutes: number;
  isPremium: boolean;
};

const EMPTY_VALUES: VideoFormInitialValues = {
  youtubeUrl: "",
  title: "",
  description: "",
  categoryId: "",
  level: "",
  instructor: "",
  durationMinutes: 0,
  isPremium: false,
};

export function VideoForm({
  categories,
  action,
  initialValues,
  submitLabel,
}: {
  categories: Category[];
  action: (prevState: VideoFormState, formData: FormData) => Promise<VideoFormState>;
  initialValues?: VideoFormInitialValues;
  submitLabel: string;
}) {
  const values = initialValues ?? EMPTY_VALUES;
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [title, setTitle] = useState(values.title);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleYoutubeUrlBlur(url: string) {
    if (!url.trim()) return;
    startTransition(async () => {
      const meta = await fetchYoutubeMetadataAction(url);
      if (!meta) return;
      setThumbnail(meta.thumbnailUrl);
      if (meta.title && !title) setTitle(meta.title);
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        label="Lien YouTube"
        name="youtubeUrl"
        required
        placeholder="https://www.youtube.com/watch?v=..."
        defaultValue={values.youtubeUrl}
        onBlur={(e) => handleYoutubeUrlBlur(e.target.value)}
      />

      {thumbnail && (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-md bg-sand">
          <Image src={thumbnail} alt="" fill sizes="320px" className="object-cover" />
        </div>
      )}

      <Input
        label="Titre"
        name="title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Réveil en douceur"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-label text-ink-600">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={values.description}
          placeholder="Réveillez le corps en douceur et posez un rythme tranquille pour la journée."
          className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId" className="text-label text-ink-600">
            Catégorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={values.categoryId}
            className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none focus:border-sage-500 focus:bg-sage-50"
          >
            <option value="" disabled>
              Choisir
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="level" className="text-label text-ink-600">
            Niveau
          </label>
          <select
            id="level"
            name="level"
            defaultValue={values.level}
            className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none focus:border-sage-500 focus:bg-sage-50"
          >
            <option value="">Non précisé</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Instructeur"
          name="instructor"
          required
          defaultValue={values.instructor}
          placeholder="Maya Chen"
        />
        <Input
          label="Durée (minutes)"
          name="durationMinutes"
          type="number"
          min={1}
          required
          defaultValue={values.durationMinutes || ""}
          placeholder="15"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <input
          type="checkbox"
          name="isPremium"
          defaultChecked={values.isPremium}
          className="size-4 rounded-xs border-beige accent-sage-600"
        />
        Premium (nécessite un abonnement actif)
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

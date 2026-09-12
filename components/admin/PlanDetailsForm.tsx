"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updatePlanDetailsAction, type PlanActionState } from "@/lib/admin/plan-actions";

const initialState: PlanActionState = { error: null };

export function PlanDetailsForm({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) {
  const [state, formAction, pending] = useActionState(updatePlanDetailsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input label="Titre de l'offre" name="title" required maxLength={120} defaultValue={title} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-label text-ink-600">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          maxLength={500}
          defaultValue={description}
          className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="features" className="text-label text-ink-600">
          Avantages inclus (un par ligne)
        </label>
        <textarea
          id="features"
          name="features"
          rows={5}
          maxLength={2000}
          defaultValue={features.join("\n")}
          placeholder={"Accès illimité aux séances premium\nNouveaux contenus chaque semaine\nSans engagement"}
          className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-sage-600">{state.success}</p>}

      <Button type="submit" loading={pending} className="self-start">
        Enregistrer
      </Button>
    </form>
  );
}

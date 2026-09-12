"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createNewPriceAction, type PlanActionState } from "@/lib/admin/plan-actions";
import { cn } from "@/lib/utils";

const initialState: PlanActionState = { error: null };

export function NewPriceForm() {
  const [state, formAction, pending] = useActionState(createNewPriceAction, initialState);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          label="Montant (€ TTC / mois ou an)"
          name="amount"
          type="number"
          step="0.01"
          min="1"
          required
          placeholder="9.99"
          className="sm:max-w-[200px]"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="interval" className="text-label text-ink-600">
            Fréquence
          </label>
          <select
            id="interval"
            name="interval"
            defaultValue="month"
            className="h-[52px] rounded-md border border-beige bg-surface px-4 text-base text-ink-900 outline-none focus:border-sage-500 focus:bg-sage-50"
          >
            <option value="month">Mensuel</option>
            <option value="year">Annuel</option>
          </select>
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-ink-600">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded-xs border-beige"
        />
        Je comprends que l&apos;ancien prix sera désactivé dans Stripe (les abonnés existants
        continuent au tarif précédent jusqu&apos;à résiliation).
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-sage-600">{state.success}</p>}

      <Button
        type="submit"
        loading={pending}
        disabled={!confirmed}
        className={cn("self-start", !confirmed && "opacity-50")}
      >
        Créer et activer ce prix
      </Button>
    </form>
  );
}

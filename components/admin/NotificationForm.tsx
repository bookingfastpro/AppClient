"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  createNotificationAction,
  type NotificationFormState,
} from "@/lib/admin/notification-actions";

const initialState: NotificationFormState = { error: null };

export function NotificationForm() {
  const [state, formAction, pending] = useActionState(createNotificationAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        label="Titre"
        name="title"
        required
        maxLength={120}
        placeholder="Nouveauté cette semaine"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-label text-ink-600">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          maxLength={500}
          placeholder="Trois nouvelles séances de méditation sont disponibles dès aujourd'hui."
          className="w-full rounded-md border border-beige bg-surface px-4 py-3.5 text-base text-ink-900 outline-none placeholder:text-ink-300 focus:border-sage-500 focus:bg-sage-50"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} className="self-start">
        Envoyer à tous les utilisateurs
      </Button>
    </form>
  );
}

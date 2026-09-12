"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type AuthActionState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: AuthActionState = { error: null };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <p className="text-body text-ink-900" role="status">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.com"
      />
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" loading={pending} className="mt-1 w-full">
        Envoyer le lien de réinitialisation
      </Button>
      <p className="text-center text-sm text-ink-600">
        <Link href="/sign-in" className="font-semibold text-sage-600 underline-offset-2 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}

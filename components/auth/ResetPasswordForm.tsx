"use client";

import { useActionState } from "react";
import { resetPasswordAction, type AuthActionState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: AuthActionState = { error: null };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        label="Nouveau mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="8 caractères minimum"
      />
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" loading={pending} className="mt-1 w-full">
        Valider le nouveau mot de passe
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthActionState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: AuthActionState = { error: null };

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? "/home"} />
      <Input
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.com"
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" loading={pending} className="mt-1 w-full">
        Se connecter
      </Button>
      <Link
        href="/forgot-password"
        className="text-center text-sm text-ink-600 underline-offset-2 hover:underline"
      >
        Mot de passe oublié ?
      </Link>
    </form>
  );
}

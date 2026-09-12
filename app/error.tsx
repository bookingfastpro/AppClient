"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";

/**
 * Replaces Next's default boundary, which renders an untranslated "This
 * page couldn't load" and shows the visitor nothing they can act on.
 *
 * React strips a Server Component error's real message in production
 * builds (error #441) and exposes only `digest`, so surfacing that digest
 * is the only way a visitor can quote something the server log can be
 * searched for. It is an opaque hash, not the message itself, so it leaks
 * nothing.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <p className="text-label text-ink-300">Erreur</p>
      <h1 className="text-headline text-ink-900">Cette page n&apos;a pas pu se charger.</h1>
      <p className="text-body max-w-sm text-ink-600">
        Quelque chose s&apos;est mal passé de notre côté. Réessayez dans un instant.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Réessayer</Button>
        <Link href="/home" className={buttonVariants({ variant: "ghost" })}>
          Retour à l&apos;accueil
        </Link>
      </div>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-ink-300">
          Référence : {error.digest}
        </p>
      )}
    </div>
  );
}

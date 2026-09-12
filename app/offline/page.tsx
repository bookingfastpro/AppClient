import type { Metadata } from "next";
import { CloudOff } from "lucide-react";
import { RetryButton } from "./RetryButton";

export const metadata: Metadata = {
  title: "Hors ligne",
};

/**
 * Precached by the service worker at install time and served whenever a
 * navigation fails. Everything it needs must therefore be static: no
 * Supabase call, no session read, nothing that assumes a network. It
 * also sits outside the proxy's matcher so it never waits on an auth
 * round trip that cannot complete.
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <span className="mb-2 flex size-16 items-center justify-center rounded-full bg-sand text-ink-300">
        <CloudOff className="size-7" strokeWidth={1.75} aria-hidden />
      </span>

      <p className="text-label text-ink-300">Hors ligne</p>
      <h1 className="text-headline text-balance text-ink-900">
        Pas de connexion pour le moment.
      </h1>
      <p className="text-body max-w-sm text-balance text-ink-600">
        Vos séances ont besoin d&apos;internet pour se charger. Reconnectez-vous à un
        réseau, puis réessayez.
      </p>

      <div className="mt-2">
        <RetryButton />
      </div>
    </div>
  );
}

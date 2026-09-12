"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { cn } from "@/lib/utils";

/**
 * "Commencer" navigates to account creation; "Se connecter" reveals the
 * credentials sheet in place instead of navigating, since this page is
 * already /sign-in. Both layers are absolutely bottom-anchored directly
 * to the photo card's own edges (not nested in the header's flex flow),
 * so the sheet's bottom always lands exactly on the card's bottom
 * regardless of how tall the header content above happens to render.
 */
export function SignInSplash({ next }: { next?: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="absolute inset-x-0 bottom-0 z-10">
      <div
        className={cn(
          "flex flex-col items-center gap-4 px-7 pb-9 transition-all duration-300 ease-[var(--ease-standard)]",
          revealed ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <Link
          href="/sign-up"
          className="w-full rounded-pill bg-cream py-4 text-center text-base font-semibold text-ink-900 shadow-[var(--shadow-ambient-md)] transition-transform duration-150 ease-[var(--ease-standard)] hover:-translate-y-0.5 active:translate-y-0"
        >
          Commencer
        </Link>
        <p className="text-sm text-cream/90">
          Déjà un compte ?{" "}
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="font-semibold text-cream underline-offset-2 hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-2xl bg-cream px-7 pt-7 shadow-[var(--shadow-ambient-lg)] transition-all duration-300 ease-[var(--ease-standard)]",
          revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
        style={{ paddingBottom: "max(1.75rem, calc(1rem + var(--safe-area-bottom)))" }}
      >
        <SignInForm next={next} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * "Se connecter" is a real link to ?form=1, not a bare button, and the
 * reveal is a progressive enhancement layered on top: the click handler
 * cancels the navigation and flips state instead, which is instant.
 * This matters because it was previously the only way in. A button whose
 * entire behaviour lives in an onClick is dead the moment hydration
 * fails — and then there is no way to sign in at all, on the one screen
 * where that is unacceptable. With the link, the worst case is a page
 * load that renders the form already open, server-side.
 */
export function SignInSplash({
  next,
  defaultRevealed = false,
}: {
  next?: string;
  defaultRevealed?: boolean;
}) {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const sheetRef = useRef<HTMLDivElement>(null);

  /*
    Move focus into the sheet once it is up. Without this the caret stays
    on the "Se connecter" link behind a panel that is now
    pointer-events-none, so a keyboard or screen-reader user reveals the
    form and then has to tab through invisible controls to reach it.

    Only on the in-place reveal: when the page loads with ?form=1 the
    focus belongs at the top of the document, as on any other page.
  */
  useEffect(() => {
    if (!revealed || defaultRevealed) return;
    const email = sheetRef.current?.querySelector<HTMLInputElement>('input[name="email"]');
    // After the transition, so the browser doesn't scroll the still
    // off-screen panel into view mid-animation.
    const timer = setTimeout(() => email?.focus({ preventScroll: true }), 320);
    return () => clearTimeout(timer);
  }, [revealed, defaultRevealed]);

  const formHref = next
    ? `/sign-in?form=1&next=${encodeURIComponent(next)}`
    : "/sign-in?form=1";

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
          <Link
            href={formHref}
            onClick={(event) => {
              // Let modified clicks (new tab, new window) behave normally.
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              setRevealed(true);
            }}
            className="font-semibold text-cream underline-offset-2 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>

      <div
        ref={sheetRef}
        // `inert`, not aria-hidden: the fields have to leave the tab
        // order as well as the accessibility tree while the sheet is
        // hidden. aria-hidden alone would leave them focusable, which is
        // the "focusable element inside aria-hidden" violation.
        inert={!revealed}
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

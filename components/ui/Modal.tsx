"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A modal built on the native <dialog>.
 *
 * `showModal()` gives us the focus trap, Escape handling, background
 * inertness and top-layer stacking for free — every one of which is a
 * thing hand-rolled modals typically get wrong. What this component adds
 * is appearance, enter/exit motion, and dismissal by backdrop click.
 *
 * The one genuinely awkward part of the native element is closing:
 * `close()` removes it from the top layer immediately, which would cut
 * any exit animation off mid-flight. So closing runs through a
 * "closing" state that keeps the element mounted until the transition
 * finishes, and only then calls `close()`.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  hideTitle = false,
  children,
  className,
  bodyClassName,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rendered under the title and wired up as the dialog's description. */
  description?: string;
  /**
   * Keeps the title as the dialog's accessible name but removes it from
   * view, for content that carries its own heading — a programme leading
   * with its cover image, say, where a header above would invert the
   * page's own visual order.
   */
  hideTitle?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Overrides the body padding for content that manages its own. */
  bodyClassName?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Guards against a drag that starts on the panel (selecting the title,
  // say) and releases outside it: that fires a click on the backdrop and
  // would otherwise dismiss the dialog mid-selection.
  const pressStartedOutside = useRef(false);
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");

  const finishClosing = useCallback(() => {
    const dialog = dialogRef.current;
    setState("closed");
    if (dialog?.open) dialog.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      // Two frames: the first paints the panel in its offset start
      // position, the second flips the attribute that transitions it in.
      // Without the gap the browser coalesces both into the end state
      // and nothing animates.
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setState("open")),
      );
      return () => cancelAnimationFrame(raf);
    }

    if (dialog.open) {
      setState("closing");
      // transitionend is the primary signal; the timeout is the safety
      // net for when the transition never fires — reduced-motion zeroes
      // every duration, and a hidden tab can skip it entirely.
      const timeout = setTimeout(finishClosing, 400);
      return () => clearTimeout(timeout);
    }
  }, [open, finishClosing]);

  return (
    <dialog
      ref={dialogRef}
      data-state={state}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="modal"
      // Escape fires `cancel` before the native close, so intercepting it
      // lets the exit animation run instead of the panel vanishing.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Dismiss on a click outside the panel. Testing against the panel
      // rather than against the dialog element matters: the dialog is a
      // full-viewport stage with a layout wrapper inside it, so a click
      // on the dimmed area targets that wrapper and never the dialog
      // itself.
      onPointerDown={(event) => {
        pressStartedOutside.current = !panelRef.current?.contains(event.target as Node);
      }}
      onClick={(event) => {
        const outside = !panelRef.current?.contains(event.target as Node);
        if (outside && pressStartedOutside.current) onClose();
      }}
      onTransitionEnd={(event) => {
        if (state === "closing" && event.target === panelRef.current) finishClosing();
      }}
    >
      <div className="flex h-full w-full items-end justify-center sm:items-center sm:p-6">
        <div
          ref={panelRef}
          /*
            Capped height with a scrolling body, not a panel that grows
            with its content: a long modal would otherwise run off the top
            of the viewport, taking its title and close button with it.
            The header stays put and only the body scrolls.
          */
          className={cn(
            // overflow-hidden so flush content — a cover image reaching
            // the panel's edges — is clipped by the rounded corners
            // instead of squaring them off.
            "modal-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-surface shadow-[var(--shadow-ambient-lg)] sm:max-h-[85dvh] sm:max-w-md sm:rounded-2xl",
            className,
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            /* The shadow is what keeps it readable when the panel opens
               onto an image rather than onto the plain surface. */
            className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-pill bg-surface text-ink-600 shadow-[var(--shadow-ambient-low)] transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-sand active:scale-95"
          >
            <X className="size-5" aria-hidden />
          </button>

          {/* The padding is dropped rather than overridden when hidden:
              sr-only sets padding to 0, and leaving px-6/pt-6 on top of
              it wins the cascade and leaves a clipped-but-sized box. */}
          <div className={cn(hideTitle ? "sr-only" : "shrink-0 px-6 pt-6")}>
            <h2 id="modal-title" className="text-title pr-12 text-balance text-ink-900">
              {title}
            </h2>

            {description && (
              <p id="modal-description" className="text-body mt-2 text-ink-600">
                {description}
              </p>
            )}
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain",
              bodyClassName ?? "px-6 pt-4",
            )}
            // The sheet sits flush against the bottom edge on phones, so
            // the scroll container has to clear the home indicator.
            style={{ paddingBottom: "max(1.5rem, calc(1rem + var(--safe-area-bottom)))" }}
          >
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
}

"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/lib/favorites/actions";

export function FavoriteButton({
  videoId,
  initialFavorited,
}: {
  videoId: string;
  initialFavorited: boolean;
}) {
  const [isFavorited, setOptimisticFavorited] = useOptimistic(initialFavorited);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={() => {
        // Progressive enhancement: a barely-there tap pulse, the kind a
        // native app gives on a confirm action. No-op where unsupported
        // (desktop browsers, iOS Safari).
        navigator.vibrate?.(10);
        startTransition(async () => {
          setOptimisticFavorited(!isFavorited);
          await toggleFavoriteAction(videoId, isFavorited);
        });
      }}
      className="flex size-11 items-center justify-center rounded-pill bg-surface shadow-[var(--shadow-ambient-low)] transition-transform duration-150 ease-[var(--ease-standard)] active:scale-90"
    >
      <Heart
        className={cn(
          "size-5 transition-colors duration-150",
          isFavorited ? "fill-sage-600 text-sage-600" : "text-ink-600",
        )}
        aria-hidden
      />
    </button>
  );
}

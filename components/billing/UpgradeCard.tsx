import { Lock } from "lucide-react";
import { createCheckoutSessionAction } from "@/lib/stripe/actions";
import { Button } from "@/components/ui/Button";

export function UpgradeCard({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-beige bg-surface p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-pill bg-terracotta-500 text-cream">
        <Lock className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-title text-ink-900">
          {title ? "Séance premium" : "Débloquez toute la bibliothèque"}
        </h3>
        <p className="text-body text-ink-600">
          {title
            ? `« ${title} » est disponible avec un abonnement actif.`
            : "Accédez sans limite à toutes les séances premium avec un abonnement."}
        </p>
      </div>
      <form action={createCheckoutSessionAction}>
        <Button type="submit" variant="premium">
          Démarrer l&apos;abonnement
        </Button>
      </form>
    </div>
  );
}

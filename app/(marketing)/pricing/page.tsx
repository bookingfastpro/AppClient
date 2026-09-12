import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { getMembershipPlanDisplay } from "@/lib/stripe/plans";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Un abonnement, toute la bibliothèque. Découvrez les tarifs de Yogella.",
};

const DEFAULT_BENEFITS = [
  "Séances premium illimitées",
  "De nouveaux cours chaque semaine",
  "Du yoga pour tous les niveaux",
  "Méditation et relaxation",
  "Contenus sommeil et paysages sonores",
  "Résiliable à tout moment, sans engagement",
];

function formatPrice(amountCents: number, currency: string, interval: string) {
  const amount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
  return `${amount} / ${interval === "year" ? "an" : "mois"}`;
}

export default async function PricingPage() {
  const plan = await getMembershipPlanDisplay();
  const benefits = plan.features.length > 0 ? plan.features : DEFAULT_BENEFITS;

  return (
    <section className="animate-fade-in-up mx-auto flex max-w-xl flex-col items-center gap-8 px-4 py-16 text-center md:px-8 md:py-24">
      <div className="flex flex-col gap-3">
        <h1 className="text-display text-ink-900">{plan.title}</h1>
        <p className="text-body text-ink-600">
          {plan.description ||
            "Les séances gratuites sont ouvertes à tous. Un abonnement débloque toute la bibliothèque."}
        </p>
      </div>

      {plan.price && (
        <p className="text-display text-ink-900">
          {formatPrice(plan.price.amountCents, plan.price.currency, plan.price.interval)}
        </p>
      )}

      <ul className="flex w-full flex-col gap-3 rounded-lg border border-beige bg-surface p-6 text-left">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-body text-ink-900">
            <Check className="mt-0.5 size-5 shrink-0 text-sage-600" aria-hidden />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-ink-600">
          {plan.price
            ? "Résiliable à tout moment depuis votre espace client."
            : "Le prix exact et la date de renouvellement s'affichent au moment du paiement, avant confirmation."}
        </p>
        <Link href="/sign-up" className={buttonVariants({ variant: "primary" })}>
          Démarrer l&apos;abonnement
        </Link>
      </div>
    </section>
  );
}

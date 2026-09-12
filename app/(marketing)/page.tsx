import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "Yogella — Yoga, Méditation & Sommeil" },
  description:
    "Un espace calme et premium pour la pratique du yoga, de la méditation, de la respiration et du sommeil. Séances gratuites et réservées aux membres, où que vous soyez.",
  openGraph: {
    title: "Yogella — Yoga, Méditation & Sommeil",
    description:
      "Un espace calme et premium pour la pratique du yoga, de la méditation, de la respiration et du sommeil.",
    type: "website",
  },
};

const PRACTICES = [
  { name: "Yoga", description: "Des enchaînements fluides pour la force et l'aisance." },
  { name: "Méditation", description: "Des séances guidées pour apaiser un esprit occupé." },
  { name: "Respiration", description: "Réguler son système nerveux en quelques minutes." },
  { name: "Relaxation", description: "Des séances lentes et réparatrices pour relâcher les tensions." },
  { name: "Sommeil", description: "Des rituels de fin de journée et des paysages sonores." },
  { name: "Flexibilité", description: "Des étirements profonds pour gagner en mobilité." },
];

export default function MarketingHomePage() {
  return (
    <>
      <section className="animate-fade-in-up mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 pb-16 pt-16 md:px-8 md:pt-28">
        <h1 className="text-display text-ink-900">
          Un espace calme pour pratiquer, quand vous en avez besoin.
        </h1>
        <p className="text-body text-ink-600">
          Des séances de yoga, méditation, respiration et sommeil animées par de vrais
          instructeurs. Commencez gratuitement, ou débloquez toute la bibliothèque avec un
          abonnement.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/sign-up" className={buttonVariants({ variant: "primary" })}>
            Commencer à pratiquer
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: "ghost" })}>
            Voir les tarifs
          </Link>
        </div>
      </section>

      <section className="animate-fade-in-up border-t border-beige bg-surface px-4 py-16 [animation-delay:100ms] md:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-headline text-ink-900">Six façons de pratiquer</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
            {PRACTICES.map((practice) => (
              <div key={practice.name} className="flex flex-col gap-1">
                <h3 className="text-title text-ink-900">{practice.name}</h3>
                <p className="text-body text-ink-600">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-16 md:px-8">
        <h2 className="text-headline text-ink-900">
          Gratuit pour commencer, honnête sur ce qui ne l&apos;est pas.
        </h2>
        <p className="text-body text-ink-600">
          Chaque séance est visible par tous. Les séances gratuites se lancent
          instantanément. Les séances premium sont clairement indiquées, et un abonnement
          les débloque toutes, sans surprise.
        </p>
        <Link href="/sign-up" className={buttonVariants({ variant: "primary" })}>
          Créer votre compte
        </Link>
      </section>
    </>
  );
}

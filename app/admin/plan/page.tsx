import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { PlanDetailsForm } from "@/components/admin/PlanDetailsForm";
import { NewPriceForm } from "@/components/admin/NewPriceForm";

function formatPrice(amountCents: number, currency: string, interval: string) {
  const amount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
  return `${amount} / ${interval === "year" ? "an" : "mois"}`;
}

export default async function AdminPlanPage() {
  const admin = createAdminClient();
  const { data: plan } = await admin.from("membership_plan").select("*").eq("id", 1).maybeSingle();

  let currentPriceLabel: string | null = null;
  if (plan?.stripe_price_id) {
    try {
      const price = await getStripe().prices.retrieve(plan.stripe_price_id);
      currentPriceLabel = formatPrice(price.unit_amount ?? 0, price.currency, price.recurring?.interval ?? "month");
    } catch {
      currentPriceLabel = null;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline text-ink-900">Abonnement</h1>
        <p className="text-body text-ink-600">
          Gérez le contenu et le prix de l&apos;offre premium affichée sur la page tarifs.
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-6">
        <h2 className="text-title text-ink-900">Détails de l&apos;offre</h2>
        <PlanDetailsForm
          title={plan?.title ?? "Abonnement Yogella"}
          description={plan?.description ?? ""}
          features={plan?.features ?? []}
        />
      </section>

      <section className="flex flex-col gap-5 rounded-lg border border-beige bg-surface p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-title text-ink-900">Prix</h2>
          <p className="text-sm text-ink-600">
            {currentPriceLabel ? (
              <>
                Prix actif : <span className="font-semibold text-ink-900">{currentPriceLabel}</span>
              </>
            ) : (
              "Aucun prix Stripe n'est configuré pour le moment."
            )}
          </p>
        </div>
        <NewPriceForm />
      </section>
    </div>
  );
}

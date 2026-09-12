import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";

/**
 * The Stripe Price ID currently used at checkout, sourced from the DB
 * (set via /admin/plan) rather than a static env var — lets the admin
 * change the price without a redeploy. Stripe Prices are immutable
 * amounts, so "changing the price" means creating a new Price and
 * switching this reference to it (see lib/admin/plan-actions.ts).
 */
export async function getMembershipPriceId() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("membership_plan")
    .select("stripe_price_id")
    .eq("id", 1)
    .maybeSingle();

  if (!data?.stripe_price_id) {
    throw new Error("Aucun prix d'abonnement n'est configuré. Configurez-le depuis /admin/plan.");
  }
  return data.stripe_price_id;
}

export type MembershipPlanDisplay = {
  title: string;
  description: string;
  features: string[];
  price: { amountCents: number; currency: string; interval: string } | null;
};

/** Plan copy (from our DB) plus the live price (fetched from Stripe) for the public pricing page. */
export async function getMembershipPlanDisplay(): Promise<MembershipPlanDisplay> {
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("membership_plan")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const base = {
    title: plan?.title ?? "Abonnement Yogella",
    description: plan?.description ?? "",
    features: plan?.features ?? [],
  };

  if (!plan?.stripe_price_id) {
    return { ...base, price: null };
  }

  try {
    const price = await getStripe().prices.retrieve(plan.stripe_price_id);
    return {
      ...base,
      price: {
        amountCents: price.unit_amount ?? 0,
        currency: price.currency,
        interval: price.recurring?.interval ?? "month",
      },
    };
  } catch {
    return { ...base, price: null };
  }
}

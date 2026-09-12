"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { planDetailsSchema, newPriceSchema } from "@/lib/validations/plan";

export type PlanActionState = {
  error: string | null;
  success?: string | null;
};

export async function updatePlanDetailsAction(
  _prevState: PlanActionState,
  formData: FormData,
): Promise<PlanActionState> {
  await requireAdmin();

  const parsed = planDetailsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    features: formData.get("features"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const features = parsed.data.features
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const admin = createAdminClient();
  const { error } = await admin
    .from("membership_plan")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      features,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { error: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer." };
  }

  revalidatePath("/admin/plan");
  revalidatePath("/pricing");
  return { error: null, success: "Modifications enregistrées." };
}

export async function createNewPriceAction(
  _prevState: PlanActionState,
  formData: FormData,
): Promise<PlanActionState> {
  await requireAdmin();

  const parsed = newPriceSchema.safeParse({
    amount: formData.get("amount"),
    interval: formData.get("interval"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const admin = createAdminClient();
  const { data: plan } = await admin
    .from("membership_plan")
    .select("stripe_product_id, stripe_price_id, title")
    .eq("id", 1)
    .maybeSingle();

  const stripe = getStripe();

  try {
    let productId = plan?.stripe_product_id ?? null;
    if (!productId) {
      const product = await stripe.products.create({ name: plan?.title || "Abonnement Yogella" });
      productId = product.id;
    }

    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: Math.round(parsed.data.amount * 100),
      currency: "eur",
      recurring: { interval: parsed.data.interval },
    });

    // Archive the old price so it stops showing up as selectable in
    // Stripe, without touching subscribers already on it — Stripe keeps
    // existing subscriptions running on a price even after it's archived.
    if (plan?.stripe_price_id) {
      await stripe.prices.update(plan.stripe_price_id, { active: false }).catch(() => {});
    }

    const { error } = await admin
      .from("membership_plan")
      .update({
        stripe_product_id: productId,
        stripe_price_id: newPrice.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      return { error: "Le prix a été créé dans Stripe mais l'enregistrement a échoué. Réessayez." };
    }
  } catch {
    return { error: "Une erreur est survenue lors de la création du prix dans Stripe." };
  }

  revalidatePath("/admin/plan");
  revalidatePath("/pricing");
  return { error: null, success: "Nouveau prix créé et activé." };
}

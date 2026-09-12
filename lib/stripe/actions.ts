"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { getMembershipPriceId } from "@/lib/stripe/plans";

async function getExistingCustomerId(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.stripe_customer_id ?? null;
}

export async function createCheckoutSessionAction() {
  const user = await requireUser();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const [existingCustomerId, priceId] = await Promise.all([
    getExistingCustomerId(user.id),
    getMembershipPriceId(),
  ]);

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    locale: "fr",
    line_items: [{ price: priceId, quantity: 1 }],
    ...(existingCustomerId
      ? { customer: existingCustomerId }
      : { customer_email: user.email }),
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
    subscription_data: { metadata: { supabase_user_id: user.id } },
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/account?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}

export async function createPortalSessionAction() {
  const user = await requireUser();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const customerId = await getExistingCustomerId(user.id);

  if (!customerId) {
    redirect("/account");
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/account`,
    locale: "fr",
  });

  redirect(portalSession.url);
}

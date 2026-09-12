"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Grants premium access without a real Stripe subscription behind it
 * (comp access / manual override). Reuses the user's existing
 * stripe_customer_id if one already exists (e.g. a past real
 * subscription) so a later real checkout still resolves to the same
 * Stripe customer, rather than fabricating a second one.
 */
export async function grantManualAccessAction(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: existing?.stripe_customer_id ?? `manual_${userId}`,
      stripe_subscription_id: null,
      status: "active",
      price_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      is_manual: true,
    },
    { onConflict: "user_id" },
  );

  revalidatePath("/admin/users");
}

/**
 * Only ever cancels a row this admin panel itself granted (is_manual =
 * true) — never a real Stripe-synced subscription, which must be managed
 * through Stripe (see the "Stripe" link on each row) so our DB stays in
 * sync with what Stripe actually billed.
 */
export async function revokeManualAccessAction(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  const admin = createAdminClient();
  await admin
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("user_id", userId)
    .eq("is_manual", true);

  revalidatePath("/admin/users");
}

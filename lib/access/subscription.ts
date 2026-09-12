import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/auth/session";

/** Stripe subscription statuses that grant premium access. */
export const ACTIVE_STATUSES = ["active", "trialing"] as const;

export type SubscriptionAccess = {
  hasAccess: boolean;
  status: string | null;
  cancelAtPeriodEnd: boolean;
};

/**
 * The single source of truth for "does this user have active premium
 * access." Every gated surface (the video detail page's Play/Upgrade CTA,
 * and — critically — the signed-url route that actually authorizes
 * playback) must call this rather than re-deriving access from client
 * state or re-querying subscriptions directly.
 */
export async function hasActivePremiumAccess(
  userId: string,
): Promise<SubscriptionAccess> {
  const admin = createAdminClient();

  const { data } = await admin
    .from("subscriptions")
    .select("status, cancel_at_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    return { hasAccess: false, status: null, cancelAtPeriodEnd: false };
  }

  return {
    hasAccess: (ACTIVE_STATUSES as readonly string[]).includes(data.status),
    status: data.status,
    cancelAtPeriodEnd: data.cancel_at_period_end,
  };
}

/**
 * Convenience for pages that render video listings: the current user (if
 * any) plus whether they currently have active premium access. Used to
 * decide whether a premium VideoCard shows as locked.
 */
export async function getViewerAccess() {
  const user = await getUser();
  const isSubscriber = user ? (await hasActivePremiumAccess(user.id)).hasAccess : false;
  return { user, isSubscriber };
}

/** Human-readable French label for a Stripe subscription status. Shared between the account page and the admin users list. */
export function subscriptionStatusLabel(status: string | null, isManual = false) {
  if (!status) return "Aucun abonnement";
  if (isManual && (ACTIVE_STATUSES as readonly string[]).includes(status)) return "Accès manuel";
  if ((ACTIVE_STATUSES as readonly string[]).includes(status)) return "Actif";
  if (status === "past_due") return "Paiement en retard";
  if (status === "canceled") return "Résilié";
  if (status === "unpaid") return "Impayé";
  if (status === "incomplete" || status === "incomplete_expired") return "Incomplet";
  return "Aucun abonnement";
}

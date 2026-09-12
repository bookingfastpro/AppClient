import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook handler. This is the ONLY writer to public.subscriptions
 * (see supabase/migrations/0007_rls_policies.sql — anon/authenticated have
 * no insert/update policy on that table). Signature verification and the
 * stripe_events idempotency guard make this safe to expose publicly; it is
 * excluded from the auth-cookie proxy in proxy.ts's matcher.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: Stripe redelivers events on timeout/non-2xx. A primary
  // key conflict here means we've already processed this event.
  const { error: insertError } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });

  if (insertError) {
    // Already processed (or a transient error) — either way, ack so
    // Stripe does not keep retrying an event we've already handled.
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          await syncSubscription(
            admin,
            session.subscription as string,
            session.metadata?.supabase_user_id,
          );
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(
          admin,
          subscription.id,
          subscription.metadata?.supabase_user_id,
          subscription,
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("stripe webhook processing failed", event.type, err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(
  admin: ReturnType<typeof createAdminClient>,
  subscriptionId: string,
  supabaseUserId: string | undefined,
  preloaded?: Stripe.Subscription,
) {
  const subscription =
    preloaded ?? (await getStripe().subscriptions.retrieve(subscriptionId));

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const userId = supabaseUserId ?? subscription.metadata?.supabase_user_id;
  if (!userId) {
    console.error("stripe webhook: subscription has no supabase_user_id metadata", subscriptionId);
    return;
  }

  const item = subscription.items.data[0];

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_id: item?.price.id ?? null,
      current_period_start: item?.current_period_start
        ? new Date(item.current_period_start * 1000).toISOString()
        : null,
      current_period_end: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      // A real Stripe event is always authoritative over a manual admin
      // grant (see lib/admin/subscription-actions.ts) — explicitly clear
      // the flag rather than leaving whatever value the row had before,
      // since upsert only touches columns present in this payload.
      is_manual: false,
    },
    { onConflict: "user_id" },
  );
}

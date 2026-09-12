import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazily constructs the Stripe client on first use rather than at module
 * evaluation time — this file is imported (transitively, via billing
 * components and server actions) by pages that never actually call
 * Stripe, so eagerly requiring STRIPE_SECRET_KEY at import time would
 * break builds/pages whenever that secret isn't configured.
 */
export function getStripe() {
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  }
  return cached;
}

import { NextResponse } from "next/server";

/**
 * Pure liveness check — no Supabase/Stripe calls. A transient upstream
 * outage must never cascade into a container restart.
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}

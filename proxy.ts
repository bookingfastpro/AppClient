import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (static assets)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image/font files
     * - the Stripe webhook, which must never pass through the auth-cookie
     *   pipeline — it authenticates via signature verification instead.
     * - the healthcheck endpoint, which must stay a pure liveness probe
     *   with no dependency on Supabase being reachable.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/stripe/webhook|api/healthz|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

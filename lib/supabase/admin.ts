import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client. Bypasses RLS entirely — used for the
 * Stripe webhook's writes to subscriptions, the admin panel's video
 * writes (after lib/auth/admin.ts confirms the predefined admin email),
 * and any read that needs to ignore RLS.
 *
 * The `server-only` import guard makes any accidental client-bundle
 * import of this file a build-time error, not a runtime leak.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

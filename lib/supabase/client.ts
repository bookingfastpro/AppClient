import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/** Browser-side Supabase client for use in Client Components. */
export function createClient() {
  return createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    requireEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  );
}

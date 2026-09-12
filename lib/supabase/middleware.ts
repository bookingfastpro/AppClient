import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { requireEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

const PROTECTED_PREFIXES = [
  "/home",
  "/explore",
  "/categories",
  "/besoins",
  "/programmes",
  "/videos",
  "/favorites",
  "/search",
  "/practice",
  "/account",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Refreshes the Supabase session cookie on every request and redirects
 * unauthenticated visitors away from the gated (app) routes. Runs before
 * any Server Component, so it is the first and cheapest authorization
 * boundary — not the only one (see lib/access/subscription.ts for
 * subscription-level authorization).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    requireEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() revalidates the JWT against the Auth server rather than
  // trusting a possibly-stale cookie — always use this, never getSession(),
  // for any authorization decision. A network/config failure here is
  // treated as "no user": protected routes still redirect (fail closed),
  // and public routes keep rendering instead of 500ing the whole site
  // during a transient Auth outage.
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (error) {
    console.error("supabase.auth.getUser() failed in proxy", error);
  }

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

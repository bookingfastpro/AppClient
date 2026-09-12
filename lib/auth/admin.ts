import "server-only";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth/session";

/**
 * The single predefined super-admin account, identified by email via
 * ADMIN_EMAIL — not a self-service role system. Everyone else (logged
 * out, or logged in as a different user) gets an identical 404, never a
 * sign-in redirect, so the admin panel's existence isn't advertised and
 * its URL leaks no information about auth state.
 */
export async function requireAdmin() {
  const user = await getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail) {
    notFound();
  }

  return user;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the current user, or null. Always revalidates against the Auth server. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns the current user, or redirects to sign-in. Use in Server Components/Actions that require a session. */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

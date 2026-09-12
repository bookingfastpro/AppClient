import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllVideosForAdmin() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("videos")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getVideoForAdmin(id: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("videos").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllProgramsForAdmin() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProgramForAdmin(id: string) {
  const admin = createAdminClient();

  const [{ data: program }, { data: rows }, { data: allVideos }] = await Promise.all([
    admin.from("programs").select("*").eq("id", id).maybeSingle(),
    admin
      .from("program_videos")
      .select("position, videos(id, title, duration_seconds, youtube_id)")
      .eq("program_id", id)
      .order("position", { ascending: true }),
    admin.from("videos").select("id, title").order("title", { ascending: true }),
  ]);

  if (!program) return null;

  const sessions = (rows ?? []).filter((r) => r.videos).map((r) => r.videos);
  const assigned = new Set(sessions.map((s) => s.id));

  return {
    program,
    sessions,
    availableVideos: (allVideos ?? []).filter((v) => !assigned.has(v.id)),
  };
}

export async function getAllNotificationsForAdmin() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export type AdminUserRow = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  subscription: {
    status: string;
    stripeCustomerId: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    isManual: boolean;
  } | null;
};

/**
 * Merges Supabase Auth users with their subscription row. Auth users are
 * the source of truth for identity (email, signup date); there is no
 * public.users table to query directly, so this uses the Admin Auth API,
 * which is only reachable with the service-role client.
 */
export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  const admin = createAdminClient();

  const [{ data: usersPage }, { data: subscriptions }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin
      .from("subscriptions")
      .select(
        "user_id, status, stripe_customer_id, current_period_end, cancel_at_period_end, is_manual",
      ),
  ]);

  const subscriptionByUserId = new Map(
    (subscriptions ?? []).map((s) => [
      s.user_id,
      {
        status: s.status,
        stripeCustomerId: s.stripe_customer_id,
        currentPeriodEnd: s.current_period_end,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        isManual: s.is_manual,
      },
    ]),
  );

  return (usersPage?.users ?? [])
    .map((user) => ({
      id: user.id,
      email: user.email ?? "",
      fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
      createdAt: user.created_at,
      subscription: subscriptionByUserId.get(user.id) ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdminDashboardStats() {
  const admin = createAdminClient();

  const [usersResult, videosResult, premiumVideosResult, subscriptionsResult, notificationsResult] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin.from("videos").select("id", { count: "exact", head: true }),
      admin.from("videos").select("id", { count: "exact", head: true }).eq("is_premium", true),
      admin.from("subscriptions").select("status"),
      admin.from("notifications").select("id", { count: "exact", head: true }),
    ]);

  const activeSubscribers = (subscriptionsResult.data ?? []).filter((s) =>
    ["active", "trialing"].includes(s.status),
  ).length;

  return {
    totalUsers: usersResult.data?.users.length ?? 0,
    activeSubscribers,
    totalVideos: videosResult.count ?? 0,
    premiumVideos: premiumVideosResult.count ?? 0,
    notificationsSent: notificationsResult.count ?? 0,
  };
}

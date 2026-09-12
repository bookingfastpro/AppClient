import { createClient } from "@/lib/supabase/server";
import type { VideoSummary } from "@/types/database.types";

const VIDEO_SUMMARY_COLUMNS = "*";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getFeaturedVideo() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getRecentVideos(limit = 10, excludeId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return data ?? [];
}

export async function getVideosByCategory(categoryId: string, limit = 20) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getVideoBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select(`${VIDEO_SUMMARY_COLUMNS}, categories(name, slug)`)
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function searchVideos(query: string, limit = 20) {
  // Strip characters with special meaning in PostgREST's filter syntax
  // before interpolating into .or() — otherwise a crafted query could
  // alter the filter expression itself.
  const safe = query.replace(/[,()%*]/g, "").trim();
  if (!safe) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Most-favorited published videos, ordered by popularity. */
export async function getMostFavoritedVideos(limit = 6) {
  const supabase = await createClient();
  const { data: counts } = await supabase.rpc("get_top_favorited_videos", {
    video_limit: limit,
  });
  if (!counts || counts.length === 0) return [];

  const ids = counts.map((c) => c.video_id);
  const { data: videos } = await supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .in("id", ids);
  if (!videos) return [];

  // RLS-filtered videos may be a subset of ids (e.g. one got unpublished);
  // reorder by popularity rather than trusting the .in() result order.
  const order = new Map(ids.map((id, index) => [id, index]));
  return [...videos].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );
}

/** One representative thumbnail per category, from its most recent video. */
export async function getCategoriesWithSample() {
  const categories = await getCategories();
  const supabase = await createClient();

  return Promise.all(
    categories.map(async (category) => {
      const { data } = await supabase
        .from("videos")
        .select("youtube_id")
        .eq("category_id", category.id)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return { ...category, sampleYoutubeId: data?.youtube_id ?? null };
    }),
  );
}

/**
 * Broadcast notifications with per-viewer read state merged in.
 * Unauthenticated visitors never call this (the bell only renders in the
 * authenticated app shell), but it degrades to "all unread" if they do.
 */
export async function getNotificationsWithReadState(userId: string | null, limit = 20) {
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!notifications || notifications.length === 0) return [];

  if (!userId) {
    return notifications.map((n) => ({ ...n, read: false }));
  }

  const { data: reads } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId)
    .in(
      "notification_id",
      notifications.map((n) => n.id),
    );
  const readIds = new Set((reads ?? []).map((r) => r.notification_id));

  return notifications.map((n) => ({ ...n, read: readIds.has(n.id) }));
}

export async function getVideosByCategorySlugs(slugs: string[], limit = 20) {
  if (slugs.length === 0) return [];
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id")
    .in("slug", slugs);
  if (!categories || categories.length === 0) return [];

  const { data } = await supabase
    .from("videos")
    .select(VIDEO_SUMMARY_COLUMNS)
    .in(
      "category_id",
      categories.map((c) => c.id),
    )
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/**
 * The single session offered as "resume": most recently watched, not yet
 * finished, and actually started (a row created the instant playback
 * begins would otherwise offer to resume something at 0:00).
 */
export async function getResumableVideo(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_history")
    .select(`progress_seconds, updated_at, videos(${VIDEO_SUMMARY_COLUMNS})`)
    .eq("user_id", userId)
    .eq("completed", false)
    .gt("progress_seconds", 10)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.videos) return null;
  return { video: data.videos, progressSeconds: data.progress_seconds };
}

/** Resume position for one video, or 0 if it was never started or already finished. */
export async function getWatchProgress(userId: string, videoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_history")
    .select("progress_seconds, completed")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (!data || data.completed) return 0;
  return data.progress_seconds;
}

export async function getWatchHistory(userId: string, limit = 20) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_history")
    .select(`progress_seconds, completed, updated_at, videos(${VIDEO_SUMMARY_COLUMNS})`)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .filter((row) => row.videos)
    .map((row) => ({
      video: row.videos,
      progressSeconds: row.progress_seconds,
      completed: row.completed,
      updatedAt: row.updated_at,
    }));
}

/**
 * Practice totals for /practice. Minutes count watched time, not video
 * runtime, so a session abandoned halfway doesn't inflate the number.
 */
export async function getPracticeStats(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_history")
    .select("progress_seconds, completed, updated_at")
    .eq("user_id", userId);

  const rows = data ?? [];
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    totalSessions: rows.length,
    completedSessions: rows.filter((r) => r.completed).length,
    totalMinutes: Math.round(rows.reduce((sum, r) => sum + r.progress_seconds, 0) / 60),
    sessionsThisWeek: rows.filter((r) => new Date(r.updated_at).getTime() >= sevenDaysAgo).length,
  };
}

export async function getPrograms() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export type ProgramSession = {
  video: VideoSummary;
  position: number;
  completed: boolean;
};

/**
 * A programme plus its ordered sessions. Completion is read from
 * watch_history rather than stored per programme, so finishing a video
 * anywhere in the app ticks it off here too.
 */
export async function getProgramBySlug(slug: string, userId: string | null) {
  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!program) return null;

  const { data: rows } = await supabase
    .from("program_videos")
    .select(`position, videos(${VIDEO_SUMMARY_COLUMNS})`)
    .eq("program_id", program.id)
    .order("position", { ascending: true });

  const entries = (rows ?? []).filter((r) => r.videos);

  let completedIds = new Set<string>();
  if (userId && entries.length > 0) {
    const { data: history } = await supabase
      .from("watch_history")
      .select("video_id, completed")
      .eq("user_id", userId)
      .eq("completed", true)
      .in(
        "video_id",
        entries.map((e) => e.videos.id),
      );
    completedIds = new Set((history ?? []).map((h) => h.video_id));
  }

  const sessions: ProgramSession[] = entries.map((entry, index) => ({
    video: entry.videos,
    position: index + 1,
    completed: completedIds.has(entry.videos.id),
  }));

  return { program, sessions };
}

export async function getFavoriteVideoIds(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("video_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((f) => f.video_id));
}

export async function getFavoriteVideos(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select(`created_at, videos(${VIDEO_SUMMARY_COLUMNS})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => row.videos).filter(Boolean);
}

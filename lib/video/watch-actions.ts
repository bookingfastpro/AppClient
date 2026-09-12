"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";

/**
 * Called by the player every few seconds while a video plays. Writes
 * through the user-scoped client (not the service role) so RLS is what
 * guarantees a viewer can only ever touch their own row, and silently
 * no-ops for logged-out viewers, who can still watch free sessions.
 */
export async function recordWatchProgressAction(
  videoId: string,
  progressSeconds: number,
  durationSeconds: number,
) {
  const user = await getUser();
  if (!user) return;

  const progress = Math.max(0, Math.floor(progressSeconds));
  const completed = durationSeconds > 0 && progress >= durationSeconds * 0.9;

  const supabase = await createClient();
  await supabase.from("watch_history").upsert(
    {
      user_id: user.id,
      video_id: videoId,
      progress_seconds: progress,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,video_id" },
  );
}

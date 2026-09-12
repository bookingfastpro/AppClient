"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

export async function toggleFavoriteAction(videoId: string, isFavorited: boolean) {
  const user = await requireUser();
  const supabase = await createClient();

  if (isFavorited) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("video_id", videoId);
  } else {
    // Unique (user_id, video_id) constraint makes this safe to retry.
    await supabase
      .from("favorites")
      .upsert({ user_id: user.id, video_id: videoId }, { onConflict: "user_id,video_id" });
  }

  revalidatePath("/favorites");
}

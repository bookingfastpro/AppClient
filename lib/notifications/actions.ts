"use server";

import { getUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function markNotificationReadAction(notificationId: string) {
  const user = await getUser();
  if (!user) return;

  const supabase = await createClient();
  // Unique (notification_id, user_id) primary key makes this safe to retry.
  await supabase
    .from("notification_reads")
    .upsert(
      { notification_id: notificationId, user_id: user.id },
      { onConflict: "notification_id,user_id", ignoreDuplicates: true },
    );
}

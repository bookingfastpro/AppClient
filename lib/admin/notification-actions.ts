"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { notificationFormSchema } from "@/lib/validations/notification";

export type NotificationFormState = {
  error: string | null;
};

export async function createNotificationAction(
  _prevState: NotificationFormState,
  formData: FormData,
): Promise<NotificationFormState> {
  await requireAdmin();

  const parsed = notificationFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("notifications").insert({
    title: parsed.data.title,
    body: parsed.data.body,
  });

  if (error) {
    return { error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." };
  }

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
  redirect("/admin/notifications");
}

export async function deleteNotificationAction(formData: FormData) {
  await requireAdmin();
  const notificationId = formData.get("notificationId");
  if (typeof notificationId !== "string" || !notificationId) return;

  const admin = createAdminClient();
  await admin.from("notifications").delete().eq("id", notificationId);

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
}

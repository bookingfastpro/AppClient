"use client";

import { deleteNotificationAction } from "@/lib/admin/notification-actions";

export function DeleteNotificationButton({
  notificationId,
  title,
}: {
  notificationId: string;
  title: string;
}) {
  return (
    <form
      action={deleteNotificationAction}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer la notification « ${title} » ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="notificationId" value={notificationId} />
      <button
        type="submit"
        className="rounded-pill px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/10"
      >
        Supprimer
      </button>
    </form>
  );
}

"use client";

import { deleteNotificationAction } from "@/lib/admin/notification-actions";
import { ConfirmActionButton } from "@/components/ui/ConfirmActionButton";

export function DeleteNotificationButton({
  notificationId,
  title,
}: {
  notificationId: string;
  title: string;
}) {
  return (
    <ConfirmActionButton
      action={deleteNotificationAction}
      fields={{ notificationId }}
      triggerLabel="Supprimer"
      title={`Supprimer la notification « ${title} » ?`}
      description="Elle ne sera plus visible par les membres qui ne l'ont pas encore lue. Cette action est irréversible."
      confirmLabel="Supprimer définitivement"
    />
  );
}

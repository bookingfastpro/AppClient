"use client";

import { deleteVideoAction } from "@/lib/admin/actions";
import { ConfirmActionButton } from "@/components/ui/ConfirmActionButton";

export function DeleteVideoButton({ videoId, title }: { videoId: string; title: string }) {
  return (
    <ConfirmActionButton
      action={deleteVideoAction}
      fields={{ videoId }}
      triggerLabel="Supprimer"
      title={`Supprimer « ${title} » ?`}
      description="La séance disparaîtra de l'application, des favoris et des programmes qui l'utilisent. Cette action est irréversible."
      confirmLabel="Supprimer définitivement"
    />
  );
}

"use client";

import { deleteVideoAction } from "@/lib/admin/actions";

export function DeleteVideoButton({ videoId, title }: { videoId: string; title: string }) {
  return (
    <form
      action={deleteVideoAction}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer « ${title} » ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="videoId" value={videoId} />
      <button
        type="submit"
        className="rounded-pill px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/10"
      >
        Supprimer
      </button>
    </form>
  );
}

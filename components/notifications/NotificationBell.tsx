"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { markNotificationReadAction } from "@/lib/notifications/actions";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
};

export function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read).map((n) => n.id)),
  );
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function markRead(id: string) {
    if (readIds.has(id)) return;
    setReadIds((prev) => new Set(prev).add(id));
    startTransition(async () => {
      await markNotificationReadAction(id);
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} non lues` : "Notifications"}
        aria-expanded={open}
        className="relative flex size-11 items-center justify-center rounded-pill text-ink-600 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-sand active:scale-95"
      >
        <Bell className="size-5" aria-hidden />
        {unreadCount > 0 && (
          <span
            className="absolute right-2 top-2 flex size-2.5 items-center justify-center rounded-pill bg-sage-600 ring-2 ring-surface"
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div className="animate-fade-in-up absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-beige/70 bg-surface/95 shadow-[var(--shadow-ambient-lg)] backdrop-blur-xl">
          <div className="border-b border-beige/60 px-4 py-3">
            <p className="text-title text-ink-900">Notifications</p>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-600">
              Aucune notification pour le moment.
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const isRead = readIds.has(n.id);
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex w-full flex-col gap-0.5 border-b border-beige/40 px-4 py-3 text-left transition-colors duration-150 ease-[var(--ease-standard)] last:border-b-0 hover:bg-sand/60",
                        !isRead && "bg-sage-50/60",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {!isRead && (
                          <span className="size-1.5 shrink-0 rounded-pill bg-sage-600" aria-hidden />
                        )}
                        <span className="text-sm font-semibold text-ink-900">{n.title}</span>
                      </span>
                      <span className="text-sm text-ink-600">{n.body}</span>
                      <span className="text-label text-ink-300">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

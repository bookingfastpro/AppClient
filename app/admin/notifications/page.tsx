import { BellOff } from "lucide-react";
import { getAllNotificationsForAdmin } from "@/lib/admin/queries";
import { formatRelativeTime } from "@/lib/utils";
import { NotificationForm } from "@/components/admin/NotificationForm";
import { DeleteNotificationButton } from "@/components/admin/DeleteNotificationButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminNotificationsPage() {
  const notifications = await getAllNotificationsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up flex flex-col gap-4">
        <h1 className="text-headline text-ink-900">Notifications</h1>
        <NotificationForm />
      </div>

      <div className="animate-fade-in-up flex flex-col gap-2 [animation-delay:80ms]">
        <h2 className="text-title text-ink-900">Envoyées</h2>
        {notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="Aucune notification envoyée"
            description="Les annonces que vous publierez apparaîtront ici."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex flex-wrap items-start gap-3 rounded-md border border-beige bg-surface p-3 transition-colors duration-150 ease-[var(--ease-standard)] hover:border-ink-300/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{notification.body}</p>
                  <p className="text-label mt-1 text-ink-600">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>
                <div className="flex w-full justify-end sm:w-auto">
                  <DeleteNotificationButton
                    notificationId={notification.id}
                    title={notification.title}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

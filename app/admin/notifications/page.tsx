import { getAllNotificationsForAdmin } from "@/lib/admin/queries";
import { formatRelativeTime } from "@/lib/utils";
import { NotificationForm } from "@/components/admin/NotificationForm";
import { DeleteNotificationButton } from "@/components/admin/DeleteNotificationButton";

export default async function AdminNotificationsPage() {
  const notifications = await getAllNotificationsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-headline text-ink-900">Notifications</h1>
        <NotificationForm />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-title text-ink-900">Envoyées</h2>
        {notifications.length === 0 ? (
          <p className="text-body text-ink-600">Aucune notification envoyée pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-start gap-4 rounded-md border border-beige bg-surface p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{notification.body}</p>
                  <p className="text-label mt-1 text-ink-300">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>
                <DeleteNotificationButton
                  notificationId={notification.id}
                  title={notification.title}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

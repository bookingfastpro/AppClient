import Link from "next/link";
import { DesktopNav } from "./DesktopNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getUser } from "@/lib/auth/session";
import { getNotificationsWithReadState } from "@/lib/db/queries";

export async function TopHeader() {
  const user = await getUser();
  const notifications = user ? await getNotificationsWithReadState(user.id) : [];

  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-beige/60 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/home" className="font-display text-2xl font-semibold text-forest-800">
          Yogella
        </Link>
        <div className="flex items-center gap-2">
          <DesktopNav />
          {user && <NotificationBell notifications={notifications} />}
        </div>
      </div>
    </header>
  );
}

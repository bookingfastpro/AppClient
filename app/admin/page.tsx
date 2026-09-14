import Link from "next/link";
import { Bell, ShieldCheck, Users, Video } from "lucide-react";
import { getAdminDashboardStats } from "@/lib/admin/queries";

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-beige bg-surface p-5 transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient-low)] active:translate-y-0 active:scale-[0.98]"
    >
      <span className="flex size-10 items-center justify-center rounded-pill bg-sage-100 text-sage-600 transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-display text-3xl text-ink-900">{value}</p>
        <p className="text-sm text-ink-600">{label}</p>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up">
        <h1 className="text-headline text-ink-900">Tableau de bord</h1>
        <p className="text-body mt-1 text-ink-600">Vue d&apos;ensemble de Yogella.</p>
      </div>

      <div className="animate-fade-in-up grid grid-cols-2 gap-4 [animation-delay:80ms] lg:grid-cols-4">
        <StatCard icon={Users} label="Utilisateurs" value={stats.totalUsers} href="/admin/users" />
        <StatCard
          icon={ShieldCheck}
          label="Abonnés actifs"
          value={stats.activeSubscribers}
          href="/admin/users"
        />
        <StatCard
          icon={Video}
          label={`Vidéos (${stats.premiumVideos} premium)`}
          value={stats.totalVideos}
          href="/admin/videos"
        />
        <StatCard
          icon={Bell}
          label="Notifications envoyées"
          value={stats.notificationsSent}
          href="/admin/notifications"
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVE_STATUSES } from "@/lib/access/subscription";
import { UpgradeCard } from "@/components/billing/UpgradeCard";
import { ManageBillingButton } from "@/components/billing/ManageBillingButton";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

function statusLabel(status: string | null) {
  if (!status) return "Aucun abonnement actif";
  const active = (ACTIVE_STATUSES as readonly string[]).includes(status);
  if (active) return "Abonnement actif";
  if (status === "past_due") return "Paiement à régulariser";
  if (status === "canceled") return "Abonnement résilié";
  return "Aucun abonnement actif";
}

function getInitials(name: string | undefined, email: string) {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return email[0]?.toUpperCase() ?? "?";
}

export default async function AccountPage() {
  const user = await requireUser();
  const admin = createAdminClient();
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("status, cancel_at_period_end, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const isActive = subscription
    ? (ACTIVE_STATUSES as readonly string[]).includes(subscription.status)
    : false;
  const fullName = user.user_metadata?.full_name as string | undefined;
  const isAdmin = user.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase().trim();

  return (
    <div className="animate-fade-in-up flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-pill bg-sage-100 text-xl font-semibold text-sage-700">
          {getInitials(fullName, user.email ?? "")}
        </div>
        <div className="min-w-0">
          <h1 className="text-headline truncate text-ink-900">{fullName || "Votre profil"}</h1>
          <p className="text-body truncate text-ink-600">{user.email}</p>
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-beige bg-surface p-6 transition-shadow duration-200 ease-[var(--ease-standard)] hover:shadow-[var(--shadow-ambient-low)]">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-pill",
              isActive ? "bg-sage-100 text-sage-600" : "bg-sand text-ink-600",
            )}
          >
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-title text-ink-900">Abonnement</h2>
            <p className="text-sm text-ink-600">{statusLabel(subscription?.status ?? null)}</p>
          </div>
        </div>
        {isActive && subscription?.cancel_at_period_end && subscription.current_period_end && (
          <p className="text-sm text-ink-600">
            Se termine le {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
          </p>
        )}
        {isActive ? <ManageBillingButton /> : <UpgradeCard />}
      </section>

      <section className="flex flex-col overflow-hidden rounded-lg border border-beige bg-surface">
        {isAdmin && (
          <Link
            href="/admin/videos"
            className="flex items-center gap-3 border-b border-beige px-5 py-4 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-sand active:bg-sand"
          >
            <ShieldCheck className="size-5 shrink-0 text-ink-600" aria-hidden />
            <span className="flex-1 text-sm font-semibold text-ink-900">
              Panneau d&apos;administration
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
          </Link>
        )}
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-sand active:bg-sand"
          >
            <LogOut className="size-5 shrink-0 text-error" aria-hidden />
            <span className="flex-1 text-sm font-semibold text-error">Se déconnecter</span>
          </button>
        </form>
      </section>
    </div>
  );
}

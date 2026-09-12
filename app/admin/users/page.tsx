import { ExternalLink } from "lucide-react";
import { getAllUsersForAdmin } from "@/lib/admin/queries";
import { subscriptionStatusLabel, ACTIVE_STATUSES } from "@/lib/access/subscription";
import { grantManualAccessAction, revokeManualAccessAction } from "@/lib/admin/subscription-actions";
import { UserSearchInput } from "@/components/admin/UserSearchInput";
import { cn } from "@/lib/utils";

function getInitials(name: string | null, email: string) {
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const allUsers = await getAllUsersForAdmin();

  const query = q.trim().toLowerCase();
  const users = query
    ? allUsers.filter(
        (u) => u.email.toLowerCase().includes(query) || u.fullName?.toLowerCase().includes(query),
      )
    : allUsers;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline text-ink-900">Utilisateurs</h1>
        <p className="text-body text-ink-600">
          {allUsers.length} utilisateur{allUsers.length > 1 ? "s" : ""} au total
        </p>
      </div>

      <UserSearchInput defaultValue={q} />

      {users.length === 0 ? (
        <p className="text-body text-ink-600">Aucun utilisateur ne correspond à cette recherche.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-beige bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-beige text-label text-ink-300">
                <th className="px-4 py-3 font-semibold">Utilisateur</th>
                <th className="px-4 py-3 font-semibold">Inscrit le</th>
                <th className="px-4 py-3 font-semibold">Abonnement</th>
                <th className="px-4 py-3 font-semibold">Renouvellement</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isActive = u.subscription
                  ? (ACTIVE_STATUSES as readonly string[]).includes(u.subscription.status)
                  : false;
                const isManualActive = isActive && u.subscription?.isManual;
                const isRealActive = isActive && !u.subscription?.isManual;

                return (
                  <tr key={u.id} className="border-b border-beige/60 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-sage-100 text-xs font-semibold text-sage-700">
                          {getInitials(u.fullName, u.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {u.fullName || u.email}
                          </p>
                          {u.fullName && (
                            <p className="truncate text-xs text-ink-300">{u.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-600">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold",
                          isActive ? "bg-sage-100 text-sage-700" : "bg-sand text-ink-600",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-pill",
                            isActive ? "bg-sage-600" : "bg-ink-300",
                          )}
                          aria-hidden
                        />
                        {subscriptionStatusLabel(
                          u.subscription?.status ?? null,
                          u.subscription?.isManual,
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-600">
                      {u.subscription?.currentPeriodEnd
                        ? `${u.subscription.cancelAtPeriodEnd ? "Se termine le " : "Le "}${new Date(
                            u.subscription.currentPeriodEnd,
                          ).toLocaleDateString("fr-FR")}`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {isRealActive && u.subscription?.stripeCustomerId && (
                          <a
                            href={`https://dashboard.stripe.com/customers/${u.subscription.stripeCustomerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-sage-600 hover:text-sage-700"
                          >
                            Stripe
                            <ExternalLink className="size-3.5" aria-hidden />
                          </a>
                        )}
                        {isManualActive ? (
                          <form action={revokeManualAccessAction}>
                            <input type="hidden" name="userId" value={u.id} />
                            <button
                              type="submit"
                              className="text-sm font-semibold text-error hover:underline"
                            >
                              Retirer l&apos;accès
                            </button>
                          </form>
                        ) : (
                          !isRealActive && (
                            <form action={grantManualAccessAction}>
                              <input type="hidden" name="userId" value={u.id} />
                              <button
                                type="submit"
                                className="text-sm font-semibold text-sage-600 hover:text-sage-700 hover:underline"
                              >
                                Accorder l&apos;accès
                              </button>
                            </form>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

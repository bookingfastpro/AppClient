import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * The shared zero-data state. Every empty screen in the app routes
 * through this, for two reasons.
 *
 * First, a bare "Aucune séance." line is a dead end: it tells someone
 * what is missing without telling them what to do about it. An empty
 * screen is where a new member is most likely to leave, so it gets a
 * glyph to break the blankness, one line of guidance, and a way out.
 *
 * Second, consistency. When every empty state has the same shape,
 * running into one stops feeling like hitting a bug and starts feeling
 * like a part of the app someone hasn't filled in yet.
 *
 * `action` is optional but should be omitted only when there is
 * genuinely nothing the visitor can do — a category with no sessions
 * yet, say, where browsing elsewhere is still better than nothing.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-fade-in-up flex flex-col items-center gap-3 px-4 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-sand text-ink-600">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>

      <h2 className="text-title text-balance text-ink-900">{title}</h2>

      {description && (
        <p className="text-body max-w-xs text-balance text-ink-600">{description}</p>
      )}

      {action && (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-2")}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

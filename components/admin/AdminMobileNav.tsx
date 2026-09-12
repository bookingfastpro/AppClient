"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-beige/60 bg-cream/85 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="font-display text-base font-semibold text-ink-900">
          Administration
        </Link>
        <Link href="/home" className="text-xs font-semibold text-ink-600 hover:text-ink-900">
          Retour
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
        {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ease-[var(--ease-standard)]",
                active ? "bg-sage-600 text-cream" : "bg-sand text-ink-600",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

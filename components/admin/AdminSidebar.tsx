"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

export function AdminSidebar({ adminEmail }: { adminEmail: string | undefined }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-beige bg-cream md:flex">
      <div className="px-6 py-6">
        <Link href="/admin" className="font-display text-lg font-semibold text-ink-900">
          Administration
        </Link>
        {/* ink-600, not ink-300: this is text to be read, and ink-300
            measures 3.00:1 on cream (see the Readable-Ink Rule). */}
        {adminEmail && <p className="mt-0.5 truncate text-xs text-ink-600">{adminEmail}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ease-[var(--ease-standard)]",
                active ? "bg-sage-600 text-cream" : "text-ink-600 hover:bg-sand",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-beige px-3 py-4">
        <Link
          href="/home"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-ink-600 transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-sand"
        >
          <ArrowLeft className="size-[18px]" aria-hidden />
          Retour à l&apos;application
        </Link>
      </div>
    </aside>
  );
}

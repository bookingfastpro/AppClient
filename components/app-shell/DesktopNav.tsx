"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const { href, label, icon: Icon } = item;
        const active = isNavItemActive(pathname, item);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-[var(--ease-standard)] lg:gap-2 lg:px-4",
              active
                ? "bg-sage-600 text-cream shadow-[var(--shadow-ambient-low)]"
                : "text-ink-600 hover:bg-sand active:scale-95",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

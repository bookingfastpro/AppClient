"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

export function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-beige/70 bg-cream/95 backdrop-blur-xl md:hidden"
    >
      <div className="flex items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const { href, label, icon: Icon, solidWhenActive } = item;
          const active = isNavItemActive(pathname, item);
          const solid = active && solidWhenActive;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 pt-2.5 pb-2 font-sans text-[11px] font-medium tracking-tight transition-colors duration-200 ease-[var(--ease-standard)] active:scale-95 min-[360px]:text-[12px]",
                active ? "text-nav-active" : "text-ink-300",
              )}
            >
              <Icon
                className="size-[22px] shrink-0"
                strokeWidth={active ? 2 : 1.75}
                fill={solid ? "currentColor" : "none"}
                aria-hidden
              />
              <span className="w-full truncate text-center">{label}</span>
              {/* Matches the reference's short underline under the active tab. */}
              <span
                aria-hidden
                className={cn(
                  "h-0.5 w-6 rounded-pill transition-colors duration-200 ease-[var(--ease-standard)]",
                  active ? "bg-nav-active" : "bg-transparent",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

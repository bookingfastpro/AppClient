import { Flower2, Heart, Home, Search, User } from "lucide-react";

/**
 * `solidWhenActive` fills the glyph on the active tab, matching the solid
 * house in the design reference. Search is deliberately excluded: a
 * filled magnifier collapses into an unreadable blob.
 *
 * `alsoActiveOn` keeps a tab lit on routes it owns but does not link to
 * directly, so /search (reached from the Explorer search field) does not
 * leave the bar with nothing highlighted.
 */
export const NAV_ITEMS = [
  {
    href: "/home",
    label: "Accueil",
    icon: Home,
    solidWhenActive: true,
    // Programmes are reached from the home screen and have no tab of
    // their own; without this the bar goes dark on a programme page.
    alsoActiveOn: ["/programmes"],
  },
  {
    href: "/explore",
    label: "Explorer",
    icon: Search,
    solidWhenActive: false,
    alsoActiveOn: ["/search", "/categories", "/besoins"],
  },
  { href: "/practice", label: "Ma pratique", icon: Flower2, solidWhenActive: false },
  { href: "/favorites", label: "Favoris", icon: Heart, solidWhenActive: true },
  { href: "/account", label: "Profil", icon: User, solidWhenActive: true },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  icon: typeof Home;
  solidWhenActive: boolean;
  alsoActiveOn?: readonly string[];
}>;

export function isNavItemActive(
  pathname: string,
  item: (typeof NAV_ITEMS)[number],
): boolean {
  const prefixes = [item.href, ...("alsoActiveOn" in item ? item.alsoActiveOn : [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

import { Bell, CreditCard, LayoutDashboard, ListVideo, Users, Video } from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Vidéos", icon: Video },
  { href: "/admin/programs", label: "Programmes", icon: ListVideo },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/plan", label: "Abonnement", icon: CreditCard },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
] as const;

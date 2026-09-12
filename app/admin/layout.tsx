import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-svh bg-cream md:flex-row">
      <AdminSidebar adminEmail={user.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

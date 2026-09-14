import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

/**
 * `modal` is a parallel route slot (app/admin/@modal). It renders null
 * via its default.tsx until an intercepting route fills it — see
 * app/admin/@modal/(.)programs/[id]. It sits outside <main> because the
 * dialog it renders lives in the browser's top layer and must not be
 * constrained by the main column's width or padding.
 */
export default async function AdminLayout({ children, modal }: LayoutProps<"/admin">) {
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
      {modal}
    </div>
  );
}

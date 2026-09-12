import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <header className="sticky top-0 z-40 border-b border-beige/60 bg-cream/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="font-display text-2xl font-semibold text-forest-800">
            Yogella
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
              Tarifs
            </Link>
            <Link href="/sign-in" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
              Se connecter
            </Link>
            <Link href="/sign-up" className={buttonVariants({ variant: "primary", size: "sm" })}>
              Rejoindre
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-beige px-4 py-8 text-sm text-ink-600 md:px-8">
        <p>&copy; {new Date().getFullYear()} Yogella. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

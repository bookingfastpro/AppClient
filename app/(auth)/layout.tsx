import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-forest-900 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(52% 0.08 152 / 0.55), transparent), radial-gradient(ellipse 60% 50% at 90% 110%, oklch(62% 0.13 40 / 0.18), transparent)",
        }}
      />
      <Link
        href="/"
        className="relative z-10 mb-8 font-display text-2xl font-semibold text-cream"
      >
        Yogella
      </Link>
      <div className="animate-fade-in-up relative z-10 w-full max-w-md rounded-xl border border-cream/10 bg-surface/95 p-8 shadow-[var(--shadow-ambient-lg)] backdrop-blur-xl sm:p-10">
        {children}
      </div>
    </div>
  );
}

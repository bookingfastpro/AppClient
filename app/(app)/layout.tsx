import type { ReactNode } from "react";
import { TopHeader } from "@/components/app-shell/TopHeader";
import { BottomTabNav } from "@/components/app-shell/BottomTabNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
        {children}
      </main>
      <BottomTabNav />
    </div>
  );
}

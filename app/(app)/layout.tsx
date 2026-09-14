import { TopHeader } from "@/components/app-shell/TopHeader";
import { BottomTabNav } from "@/components/app-shell/BottomTabNav";

/**
 * `modal` is a parallel route slot (app/(app)/@modal). It renders null
 * via its default.tsx until an intercepting route fills it — see
 * app/(app)/@modal/(.)programmes/[slug]. It sits outside <main> because
 * the dialog lives in the browser's top layer and must not inherit the
 * main column's width or padding.
 */
export default function AppLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
        {children}
      </main>
      <BottomTabNav />
      {modal}
    </div>
  );
}

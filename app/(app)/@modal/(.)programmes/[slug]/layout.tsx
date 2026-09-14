import type { ReactNode } from "react";
import { RouteModal } from "@/components/ui/RouteModal";

/**
 * Holds the dialog shell so it survives the swap from loading state to
 * content.
 *
 * If `loading.tsx` and `page.tsx` each rendered their own `<RouteModal>`,
 * React would treat them as two different trees: the first dialog would
 * unmount and the second mount, closing and reopening the modal in front
 * of the viewer. Putting the shell in a layout keeps one dialog for the
 * whole navigation, with only its contents changing underneath.
 *
 * The accessible name is generic here because the layout renders before
 * the programme is fetched. The real name follows immediately in the
 * content's own <h1>, which is why the dialog's copy stays hidden.
 */
export default function InterceptedProgramLayout({ children }: { children: ReactNode }) {
  return (
    <RouteModal title="Programme" hideTitle className="sm:max-w-lg" bodyClassName="px-0 pt-0">
      {children}
    </RouteModal>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";

/**
 * Bridges an intercepted route to the Modal component.
 *
 * A route-driven modal is always open — its presence in the tree *is*
 * the open state — so closing means going back rather than flipping a
 * flag. `router.back()` unwinds the history entry the intercepting
 * navigation pushed, which restores the underlying URL and lets the
 * browser's own back gesture close the modal too.
 *
 * Only the shell is a Client Component. Whatever is passed as children
 * stays a Server Component, so the forms and data fetching inside are
 * untouched.
 */
export function RouteModal({
  title,
  hideTitle,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  hideTitle?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Modal
      open
      onClose={() => router.back()}
      title={title}
      hideTitle={hideTitle}
      className={className}
      bodyClassName={bodyClassName}
    >
      {children}
    </Modal>
  );
}

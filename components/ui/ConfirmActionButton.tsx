"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

/**
 * Lives inside the <form> so `useFormStatus` can see it. While the
 * server action runs the button shows a spinner instead of freezing,
 * and both buttons disable so the row can't be deleted twice by an
 * impatient double-click.
 */
function ConfirmSubmit({ label, onCancel }: { label: string; onCancel: () => void }) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
        Annuler
      </Button>
      <Button type="submit" variant="danger" size="sm" loading={pending}>
        {label}
      </Button>
    </>
  );
}

/**
 * Replaces `window.confirm` for destructive actions.
 *
 * The native dialog was doing the job, but it drops the user out of the
 * app into an OS-chrome alert that can't be styled, can't be animated,
 * and on some mobile browsers renders the message in a way that hides
 * which item is about to be deleted. It also gave no pending state, so a
 * slow delete looked like nothing had happened.
 *
 * The trade-off worth naming: without JavaScript this button no longer
 * does anything, whereas before the form would submit unconfirmed. For a
 * destructive action, doing nothing is the better failure.
 */
export function ConfirmActionButton({
  action,
  fields,
  triggerLabel,
  title,
  description,
  confirmLabel,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  /** Hidden inputs carried into the server action. */
  fields: Record<string, string>;
  triggerLabel: string;
  title: string;
  description?: string;
  confirmLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-pill px-4 py-2 text-sm font-semibold text-error transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-error/10 active:scale-95",
          className,
        )}
      >
        {triggerLabel}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
      >
        {/*
          Deliberately not closed on submit: the dialog stays up showing
          the spinner while the action runs, which is the whole point of
          the pending state. The successful path revalidates, the row
          disappears, and this component unmounts with it.
        */}
        <form
          action={action}
          className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        >
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <ConfirmSubmit label={confirmLabel} onCancel={() => setOpen(false)} />
        </form>
      </Modal>
    </>
  );
}

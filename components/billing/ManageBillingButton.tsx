import { createPortalSessionAction } from "@/lib/stripe/actions";
import { Button } from "@/components/ui/Button";

export function ManageBillingButton() {
  return (
    <form action={createPortalSessionAction}>
      <Button type="submit" variant="ghost">
        Gérer l&apos;abonnement
      </Button>
    </form>
  );
}

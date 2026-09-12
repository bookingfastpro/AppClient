"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * A reload rather than a router navigation: the App Router would try to
 * fetch an RSC payload over the connection that just failed, and the
 * service worker deliberately does not cache those. Reloading re-runs
 * the navigation request, which is the one thing that can actually
 * recover once the network is back.
 */
export function RetryButton() {
  return (
    <Button onClick={() => window.location.reload()}>
      <RotateCw className="size-4" aria-hidden />
      Réessayer
    </Button>
  );
}

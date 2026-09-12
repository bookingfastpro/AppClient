"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js. Renders nothing; it exists only so the root layout
 * can stay a Server Component.
 *
 * Production only. In development Next serves uncached, freshly compiled
 * chunks on every request, and a worker holding /_next/static in a
 * cache-first rule would shadow them — the classic "my edit doesn't show
 * up until I clear site data" loop.
 *
 * Registration is deferred to the load event so it never competes for
 * bandwidth with the first paint.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        // Never fatal: the app works fine without a worker, it just
        // loses the offline fallback and the asset cache.
        console.error("Échec de l'enregistrement du service worker", error);
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}

/*
 * Yogella service worker.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: never cache a response that can
 * differ between users. Yogella is a cookie-authenticated app, and a
 * cached HTML document or RSC payload is the classic way a service
 * worker serves one member's account page to the next person who opens
 * the app on a shared device.
 *
 * So this is an allowlist, not a denylist. Requests are passed straight
 * through to the network untouched unless they match a rule below, and
 * the only rules that exist cover content-addressed build output and
 * static images. Adding a rule that matches a document, an RSC payload,
 * or anything under /api/ is a security bug, not a performance tweak.
 *
 * The single exception is navigation: those are always fetched from the
 * network, and the precached offline page is served only when that fetch
 * throws. A failed network request cannot leak another user's data.
 */

// Bump on every change to the caching rules below. The activate handler
// deletes every cache that is not in CURRENT_CACHES, so a bumped version
// evicts the previous generation wholesale instead of leaving stale
// entries behind under the old name.
const VERSION = "v1";
const ASSET_CACHE = `yogella-assets-${VERSION}`;
const SHELL_CACHE = `yogella-shell-${VERSION}`;
const CURRENT_CACHES = [ASSET_CACHE, SHELL_CACHE];

const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individually, not cache.addAll: addAll is atomic, so one failed
      // entry aborts the whole install and the worker never activates.
      // A missing icon should not cost us the offline page.
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/**
 * Next's build output under /_next/static is content-hashed: a given URL
 * never changes meaning, so it can be served from cache indefinitely
 * without a revalidation round trip.
 */
function isImmutableBuildAsset(url) {
  return url.pathname.startsWith("/_next/static/");
}

/**
 * Static images we ship ourselves. Unlike the build output these keep
 * their filename across deploys, so they are revalidated in the
 * background rather than trusted forever.
 */
function isStaticImage(url) {
  return (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/univers/") ||
    /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    // Offline with nothing cached: let the caller's `?? network` reject
    // so the browser renders its own broken-image state.
    .catch(() => undefined);

  return cached ?? (await network) ?? fetch(request);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GET is ever cacheable, and a POST here would be a Server Action.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cross-origin: YouTube, Supabase Storage, anything else. Not ours to
  // cache, and opaque responses would silently bloat the quota.
  if (url.origin !== self.location.origin) return;

  // Route handlers can read the session cookie. Never cached.
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cached = await caches.match(OFFLINE_URL);
          // Without a precached page there is nothing useful to show, so
          // fall through to the browser's own offline error.
          return cached ?? Response.error();
        }
      })(),
    );
    return;
  }

  if (isImmutableBuildAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (isStaticImage(url)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }

  // Everything else — RSC payloads above all — goes to the network
  // untouched. This is the default, and it is the safe one.
});

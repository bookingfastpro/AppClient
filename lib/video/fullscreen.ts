/**
 * Cross-browser element fullscreen.
 *
 * The standard API is only half the story in practice:
 *
 *  * Safari (macOS) still exposes the `webkit`-prefixed methods, and
 *    crucially fires `webkitfullscreenchange` rather than
 *    `fullscreenchange`. Listening only for the unprefixed event leaves
 *    the UI convinced it is never in fullscreen, so the button's icon
 *    never flips and pressing it again re-requests fullscreen instead of
 *    leaving it.
 *  * Safari on iPhone has no element fullscreen at all — only
 *    `<video>.webkitEnterFullscreen()`, which is unreachable inside a
 *    cross-origin YouTube iframe. There the button has to do something
 *    else entirely, which is why `supportsElementFullscreen` exists.
 */

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

/** The element currently in fullscreen, whichever spelling the browser uses. */
export function getFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

/**
 * Whether this browser can put an arbitrary element in fullscreen.
 * False on iPhone Safari, where callers should fall back to the
 * CSS-rotation landscape mode instead of offering a button that does
 * nothing.
 */
export function supportsElementFullscreen(element: HTMLElement | null): boolean {
  if (!element) return false;
  const candidate = element as FullscreenElement;
  return (
    typeof element.requestFullscreen === "function" ||
    typeof candidate.webkitRequestFullscreen === "function"
  );
}

export async function requestFullscreen(element: HTMLElement): Promise<void> {
  const candidate = element as FullscreenElement;
  if (typeof element.requestFullscreen === "function") {
    await element.requestFullscreen();
    return;
  }
  if (typeof candidate.webkitRequestFullscreen === "function") {
    await candidate.webkitRequestFullscreen();
    return;
  }
  throw new Error("Fullscreen is not supported on this element");
}

export async function exitFullscreen(): Promise<void> {
  const doc = document as FullscreenDocument;
  if (typeof document.exitFullscreen === "function") {
    await document.exitFullscreen();
    return;
  }
  if (typeof doc.webkitExitFullscreen === "function") {
    await doc.webkitExitFullscreen();
  }
}

/** Subscribes to both spellings of the change event. Returns an unsubscribe. */
export function onFullscreenChange(handler: () => void): () => void {
  document.addEventListener("fullscreenchange", handler);
  document.addEventListener("webkitfullscreenchange", handler);
  return () => {
    document.removeEventListener("fullscreenchange", handler);
    document.removeEventListener("webkitfullscreenchange", handler);
  };
}

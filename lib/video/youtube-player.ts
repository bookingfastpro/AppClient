/**
 * Minimal surface of the YouTube IFrame Player API actually used by
 * YoutubePlayer. The full API has no official npm types; this covers
 * only what's called so a bad property name fails type-check instead of
 * silently no-oping at runtime.
 *
 * Playback controls (mute, volume, pause) are no longer listed: with
 * YouTube's own controls on screen those are the player's business, and
 * what we still drive from outside is limited to resuming at a position
 * and reading progress.
 */
export interface YTPlayer {
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
}

export const YT_PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
} as const;

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YTPlayer }) => void;
        onStateChange: (event: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Lazily injects the YouTube IFrame Player API script exactly once per page and resolves once window.YT is ready. */
export function loadYoutubeIframeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiPromise;
}

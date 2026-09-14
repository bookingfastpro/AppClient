"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { loadYoutubeIframeApi, YT_PLAYER_STATE, type YTPlayer } from "@/lib/video/youtube-player";
import { recordWatchProgressAction } from "@/lib/video/watch-actions";

/**
 * The YouTube player, with YouTube's own controls.
 *
 * This replaced a hand-built control bar, and the reason is fullscreen.
 * Safari on iPhone grants fullscreen to native <video> elements only,
 * and the embed's video lives inside a cross-origin iframe — so no
 * control we draw outside that iframe can ever reach it. YouTube's own
 * button is inside, which is why it works where ours could not. Chasing
 * that with CSS rotation tricks produced a landscape mode that merely
 * looked like fullscreen; handing the job back to YouTube produces the
 * real thing, on every platform, for free.
 *
 * What stays ours is the part YouTube knows nothing about: resuming at
 * the saved position, and reporting watch progress so /practice and the
 * "reprends là où tu t'étais arrêtée" card keep working. Those ride on
 * the IFrame API, which is unaffected by whose controls are on screen.
 */
export function YoutubePlayer({
  youtubeId,
  title,
  videoId,
  startAt = 0,
}: {
  youtubeId: string;
  title: string;
  videoId?: string;
  startAt?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const positionTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeIframeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;

      playerRef.current = new YT.Player(hostRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          // YouTube's controls, including the fullscreen button (fs).
          controls: 1,
          fs: 1,
          // playsinline so the video starts in the page rather than
          // taking over the screen on iPhone; fullscreen stays one tap
          // away instead of being forced.
          playsinline: 1,
          // Keeps end-screen suggestions to this channel rather than
          // offering the whole of YouTube at the end of a session.
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setReady(true);

            // The API sets the legacy `allowfullscreen` attribute but
            // leaves `fullscreen` out of `allow`. Browsers honour the
            // legacy form today; adding the modern one costs nothing and
            // removes the question.
            const iframe = event.target.getIframe();
            const allow = iframe.getAttribute("allow") ?? "";
            if (!allow.includes("fullscreen")) {
              iframe.setAttribute("allow", allow ? `${allow}; fullscreen` : "fullscreen");
            }
            iframe.setAttribute("allowfullscreen", "");

            if (startAt > 0) event.target.seekTo(startAt, true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (cancelled) return;
            setPlaying(event.data === YT_PLAYER_STATE.PLAYING);
            if (event.data === YT_PLAYER_STATE.PLAYING) {
              durationRef.current = event.target.getDuration();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeId, startAt]);

  // Samples the position while playing. Cheap, and it is what the
  // reporter below reads — asking the player inside the report would
  // miss the last position when the component is already tearing down.
  useEffect(() => {
    if (!playing) return;
    positionTimer.current = setInterval(() => {
      if (playerRef.current) currentTimeRef.current = playerRef.current.getCurrentTime();
    }, 1000);
    return () => {
      if (positionTimer.current) clearInterval(positionTimer.current);
    };
  }, [playing]);

  // Reports every 10s while playing, and flushes once more when playback
  // stops or the page is left, so quitting mid-session still records
  // where to resume from.
  useEffect(() => {
    if (!videoId || !playing) return;
    const report = () => {
      if (currentTimeRef.current > 0) {
        void recordWatchProgressAction(videoId, currentTimeRef.current, durationRef.current);
      }
    };
    const id = setInterval(report, 10000);
    return () => {
      clearInterval(id);
      report();
    };
  }, [playing, videoId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-forest-900 md:rounded-lg">
      <div ref={hostRef} className="size-full" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-forest-900">
          <Loader2 className="size-8 animate-spin text-cream/70" aria-hidden />
          <span className="sr-only">Chargement de {title}</span>
        </div>
      )}
    </div>
  );
}

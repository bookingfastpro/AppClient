"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Maximize, Minimize, Pause, Play, RotateCw, Volume2, VolumeX, X } from "lucide-react";
import { loadYoutubeIframeApi, YT_PLAYER_STATE, type YTPlayer } from "@/lib/video/youtube-player";
import { recordWatchProgressAction } from "@/lib/video/watch-actions";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Renders the YouTube stream through the IFrame Player API with native
 * controls disabled (controls=0) so every control the viewer sees is ours,
 * not YouTube's chrome. A separate "rotate" control forces a landscape
 * viewing mode independent of native fullscreen: Screen Orientation lock
 * only works on Android Chrome and only once fullscreen is active, so an
 * additional CSS rotation fallback (rotated-player class) is what makes
 * "pivoter" actually work on iOS Safari too.
 */
export function CustomVideoPlayer({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrubbingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playingRef.current) setShowControls(false);
    }, 2800);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeIframeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;

      playerRef.current = new YT.Player(hostRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          cc_load_policy: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setReady(true);
            setDuration(event.target.getDuration());
            if (startAt > 0) {
              event.target.seekTo(startAt, true);
              setCurrentTime(startAt);
            }
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (cancelled) return;
            setPlaying(event.data === YT_PLAYER_STATE.PLAYING);
            setBuffering(event.data === YT_PLAYER_STATE.BUFFERING);
            if (event.data === YT_PLAYER_STATE.PLAYING) {
              setDuration(event.target.getDuration());
              revealControls();
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
  }, [youtubeId, startAt, revealControls]);

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  useEffect(() => {
    currentTimeRef.current = currentTime;
    durationRef.current = duration;
  }, [currentTime, duration]);

  // Reports watch position every 10s while playing, and flushes a final
  // position when playback pauses or the player unmounts, so leaving
  // mid-session still records where to resume from.
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

  useEffect(() => {
    if (!playing) return;
    progressTimer.current = setInterval(() => {
      if (!scrubbingRef.current && playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 250);
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isRotated) exitRotatedMode();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isRotated]);

  function togglePlay() {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
    revealControls();
  }

  function toggleMute() {
    if (!playerRef.current) return;
    if (muted || playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  }

  function handleVolumeChange(next: number) {
    setVolume(next);
    playerRef.current?.setVolume(next);
    if (next === 0) {
      playerRef.current?.mute();
      setMuted(true);
    } else if (muted) {
      playerRef.current?.unMute();
      setMuted(false);
    }
  }

  function handleSeek(next: number) {
    setCurrentTime(next);
    playerRef.current?.seekTo(next, true);
  }

  async function enterFullscreen() {
    if (!containerRef.current) return;
    try {
      await containerRef.current.requestFullscreen();
    } catch {
      // Fullscreen can be denied (e.g. iframe restrictions); the CSS
      // rotation fallback below still makes landscape viewing work.
    }
  }

  async function toggleRotate() {
    if (isRotated) {
      exitRotatedMode();
      return;
    }
    setIsRotated(true);
    await withTimeout(enterFullscreen(), 1500);
    try {
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (o: string) => Promise<void>;
      };
      await withTimeout(orientation.lock?.("landscape") ?? Promise.resolve(), 1500);
    } catch {
      // Orientation lock isn't supported everywhere (notably iOS Safari) —
      // the CSS transform on .rotated-player is what carries those cases.
    }
  }

  function exitRotatedMode() {
    setIsRotated(false);
    try {
      const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
      orientation.unlock?.();
    } catch {
      // no-op: nothing to unlock if it was never locked
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  /** Races a promise against a timeout so a slow or hung permission prompt (e.g. fullscreen on some mobile browsers) can never block the CSS rotation fallback. */
  function withTimeout(promise: Promise<unknown>, ms: number) {
    return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
  }

  function toggleFullscreen() {
    if (isFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else {
      enterFullscreen();
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-lg bg-forest-900",
        isRotated && "rotated-player",
      )}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <div ref={hostRef} className="size-full" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-forest-900">
          <Loader2 className="size-8 animate-spin text-cream/70" aria-hidden />
        </div>
      )}

      {ready && buffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-cream/70" aria-hidden />
        </div>
      )}

      {/* Transparent tap target over the video: toggles controls visibility and play/pause, since the native YouTube layer beneath has controls disabled but still swallows clicks. */}
      <button
        type="button"
        aria-label={playing ? "Mettre en pause" : "Lire"}
        onClick={togglePlay}
        className="absolute inset-0 size-full cursor-pointer"
      />

      {isRotated && (
        <button
          type="button"
          onClick={exitRotatedMode}
          aria-label="Quitter le mode paysage"
          className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-pill bg-forest-900/60 text-cream backdrop-blur-sm transition-opacity duration-200 ease-[var(--ease-standard)]"
          style={{ opacity: showControls ? 1 : 0 }}
        >
          <X className="size-5" aria-hidden />
        </button>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-forest-900/85 via-forest-900/40 to-transparent px-3 pt-10 pb-3 shadow-[var(--shadow-ambient-lg)] transition-opacity duration-200 ease-[var(--ease-standard)]",
          showControls ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onPointerDown={() => {
            scrubbingRef.current = true;
          }}
          onPointerUp={() => {
            scrubbingRef.current = false;
          }}
          onChange={(e) => handleSeek(Number(e.target.value))}
          aria-label="Progression de la vidéo"
          className="h-1.5 w-full cursor-pointer accent-sage-500"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Mettre en pause" : "Lire"}
            className="flex size-11 shrink-0 items-center justify-center rounded-pill text-cream transition-transform duration-150 ease-[var(--ease-standard)] hover:scale-105"
          >
            {playing ? (
              <Pause className="size-6" aria-hidden fill="currentColor" />
            ) : (
              <Play className="size-6 translate-x-0.5" aria-hidden fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted || volume === 0 ? "Activer le son" : "Couper le son"}
            className="flex size-11 shrink-0 items-center justify-center rounded-pill text-cream"
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-5" aria-hidden />
            ) : (
              <Volume2 className="size-5" aria-hidden />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={muted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            aria-label="Volume"
            className="h-1.5 w-16 cursor-pointer accent-sage-500 max-sm:hidden"
          />

          <span className="text-label text-cream/80 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          <button
            type="button"
            onClick={toggleRotate}
            aria-label={isRotated ? "Quitter le mode paysage" : "Pivoter en mode paysage"}
            aria-pressed={isRotated}
            className="flex size-11 shrink-0 items-center justify-center rounded-pill text-cream"
          >
            <RotateCw className="size-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            className="flex size-11 shrink-0 items-center justify-center rounded-pill text-cream"
          >
            {isFullscreen ? (
              <Minimize className="size-5" aria-hidden />
            ) : (
              <Maximize className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <p className="sr-only">{title}</p>
    </div>
  );
}

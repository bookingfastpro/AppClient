"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Maximize, Minimize, Pause, Play, RotateCw, Volume2, VolumeX, X } from "lucide-react";
import { loadYoutubeIframeApi, YT_PLAYER_STATE, type YTPlayer } from "@/lib/video/youtube-player";
import { recordWatchProgressAction } from "@/lib/video/watch-actions";
import { youtubeThumbnailUrl } from "@/lib/video/youtube";
import {
  exitFullscreen,
  getFullscreenElement,
  onFullscreenChange,
  requestFullscreen,
  supportsElementFullscreen,
} from "@/lib/video/fullscreen";
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
  /*
    Playback has actually begun at least once. Until it has, an opaque
    poster covers the iframe — see the overlay near the bottom of this
    file for why that matters.
  */
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(true);
  /*
    Whether the device is physically portrait. The landscape mode only
    needs its 90deg rotation while it is — once the phone is actually
    turned sideways the browser has rotated the page already, and
    rotating again would lay the video back on its side.
  */
  const [isPortrait, setIsPortrait] = useState(true);

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
            setHasEnded(event.data === YT_PLAYER_STATE.ENDED);
            if (event.data === YT_PLAYER_STATE.PLAYING) {
              setHasStarted(true);
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
    // Both spellings: Safari fires webkitfullscreenchange, and listening
    // only for the unprefixed event left this state permanently false —
    // the icon never flipped and a second press re-requested fullscreen
    // instead of leaving it.
    return onFullscreenChange(() => {
      setIsFullscreen(getFullscreenElement() === containerRef.current);
    });
  }, []);

  // iPhone Safari has no element fullscreen, so the button there has to
  // mean something else. Checked after mount because it depends on the
  // real element.
  useEffect(() => {
    setCanFullscreen(supportsElementFullscreen(containerRef.current));
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(orientation: portrait)");
    const sync = () => setIsPortrait(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /*
    Locks the page behind the landscape player. Without it the document
    still scrolls under a fixed overlay, which on a phone reads as the
    video sliding around while you try to touch the controls.
  */
  useEffect(() => {
    if (!isRotated) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isRotated]);

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

  /**
   * Tapping the video surface while the controls are hidden only brings
   * them back; it takes a second tap to pause.
   *
   * Without this the control bar is a moving target: it fades out after
   * a few seconds, so a tap aimed at fullscreen or the scrubber lands on
   * the full-size play/pause layer underneath and pauses the video
   * instead. Reveal-then-act is what every native player does, and it is
   * the difference between controls that work and controls you have to
   * race.
   */
  function handleSurfaceTap() {
    if (!showControls) {
      revealControls();
      return;
    }
    togglePlay();
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

  function skip(seconds: number) {
    if (!playerRef.current) return;
    const target = Math.min(
      Math.max(playerRef.current.getCurrentTime() + seconds, 0),
      durationRef.current || Infinity,
    );
    handleSeek(target);
    revealControls();
  }

  /**
   * Scoped to the player rather than the document: a global listener
   * would swallow the space bar while someone is typing elsewhere on the
   * page. YouTube's own keyboard handling is off (disablekb=1), so these
   * are the only shortcuts in play.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // The range inputs use arrows and space themselves; don't double-handle.
    if ((event.target as HTMLElement).tagName === "INPUT") return;

    switch (event.key) {
      case " ":
      case "k":
        event.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        event.preventDefault();
        skip(-10);
        break;
      case "ArrowRight":
        event.preventDefault();
        skip(10);
        break;
      case "f":
        event.preventDefault();
        void toggleFullscreen();
        break;
      case "m":
        event.preventDefault();
        toggleMute();
        break;
      default:
        break;
    }
  }

  /** Resolves true when the browser actually entered fullscreen. */
  async function enterFullscreen(): Promise<boolean> {
    if (!containerRef.current) return false;
    try {
      await requestFullscreen(containerRef.current);
      return true;
    } catch {
      // Denied by a permissions policy, an embedding frame, or the
      // platform. The caller decides what to do instead.
      return false;
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
    if (getFullscreenElement()) void exitFullscreen().catch(() => {});
  }

  /** Races a promise against a timeout so a slow or hung permission prompt (e.g. fullscreen on some mobile browsers) can never block the CSS rotation fallback. */
  function withTimeout(promise: Promise<unknown>, ms: number) {
    return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
  }

  /**
   * The button must always do something visible.
   *
   * Element fullscreen is refused in more situations than it is granted:
   * iPhone Safari has no such thing, an embedding frame without
   * `allow="fullscreen"` blocks it, and some permissions policies reject
   * it outright. Previously every one of those cases was swallowed by an
   * empty catch and the button appeared broken. Now a refusal falls
   * through to the CSS landscape mode, which needs no permission at all.
   */
  async function toggleFullscreen() {
    if (isRotated) {
      exitRotatedMode();
      return;
    }

    if (isFullscreen) {
      await exitFullscreen().catch(() => {});
      return;
    }

    if (canFullscreen && (await enterFullscreen())) return;

    await toggleRotate();
  }

  /** Starts playback from a fresh user gesture, which is what unblocks it. */
  function startPlayback() {
    playerRef.current?.playVideo();
    revealControls();
  }

  function replay() {
    playerRef.current?.seekTo(0, true);
    playerRef.current?.playVideo();
    setHasEnded(false);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-lg bg-forest-900",
        // The fill is unconditional in landscape mode; the rotation is
        // only added while the device itself is still portrait.
        isRotated && "landscape-player",
        isRotated && isPortrait && "rotated-player",
      )}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      onKeyDown={handleKeyDown}
      // Focusable so the shortcuts have somewhere to land, and labelled
      // so a screen reader announces what the region is.
      tabIndex={0}
      role="region"
      aria-label={`Lecteur vidéo : ${title}`}
    >
      {/*
        pointer-events-none so nothing the viewer does can reach
        YouTube's own layer — the "Regarder sur YouTube" button, the
        channel link, or any overlay YouTube adds later. Our transparent
        tap target below handles input instead.

        It has to live on this wrapper rather than on the host div:
        YT.Player *replaces* the element it is given with the iframe, so
        a class set on the host disappears along with the host. The
        wrapper survives, and the iframe inherits from it.
      */}
      <div className="pointer-events-none size-full">
        <div ref={hostRef} className="size-full" />
      </div>

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
        onClick={handleSurfaceTap}
        className="absolute inset-0 size-full cursor-pointer"
      />

      {/*
        The opaque poster. This is what actually hides the YouTube player.
        `controls=0` suppresses YouTube's chrome while playing and while
        paused, but NOT before playback has started: in that state the
        embed shows the video's title, the channel name, a large red
        YouTube button and a "Regarder sur YouTube" link.

        Autoplay is blocked by practically every mobile browser, so that
        is precisely the state a phone lands in. Covering it until the
        first PLAYING event means the YouTube player is never seen, and
        the tap that dismisses this poster is a fresh user gesture, which
        is what makes playVideo() succeed where the automatic call failed.
      */}
      {!hasStarted && (
        <button
          type="button"
          onClick={startPlayback}
          aria-label={`Lire ${title}`}
          className="group absolute inset-0 size-full cursor-pointer bg-forest-900 bg-cover bg-center"
          style={{ backgroundImage: `url(${youtubeThumbnailUrl(youtubeId)})` }}
        >
          <span className="absolute inset-0 bg-forest-900/45 transition-colors duration-200 ease-[var(--ease-standard)] group-hover:bg-forest-900/55" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-pill bg-cream/90 text-forest-900 shadow-[var(--shadow-ambient-md)] backdrop-blur-sm transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110 group-active:scale-95">
              {buffering ? (
                <Loader2 className="size-7 animate-spin" aria-hidden />
              ) : (
                <Play className="size-7 translate-x-0.5" aria-hidden fill="currentColor" />
              )}
            </span>
          </span>
        </button>
      )}

      {/* Same reasoning at the other end: once a video ends, the embed is
          free to show replay and related-video cards. */}
      {hasEnded && (
        <button
          type="button"
          onClick={replay}
          aria-label="Revoir la séance"
          className="group absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-3 bg-forest-900/90"
        >
          <span className="flex size-16 items-center justify-center rounded-pill bg-cream/90 text-forest-900 transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-110 group-active:scale-95">
            <RotateCw className="size-7" aria-hidden />
          </span>
          <span className="text-title text-cream">Revoir la séance</span>
        </button>
      )}

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
            onClick={() => void toggleFullscreen()}
            aria-label={
              isFullscreen || isRotated ? "Quitter le plein écran" : "Plein écran"
            }
            className="flex size-11 shrink-0 items-center justify-center rounded-pill text-cream transition-transform duration-150 ease-[var(--ease-standard)] hover:scale-105 active:scale-95"
          >
            {isFullscreen || isRotated ? (
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

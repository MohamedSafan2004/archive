"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Loader2, Play } from "lucide-react";
import type { VHSVideo } from "@/types";
import { EASE } from "@/lib/constants";
import { VHSControls } from "./VHSControls";

interface VHSPlayerProps {
  video: VHSVideo;
}

/**
 * VHS frame with a fullscreen toggle.
 *
 * PERFORMANCE NOTE — single <video> element, never remounted:
 * There is exactly ONE <video> element for the entire lifetime of this
 * component. It always lives inside a portal attached to document.body,
 * and we move it between "docked" (sitting inline over its placeholder)
 * and "fullscreen" (fixed, covering the viewport) purely via CSS. The
 * browser never re-requests the source, so playback position and
 * buffered data survive the transition perfectly.
 *
 * We portal to document.body rather than rendering the video directly in
 * the card because any ancestor with a CSS `transform` (Framer Motion
 * wrappers around this card) turns `position: fixed` into behaving like
 * `absolute` relative to that ancestor instead of the viewport.
 *
 * IMPORTANT — everything the person can see or click lives INSIDE the
 * portal now (video, play overlay, controls, labels). Previously the
 * controls were rendered in the small placeholder div instead, which sat
 * *underneath* the portaled video in the same screen position -- the
 * video visually covered the controls completely, making them
 * unreachable even though the code "had" them. There must only ever be
 * one visual layer here, and it must be the one the person can click.
 *
 * Playback never starts on its own -- the person presses play. Autoplay
 * (even muted) was tried and pulled: it made the video try to play before
 * enough of it had downloaded to actually start, which left the loading
 * spinner spinning indefinitely instead of ever reaching "playing". A
 * press-to-play model is simpler, cheaper on bandwidth (23 videos don't
 * all attempt playback as you scroll past them), and just as intentional
 * emotionally -- the person chooses to wake the memory up.
 */
export function VHSPlayer({ video }: VHSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Starts false: before the person presses play there is nothing to wait
  // for, so there is nothing to show a spinner about. It only turns on
  // once playback has actually been requested (see togglePlay) and the
  // browser is buffering mid-stream.
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasRequestedPlayRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [dockRect, setDockRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  // Keep the portaled video positioned exactly over the docked placeholder.
  useLayoutEffect(() => {
    if (isFullscreen) return;
    const el = dockRef.current;
    if (!el) return;

    function updateRect() {
      const r = el!.getBoundingClientRect();
      setDockRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }

    updateRect();
    window.addEventListener("scroll", updateRect, { passive: true, capture: true });
    window.addEventListener("resize", updateRect);
    const ro = new ResizeObserver(updateRect);
    ro.observe(el);

    return () => {
      window.removeEventListener("scroll", updateRect, { capture: true });
      window.removeEventListener("resize", updateRect);
      ro.disconnect();
    };
  }, [isFullscreen]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    function handleTimeUpdate() {
      if (!el!.duration) return;
      setProgress((el!.currentTime / el!.duration) * 100);
    }
    // Only show the spinner for buffering that happens once playback has
    // actually been requested. Before that, "waiting" can fire as a normal
    // side effect of the browser doing metadata/preload work -- showing a
    // spinner for that is misleading (nothing the person asked for is
    // stuck) and, worse, never resolves if nothing ever calls play().
    function handleWaiting() {
      if (hasRequestedPlayRef.current) setIsLoading(true);
    }
    function handlePlaying() {
      setIsLoading(false);
      setIsPlaying(true);
    }
    function handlePause() {
      setIsPlaying(false);
    }
    function handleCanPlay() {
      setIsLoading(false);
    }
    function handleError() {
      setIsLoading(false);
      setHasError(true);
    }

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("waiting", handleWaiting);
    el.addEventListener("playing", handlePlaying);
    el.addEventListener("pause", handlePause);
    el.addEventListener("canplay", handleCanPlay);
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("waiting", handleWaiting);
      el.removeEventListener("playing", handlePlaying);
      el.removeEventListener("pause", handlePause);
      el.removeEventListener("canplay", handleCanPlay);
      el.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFullscreen]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
    } else {
      hasRequestedPlayRef.current = true;
      // The browser may need to fetch more of the file before it can
      // actually start -- show the spinner right away rather than waiting
      // for a "waiting" event, so there's never a moment where nothing
      // seems to be happening after pressing play.
      if (el.readyState < 3) setIsLoading(true);
      setShowStatic(true);
      setTimeout(() => setShowStatic(false), 200);
      el.play().catch(() => {
        setIsLoading(false);
      });
    }
  }

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !isMuted;
    setIsMuted(!isMuted);
  }

  function seek(percent: number) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    el.currentTime = (percent / 100) * el.duration;
  }

  const controls = (
    <VHSControls
      isPlaying={isPlaying}
      isMuted={isMuted}
      progress={progress}
      isFullscreen={isFullscreen}
      onTogglePlay={togglePlay}
      onToggleMute={toggleMute}
      onSeek={seek}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
    />
  );

  const portalWrapperStyle: React.CSSProperties = isFullscreen
    ? { position: "fixed", inset: 0, zIndex: 100 }
    : dockRect
    ? {
        position: "fixed",
        top: dockRect.top,
        left: dockRect.left,
        width: dockRect.width,
        height: dockRect.height,
        zIndex: 1,
        borderRadius: "0.75rem",
        overflow: "hidden",
      }
    : { display: "none" };

  return (
    <>
      {/* Placeholder that reserves layout space in the flow and gives the
          portal something to measure. Purely structural now -- nothing
          here is meant to be seen or clicked; the portal (below) renders
          the video, the play button, and the controls, all in the exact
          same screen position, so there is only one clickable layer. */}
      <div
        ref={dockRef}
        className="vhs-scanlines relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60"
      />

      {mounted &&
        createPortal(
          <div style={portalWrapperStyle} className="pointer-events-none">
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE.smooth }}
                className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-10"
                onClick={() => setIsFullscreen(false)}
              >
                <button
                  data-cursor="hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                  }}
                  className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
                  aria-label="اغلاق"
                >
                  <X size={20} />
                </button>
              </motion.div>
            )}

            <div
              className={
                isFullscreen
                  ? "vhs-scanlines pointer-events-auto absolute left-1/2 top-1/2 aspect-video w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60 md:w-[calc(100%-5rem)]"
                  : "vhs-scanlines pointer-events-auto relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60"
              }
              onClick={(e) => isFullscreen && e.stopPropagation()}
            >
              <video
                ref={videoRef}
                src={video.src}
                poster={video.poster || undefined}
                className={
                  isFullscreen ? "h-full w-full bg-black object-contain" : "h-full w-full object-cover"
                }
                playsInline
                muted={isMuted}
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                onClick={togglePlay}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Date label */}
              <div className="pointer-events-none absolute right-5 top-5 z-[4] font-mono text-[11px] tracking-[0.2em] text-white/60">
                {video.dateLabel}
              </div>

              {/* Big centered play button -- only in the docked (non-fullscreen)
                  view. In fullscreen it would sit on top of the whole frame
                  and block clicking the video itself to pause, so fullscreen
                  relies on the video's own onClick above instead. */}
              {!isPlaying && !isFullscreen && (
                <button
                  data-cursor="hover"
                  onClick={togglePlay}
                  aria-label="تشغيل"
                  className="absolute inset-0 z-[4] flex items-center justify-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/30 backdrop-blur-sm transition-transform hover:scale-105">
                    <Play size={22} className="ml-1 text-white/90" />
                  </span>
                </button>
              )}

              {/* Title label */}
              <div className="pointer-events-none absolute bottom-20 left-5 z-[4] font-body text-sm text-white/80">
                {video.title}
              </div>

              {isLoading && !hasError && (
                <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-black/30">
                  <Loader2 size={26} className="animate-spin text-archive-gold/80" />
                </div>
              )}

              {hasError && (
                <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-black/60">
                  <span className="font-mono text-xs text-white/50">تعذر تحميل الفيديو</span>
                </div>
              )}

              {showStatic && (
                <div className="pointer-events-none absolute inset-0 z-[5] animate-pulse bg-white/10 mix-blend-overlay" />
              )}

              <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.55)_100%)]" />

              {/* Controls: always on top (z-[7]), always inside the portal
                  so they're never covered by anything. */}
              <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[7]">
                {controls}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

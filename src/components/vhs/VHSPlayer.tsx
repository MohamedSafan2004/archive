"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
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
 * The old version rendered two separate <video> tags (one inline, one inside
 * the fullscreen portal) and swapped which one was in the DOM. Every swap
 * forced the browser to throw away its buffered data and start a brand new
 * network request from 0:00 — that's what caused the stutter/re-buffering
 * when opening fullscreen. Now there is exactly ONE <video> element for the
 * entire lifetime of this component. It always lives inside a portal
 * attached to document.body, and we move it between "docked" (sitting
 * inline in the grid, positioned absolutely over a placeholder box) and
 * "fullscreen" (fixed, covering the viewport) purely via CSS. The browser
 * never re-requests the source, so playback position and buffered data
 * survive the transition perfectly.
 *
 * We portal to document.body (rather than rendering the video directly in
 * the card) because any ancestor with a CSS `transform` — common with
 * Framer Motion wrappers like the grid/section around this card — turns
 * `position: fixed` into behaving like `absolute` relative to that
 * ancestor instead of the viewport. Portaling sidesteps that entirely.
 *
 * We track the docked card's on-screen position with getBoundingClientRect
 * and sync it to the portaled video's inline style on scroll/resize, so it
 * looks like it's sitting inside the card even though it technically lives
 * at the end of <body>.
 */
export function VHSPlayer({ video }: VHSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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
    function handleWaiting() {
      setIsLoading(true);
    }
    function handlePlaying() {
      setIsLoading(false);
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
    el.addEventListener("canplay", handleCanPlay);
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("waiting", handleWaiting);
      el.removeEventListener("playing", handlePlaying);
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
      setShowStatic(true);
      setTimeout(() => setShowStatic(false), 200);
      el.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
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

  // Inline styles for the portaled video wrapper — either pinned over the
  // docked placeholder (via measured rect) or pinned fullscreen.
  const portalWrapperStyle: React.CSSProperties = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 100,
      }
    : dockRect
    ? {
        position: "fixed",
        top: dockRect.top,
        left: dockRect.left,
        width: dockRect.width,
        height: dockRect.height,
        zIndex: 1,
        borderRadius: "0.5rem",
        overflow: "hidden",
      }
    : { display: "none" };

  return (
    <>
      {/* Placeholder that reserves layout space in the grid. The real
          <video> is portaled on top of this via measured coordinates. */}
      <div
        ref={dockRef}
        className="vhs-scanlines relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
      >
        <div className="absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
          {video.dateLabel}
        </div>
        <div className="absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
          {video.title}
        </div>
        {!isFullscreen && <div className="absolute bottom-0 left-0 right-0 z-[4]">{controls}</div>}
      </div>

      {/* Single persistent <video>, portaled to document.body, repositioned via CSS only. */}
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
                  ? "vhs-scanlines pointer-events-auto absolute left-1/2 top-1/2 aspect-video w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60 md:w-[calc(100%-5rem)]"
                  : "pointer-events-auto relative h-full w-full"
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
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                onEnded={() => setIsPlaying(false)}
              />

              {isLoading && !hasError && (
                <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-black/30">
                  <Loader2 size={28} className="animate-spin text-archive-gold/80" />
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

              <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

              {isFullscreen && (
                <>
                  <div className="pointer-events-none absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
                    {video.dateLabel}
                  </div>
                  <div className="pointer-events-none absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
                    {video.title}
                  </div>
                  <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[4]">
                    {controls}
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

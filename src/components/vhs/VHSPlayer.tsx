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
 * autoPlayWhenReady: when true (the reel currently centered in view), the
 * video attempts to play muted the moment it's mounted -- this is what
 * makes scrolling through the archive feel like memories waking up on
 * their own, without needing a click. The person can always tap to
 * unmute or pause; nothing here fights their control.
 */
export function VHSPlayer({
  video,
  autoPlayWhenReady = false,
}: VHSPlayerProps & { autoPlayWhenReady?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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

  // Gentle autoplay when this reel becomes the centered one in the archive.
  // Muted autoplay is allowed by every browser without a user gesture, so
  // this is what makes the memory feel like it wakes up as you arrive at
  // it -- no click required to see it move.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlayWhenReady) return;
    el.muted = true;
    setIsMuted(true);
    el.play().catch(() => {
      /* browser declined autoplay; person can press play manually */
    });
  }, [autoPlayWhenReady]);

  useEffect(() => {
    if (!autoPlayWhenReady) {
      const el = videoRef.current;
      if (el && !el.paused) el.pause();
    }
  }, [autoPlayWhenReady]);

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
      <div
        ref={dockRef}
        className="vhs-scanlines relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60"
        onClick={() => {
          if (!isPlaying) togglePlay();
        }}
      >
        <div className="pointer-events-none absolute right-5 top-5 z-[4] font-mono text-[11px] tracking-[0.2em] text-white/60">
          {video.dateLabel}
        </div>
        {!isPlaying && !isFullscreen && (
          <div
            data-cursor="hover"
            className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/30 backdrop-blur-sm transition-transform">
              <Play size={22} className="ml-1 text-white/90" />
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-20 left-5 z-[4] font-body text-sm text-white/80">
          {video.title}
        </div>
        {!isFullscreen && (
          <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[4]">
            {controls}
          </div>
        )}
      </div>

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
                muted={isMuted}
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                onEnded={() => setIsPlaying(false)}
              />

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

              {isFullscreen && (
                <>
                  <div className="pointer-events-none absolute right-5 top-5 z-[4] font-mono text-[11px] tracking-[0.2em] text-white/60">
                    {video.dateLabel}
                  </div>
                  <div className="pointer-events-none absolute bottom-20 left-5 z-[4] font-body text-sm text-white/80">
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

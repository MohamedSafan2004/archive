"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { VHSVideo } from "@/types";
import { EASE } from "@/lib/constants";
import { VHSControls } from "./VHSControls";

interface VHSPlayerProps {
  video: VHSVideo;
}

/**
 * VHS frame with a fullscreen toggle.
 *
 * Fullscreen renders as a real modal via createPortal straight into
 * document.body. This intentionally avoids two fragile approaches:
 *   1. Native Fullscreen API — strips our scanline/vignette styling.
 *   2. `position: fixed` left inside the component's normal parent tree —
 *      any ancestor with a CSS `transform` (common with Framer Motion
 *      wrappers like the grid/section around this card) turns `fixed`
 *      into acting like `absolute` relative to that ancestor instead of
 *      the viewport, which is exactly what broke the previous version.
 * Portaling to document.body sidesteps that entirely: the overlay is
 * guaranteed to be positioned against the real viewport every time.
 *
 * The <video> element itself unmounts from the inline card and remounts
 * inside the portal (they're different spots in the DOM tree), so we
 * manually save/restore currentTime and play state across that switch —
 * otherwise the video would silently jump back to 0:00 every time
 * fullscreen is toggled.
 */
export function VHSPlayer({ video }: VHSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const savedTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    function handleTimeUpdate() {
      if (!el!.duration) return;
      setProgress((el!.currentTime / el!.duration) * 100);
    }

    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") exitFullscreen();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Restore playback position + play state right after the <video>
  // element remounts in its new location (inline <-> portal).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = savedTimeRef.current;
    if (wasPlayingRef.current) {
      el.play().catch(() => {});
    }
  }, [isFullscreen]);

  function enterFullscreen() {
    const el = videoRef.current;
    savedTimeRef.current = el?.currentTime ?? 0;
    wasPlayingRef.current = isPlaying;
    setIsFullscreen(true);
  }

  function exitFullscreen() {
    const el = videoRef.current;
    savedTimeRef.current = el?.currentTime ?? 0;
    wasPlayingRef.current = isPlaying;
    setIsFullscreen(false);
  }

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

  const videoEl = (
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
  );

  const controls = (
    <VHSControls
      isPlaying={isPlaying}
      isMuted={isMuted}
      progress={progress}
      isFullscreen={isFullscreen}
      onTogglePlay={togglePlay}
      onToggleMute={toggleMute}
      onSeek={seek}
      onToggleFullscreen={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
    />
  );

  return (
    <>
      {/* Inline card. Stays in the layout (not unmounted) while fullscreen
          is open, just visually hidden, so the grid doesn't reflow. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE.smooth }}
        className="vhs-scanlines relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
        style={isFullscreen ? { visibility: "hidden" } : undefined}
      >
        <div className="absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
          {video.dateLabel}
        </div>

        {!isFullscreen && videoEl}

        {showStatic && !isFullscreen && (
          <div className="absolute inset-0 z-[5] animate-pulse bg-white/10 mix-blend-overlay" />
        )}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

        <div className="absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
          {video.title}
        </div>

        {!isFullscreen && (
          <div className="absolute bottom-0 left-0 right-0 z-[4]">{controls}</div>
        )}
      </motion.div>

      {/* Fullscreen modal — portaled straight to document.body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE.smooth }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-10"
                onClick={exitFullscreen}
              >
                <button
                  data-cursor="hover"
                  onClick={exitFullscreen}
                  className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
                  aria-label="اغلاق"
                >
                  <X size={20} />
                </button>

                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE.smooth }}
                  onClick={(e) => e.stopPropagation()}
                  className="vhs-scanlines relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
                >
                  <div className="absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
                    {video.dateLabel}
                  </div>

                  {isFullscreen && videoEl}

                  {showStatic && isFullscreen && (
                    <div className="absolute inset-0 z-[5] animate-pulse bg-white/10 mix-blend-overlay" />
                  )}

                  <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

                  <div className="absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
                    {video.title}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-[4]">{controls}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

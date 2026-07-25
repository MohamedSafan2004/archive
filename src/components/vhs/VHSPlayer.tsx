"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { VHSVideo } from "@/types";
import { EASE } from "@/lib/constants";
import { VHSControls } from "./VHSControls";

interface VHSPlayerProps {
  video: VHSVideo;
}

/**
 * VHS frame that expands into a smooth fullscreen overlay.
 *
 * There is only ever one <video> element for this player, rendered
 * unconditionally — we never branch it in/out based on fullscreen state.
 * Toggling fullscreen just switches its wrapper between a normal in-flow
 * div and a `fixed` overlay via Framer's `layout` animation. Because it
 * stays the same React element in the same position in the tree (no
 * portal, no conditional unmount), Framer can measure the before/after
 * boxes and animate a real "grows from its spot to fill the screen"
 * transition instead of a plain cut or fade. Native Fullscreen API is
 * skipped since it would strip our scanline/vignette styling.
 */
export function VHSPlayer({ video }: VHSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    function handleTimeUpdate() {
      if (!el!.duration) return;
      setProgress((el!.currentTime / el!.duration) * 100);
    }

    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
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
      el.play();
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

  return (
    <>
      {/* Dark backdrop, only exists while fullscreen. Sits at a lower
          z-index than the frame below so the frame reads on top of it. */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE.smooth }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>

      {isFullscreen && (
        <button
          data-cursor="hover"
          onClick={() => setIsFullscreen(false)}
          className="fixed right-6 top-6 z-[102] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
          aria-label="اغلاق"
        >
          <X size={20} />
        </button>
      )}

      {/* Reserves the frame's normal footprint in the grid while it's
          fixed-positioned elsewhere on screen, so sibling cards don't
          jump around. */}
      {isFullscreen && (
        <div className="mx-auto aspect-video w-full max-w-3xl" aria-hidden />
      )}

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          opacity: { duration: 0.8, ease: EASE.smooth },
          scale: { duration: 0.8, ease: EASE.smooth },
          layout: { duration: 0.55, ease: EASE.smooth },
        }}
        onClick={(e) => isFullscreen && e.stopPropagation()}
        className={
          isFullscreen
            ? "vhs-scanlines fixed left-1/2 top-1/2 z-[101] aspect-video w-[92vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
            : "vhs-scanlines relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
        }
      >
        <div className="absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
          {video.dateLabel}
        </div>
        <div className="absolute left-4 top-4 z-[4] flex items-center gap-2 font-mono text-xs tracking-wider text-red-500/80">
          <span
            className={`h-2 w-2 rounded-full bg-red-500 ${isPlaying ? "animate-pulse" : ""}`}
          />
          REC
        </div>

        {/* preload="metadata" only — with 6 videos on one page we don't
            want the browser eagerly downloading full video data before
            the user presses play. */}
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster || undefined}
          className={
            isFullscreen ? "h-full w-full bg-black object-contain" : "h-full w-full object-cover"
          }
          playsInline
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
        />

        {showStatic && (
          <div className="absolute inset-0 z-[5] animate-pulse bg-white/10 mix-blend-overlay" />
        )}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

        <div className="absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
          {video.title}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[4]">
          <VHSControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            progress={progress}
            isFullscreen={isFullscreen}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onSeek={seek}
            onToggleFullscreen={() => setIsFullscreen((v) => !v)}
          />
        </div>
      </motion.div>
    </>
  );
}

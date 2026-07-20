"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { VHSVideo } from "@/types";
import { EASE } from "@/lib/constants";
import { VHSControls } from "./VHSControls";

interface VHSPlayerProps {
  video: VHSVideo;
}

export function VHSPlayer({ video }: VHSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStatic, setShowStatic] = useState(false);

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

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
    } else {
      // Brief static flicker on play, like an old VCR kicking in
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
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: EASE.smooth }}
      className="vhs-scanlines relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/60"
    >
      {/* Timestamp overlay */}
      <div className="absolute right-4 top-4 z-[4] font-mono text-xs tracking-wider text-white/70">
        {video.dateLabel}
      </div>
      <div className="absolute left-4 top-4 z-[4] flex items-center gap-2 font-mono text-xs tracking-wider text-red-500/80">
        <span
          className={`h-2 w-2 rounded-full bg-red-500 ${isPlaying ? "animate-pulse" : ""}`}
        />
        REC
      </div>

      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        className="h-full w-full object-cover"
        playsInline
        onEnded={() => setIsPlaying(false)}
      />

      {/* Static flicker */}
      {showStatic && (
        <div className="absolute inset-0 z-[5] animate-pulse bg-white/10 mix-blend-overlay" />
      )}

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

      {/* Title label */}
      <div className="absolute bottom-16 left-4 z-[4] font-body text-sm text-white/80">
        {video.title}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[4]">
        <VHSControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onSeek={seek}
        />
      </div>
    </motion.div>
  );
}

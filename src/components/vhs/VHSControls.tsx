"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VHSControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number; // 0-100
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (percent: number) => void;
}

export function VHSControls({
  isPlaying,
  isMuted,
  progress,
  onTogglePlay,
  onToggleMute,
  onSeek,
}: VHSControlsProps) {
  function handleScrubClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(Math.min(100, Math.max(0, percent)));
  }

  return (
    <div className="relative z-10 flex items-center gap-4 bg-black/60 px-5 py-3 backdrop-blur-sm">
      <button
        data-cursor="hover"
        onClick={onTogglePlay}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>

      <div
        onClick={handleScrubClick}
        className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/20"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-archive-gold"
          style={{ width: `${progress}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-archive-gold",
            "opacity-0 transition-opacity group-hover:opacity-100"
          )}
          style={{ left: `${progress}%` }}
        />
      </div>

      <button
        data-cursor="hover"
        onClick={onToggleMute}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
}

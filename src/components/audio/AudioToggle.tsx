"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperienceStore } from "@/store/experienceStore";

export function AudioToggle() {
  const isMuted = useExperienceStore((s) => s.audio.isMuted);
  const volume = useExperienceStore((s) => s.audio.volume);
  const setAudioMuted = useExperienceStore((s) => s.setAudioMuted);
  const setAudioVolume = useExperienceStore((s) => s.setAudioVolume);
  const stage = useExperienceStore((s) => s.stage);
  const [showSlider, setShowSlider] = useState(false);

  if (stage === "loading" || stage === "gate") return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[55] flex items-center gap-3"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <AnimatePresence>
        {showSlider && (
          <motion.input
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            exit={{ opacity: 0, width: 0 }}
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="accent-archive-gold"
          />
        )}
      </AnimatePresence>

      <button
        data-cursor="hover"
        onClick={() => setAudioMuted(!isMuted)}
        className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-archive-text transition-colors hover:border-archive-gold/40"
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

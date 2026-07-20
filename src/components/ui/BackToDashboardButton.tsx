"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";

/**
 * Fixed navigation button, top-right (RTL-friendly), that returns
 * the visitor to the Archive Dashboard from any later stage.
 * Hidden on "loading" and "gate" since there's nothing to go back to yet,
 * and hidden while already on the dashboard itself.
 */
export function BackToDashboardButton() {
  const stage = useExperienceStore((s) => s.stage);
  const setStage = useExperienceStore((s) => s.setStage);

  const isVisible = stage === "timeline" || stage === "gallery" || stage === "ending";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          data-cursor="hover"
          onClick={() => setStage("dashboard")}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.6, ease: EASE.smooth }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="glass-panel fixed right-6 top-6 z-[55] flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm text-archive-text transition-colors duration-300 hover:border-archive-gold/40"
        >
          <ArrowRight size={16} className="text-archive-gold" />
          <span>الأرشيف</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
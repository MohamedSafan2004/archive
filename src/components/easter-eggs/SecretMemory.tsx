"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useExperienceStore } from "@/store/experienceStore";
import { EASTER_EGGS, MEMORIES } from "@/lib/content";
import { EASE } from "@/lib/constants";

export function SecretMemory() {
  const activeSecretMemoryId = useExperienceStore((s) => s.activeSecretMemoryId);
  const closeSecretMemory = useExperienceStore((s) => s.closeSecretMemory);

  const egg = EASTER_EGGS.find((e) => e.id === activeSecretMemoryId);
  const linkedMemory = egg?.unlockedMemoryId
    ? MEMORIES.find((m) => m.id === egg.unlockedMemoryId)
    : null;

  return (
    <AnimatePresence>
      {egg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
          onClick={closeSecretMemory}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: EASE.smooth }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative w-full max-w-md rounded-2xl p-8 text-right"
          >
            <button
              data-cursor="hover"
              onClick={closeSecretMemory}
              className="absolute left-5 top-5 text-archive-muted transition-colors hover:text-archive-text"
            >
              <X size={18} />
            </button>

            <span className="font-mono text-xs uppercase tracking-[0.3em] text-archive-gold">
              ذكرى سرية مفتوحة
            </span>
            <h3 className="mt-3 font-display text-2xl text-archive-text">{egg.title}</h3>
            <p className="mt-4 font-body leading-relaxed text-archive-muted">
              {egg.content}
            </p>

            {linkedMemory && (
              <div className="mt-6 border-t border-archive-border pt-6">
                <p className="font-body text-sm text-archive-text">
                  {linkedMemory.description}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

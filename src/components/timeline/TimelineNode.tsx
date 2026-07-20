"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { MemoryEntry } from "@/types";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/constants";

interface TimelineNodeProps {
  memory: MemoryEntry;
  index: number;
  isUnlocked: boolean;
  onClick: () => void;
}

export function TimelineNode({ memory, index, isUnlocked, onClick }: TimelineNodeProps) {
  const isLeft = index % 2 === 0;
  const isLocked = memory.isSecret && !isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: EASE.smooth }}
      className={cn(
        "relative flex w-full items-center gap-6 py-10",
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Content card */}
      <div className={cn("flex-1", isLeft ? "md:text-right" : "md:text-left")}>
        <button
          data-cursor="hover"
          onClick={onClick}
          disabled={isLocked}
          className={cn(
            "glass-panel group inline-block w-full max-w-sm rounded-2xl p-6 text-right transition-all duration-500",
            isLocked
              ? "cursor-not-allowed opacity-60"
              : "hover:border-archive-gold/30 hover:-translate-y-1"
          )}
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-archive-gold">
            {memory.year}
          </span>
          <h3 className="mt-2 flex items-center justify-end gap-2 font-display text-xl text-archive-text">
            {isLocked && <Lock size={16} />}
            {isLocked ? "ذكرى سرية" : memory.title}
          </h3>
          <p className="mt-2 font-body text-sm text-archive-muted">
            {isLocked ? "استخدم الكود السري عشان تفتحها" : memory.description}
          </p>
        </button>
      </div>

      {/* Center node dot */}
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div
          className={cn(
            "h-3 w-3 rounded-full border-2 transition-colors duration-500",
            isLocked
              ? "border-archive-muted bg-archive-bg"
              : "border-archive-gold bg-archive-gold"
          )}
        />
      </div>

      <div className="hidden flex-1 md:block" />
    </motion.div>
  );
}

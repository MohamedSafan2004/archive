"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MEMORIES } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { TimelineChapter } from "./TimelineChapter";
import { EASE } from "@/lib/constants";

export function MemoryTimeline() {
  const stage = useExperienceStore((s) => s.stage);
  const setStage = useExperienceStore((s) => s.setStage);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (stage !== "timeline") return null;

  // Secret memory only ever appears once unlocked via its easter egg —
  // it lives in the SecretMemory modal, not inline in the scroll here.
  const visibleMemories = MEMORIES.filter((m) => !m.isSecret);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative min-h-screen"
    >
      {/* Intro */}
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-24 text-center md:pt-32">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
          خط الزمن
        </p>
        <h1 className="font-display text-5xl leading-[1.1] tracking-tight text-archive-text md:text-6xl">
          كل لحظة كان ليها معنى
        </h1>
      </div>

      {/* Subtle progress rail along the side — reads the journey's
          progression without competing with the full-bleed photos */}
      <div className="pointer-events-none fixed left-6 top-1/2 z-30 hidden h-40 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:block">
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-0 top-0 w-full bg-archive-gold"
        />
      </div>

      {/* One continuous cinematic chapter per memory — photo and text
          live together instead of being split across separate sections */}
      <div>
        {visibleMemories.map((memory, index) => (
          <TimelineChapter key={memory.id} memory={memory} index={index} />
        ))}
      </div>

      {/* Continue to ending */}
      <div className="flex justify-center py-24">
        <button
          data-cursor="hover"
          onClick={() => setStage("ending")}
          className="group flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-archive-gold transition-opacity hover:opacity-70"
        >
          كمل للنهاية
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        </button>
      </div>
    </motion.div>
  );
}

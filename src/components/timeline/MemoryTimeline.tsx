"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MEMORIES } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { TimelineNode } from "./TimelineNode";
import { PhotoSection } from "@/components/photos/PhotoSection";
import { EASE } from "@/lib/constants";

export function MemoryTimeline() {
  const stage = useExperienceStore((s) => s.stage);
  const unlockedEasterEggs = useExperienceStore((s) => s.unlockedEasterEggs);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const setStage = useExperienceStore((s) => s.setStage);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (stage !== "timeline") return null;

  const visibleMemories = MEMORIES.filter(
    (m) => !m.isSecret || unlockedEasterEggs.length > 0
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative min-h-screen bg-archive-bg px-6 py-24 md:px-16"
    >
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
          خط الزمن
        </p>
        <h1 className="font-display text-4xl text-archive-text md:text-5xl">
          كل لحظة كان ليها معنى
        </h1>
      </div>

      {/* Timeline with progress line */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-1/2 top-0 hidden h-full w-[1px] -translate-x-1/2 bg-archive-border md:block">
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-0 top-0 w-full bg-archive-gold"
          />
        </div>

        {visibleMemories.map((memory, index) => (
          <TimelineNode
            key={memory.id}
            memory={memory}
            index={index}
            isUnlocked={!memory.isSecret || unlockedEasterEggs.length > 0}
            onClick={() => {
              if (memory.isSecret) {
                openSecretMemory(memory.id);
              } else {
                document
                  .getElementById(`photos-section-${memory.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          />
        ))}
      </div>

      {/* Full photo sections below the timeline */}
      <div className="mt-32">
        {visibleMemories
          .filter((m) => !m.isSecret)
          .map((memory) => (
            <PhotoSection key={memory.id} memory={memory} />
          ))}
      </div>

      {/* Continue to ending */}
      <div className="mt-24 flex justify-center">
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

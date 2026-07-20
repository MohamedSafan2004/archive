"use client";

import { motion } from "framer-motion";
import type { MemoryEntry } from "@/types";
import { RevealSlide } from "./transitions/RevealSlide";
import { MaskWipe } from "./transitions/MaskWipe";
import { ParallaxStack } from "./transitions/ParallaxStack";
import { EASE } from "@/lib/constants";

interface PhotoSectionProps {
  memory: MemoryEntry;
}

export function PhotoSection({ memory }: PhotoSectionProps) {
  return (
    <section
      id={`photos-section-${memory.id}`}
      className="relative py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE.smooth }}
        className="mx-auto mb-12 max-w-3xl px-6 text-center"
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-archive-gold">
          {memory.year}
        </span>
        <h2 className="mt-3 font-display text-3xl text-archive-text md:text-4xl">
          {memory.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-archive-muted">
          {memory.description}
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl px-6">
        {memory.transitionVariant === "reveal-slide" && (
          <RevealSlide photos={memory.photos} />
        )}
        {memory.transitionVariant === "mask-wipe" && (
          <MaskWipe photos={memory.photos} />
        )}
        {memory.transitionVariant === "parallax-stack" && (
          <ParallaxStack photos={memory.photos} />
        )}
      </div>
    </section>
  );
}

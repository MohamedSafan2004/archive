"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MemoryPhoto } from "@/types";

interface RevealSlideProps {
  photos: MemoryPhoto[];
}

export function RevealSlide({ photos }: RevealSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {photos.map((photo, i) => {
        const clipPath = useTransform(
          scrollYProgress,
          [0.1 + i * 0.05, 0.4 + i * 0.05],
          ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
        );
        const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

        return (
          <motion.div
            key={photo.id}
            style={{ clipPath, y }}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-archive-surface"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {photo.caption && (
              <p className="absolute bottom-4 right-4 left-4 text-right font-body text-sm text-white/90">
                {photo.caption}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

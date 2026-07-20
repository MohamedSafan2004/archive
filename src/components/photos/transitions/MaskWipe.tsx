"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MemoryPhoto } from "@/types";

interface MaskWipeProps {
  photos: MemoryPhoto[];
}

export function MaskWipe({ photos }: MaskWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const maskSize = useTransform(scrollYProgress, [0.15, 0.5], ["0%", "150%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <div ref={containerRef} className="flex flex-col gap-8">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          style={{ rotate: i % 2 === 0 ? rotate : useTransform(rotate, (r) => -r) }}
          className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-archive-surface"
        >
          <motion.div
            style={{
              clipPath: useTransform(
                maskSize,
                (v) => `circle(${v} at 50% 50%)`
              ),
            }}
            className="absolute inset-0"
          >
            <motion.img
              src={photo.src}
              alt={photo.alt}
              style={{ scale }}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-archive-surface/40" />
          {photo.caption && (
            <p className="absolute bottom-4 right-4 left-4 text-right font-body text-sm text-white/90">
              {photo.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

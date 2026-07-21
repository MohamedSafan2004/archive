"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { MemoryPhoto } from "@/types";

interface ParallaxStackProps {
  photos: MemoryPhoto[];
}

interface ParallaxStackPhotoProps {
  photo: MemoryPhoto;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

/**
 * Each photo needs its own depth-scaled useTransform values.
 * Hooks must live in a stable per-item component, not inline
 * inside .map() in the parent.
 */
function ParallaxStackPhoto({ photo, index, total, scrollYProgress }: ParallaxStackPhotoProps) {
  const depth = (index + 1) * 0.15;
  const y = useTransform(scrollYProgress, [0, 1], [100 * depth, -100 * depth]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: total - index,
        left: `${10 + index * 8}%`,
        top: `${index * 6}%`,
      }}
      className="absolute aspect-[3/4] w-2/3 overflow-hidden rounded-2xl border border-archive-border bg-archive-surface shadow-2xl shadow-black/50"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 768px) 66vw, 33vw"
        quality={90}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      {photo.caption && (
        <p className="absolute bottom-3 right-3 left-3 text-right font-body text-xs text-white/90">
          {photo.caption}
        </p>
      )}
    </motion.div>
  );
}

export function ParallaxStack({ photos }: ParallaxStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="relative mx-auto h-[70vh] max-w-2xl">
      {photos.map((photo, i) => (
        <ParallaxStackPhoto
          key={photo.id}
          photo={photo}
          index={i}
          total={photos.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
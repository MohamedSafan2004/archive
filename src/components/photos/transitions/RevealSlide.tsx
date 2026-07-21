"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { MemoryPhoto } from "@/types";

interface RevealSlideProps {
  photos: MemoryPhoto[];
}

interface RevealSlidePhotoProps {
  photo: MemoryPhoto;
  index: number;
  scrollYProgress: MotionValue<number>;
}

/**
 * Each photo needs its own useTransform calls with index-dependent ranges.
 * Hooks must run in a stable component per item, never inside .map()
 * directly in the parent — hence this dedicated child component.
 */
function RevealSlidePhoto({ photo, index, scrollYProgress }: RevealSlidePhotoProps) {
  const clipPath = useTransform(
    scrollYProgress,
    [0.1 + index * 0.05, 0.4 + index * 0.05],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div
      style={{ clipPath, y }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-archive-surface"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        quality={90}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {photo.caption && (
        <p className="absolute bottom-4 right-4 left-4 text-right font-body text-sm text-white/90">
          {photo.caption}
        </p>
      )}
    </motion.div>
  );
}

export function RevealSlide({ photos }: RevealSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {photos.map((photo, i) => (
        <RevealSlidePhoto
          key={photo.id}
          photo={photo}
          index={i}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
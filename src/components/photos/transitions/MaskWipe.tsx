"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { MemoryPhoto } from "@/types";

interface MaskWipeProps {
  photos: MemoryPhoto[];
}

interface MaskWipePhotoProps {
  photo: MemoryPhoto;
  index: number;
  maskSize: MotionValue<string>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
}

/**
 * Each photo needs its own derived useTransform values (mirrored rotation
 * for alternating photos, circular mask clip-path). Hooks must live in a
 * stable per-item component, not inline inside .map() in the parent.
 */
function MaskWipePhoto({ photo, index, maskSize, scale, rotate }: MaskWipePhotoProps) {
  const mirroredRotate = useTransform(rotate, (r) => -r);
  const clipPath = useTransform(maskSize, (v) => `circle(${v} at 50% 50%)`);

  return (
    <motion.div
      style={{ rotate: index % 2 === 0 ? rotate : mirroredRotate }}
      className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-archive-surface"
    >
      <motion.div style={{ clipPath }} className="absolute inset-0">
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
  );
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
        <MaskWipePhoto
          key={photo.id}
          photo={photo}
          index={i}
          maskSize={maskSize}
          scale={scale}
          rotate={rotate}
        />
      ))}
    </div>
  );
}
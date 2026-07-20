"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GalleryPhoto } from "@/types";

interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
}

/**
 * A single museum-grid thumbnail. Uses native lazy loading
 * (loading="lazy") so with 50-60 photos the browser only decodes
 * images near the viewport, keeping scroll smooth.
 */
export function GalleryPhotoCard({ photo, index, onClick }: GalleryPhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Slight height variance for a museum/masonry feel without a full masonry lib
  const aspectClass = ["aspect-square", "aspect-[4/5]", "aspect-[3/4]"][index % 3];

  return (
    <motion.button
      data-cursor="hover"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index % 12, 8) * 0.04 }}
      className={`group relative ${aspectClass} w-full overflow-hidden rounded-xl bg-archive-surface`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {photo.caption && (
        <p className="absolute bottom-3 right-3 left-3 text-right font-body text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {photo.caption}
        </p>
      )}
    </motion.button>
  );
}
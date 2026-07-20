"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GALLERY_PHOTOS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";
import { GalleryPhotoCard } from "./Galleryphotocard";
import { GalleryLightbox } from "./Gallerylightbox";
import { MagneticButton } from "@/components/ui/MagneticButton";

const PAGE_SIZE = 18;

export function Gallery() {
  const stage = useExperienceStore((s) => s.stage);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePhotos = useMemo(
    () => GALLERY_PHOTOS.slice(0, visibleCount),
    [visibleCount]
  );
  const hasMore = visibleCount < GALLERY_PHOTOS.length;

  if (stage !== "gallery") return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative min-h-screen bg-archive-bg px-6 py-24 md:px-12"
    >
      {/* Header */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
          المتحف
        </p>
        <h1 className="font-display text-4xl text-archive-text md:text-5xl">
          كل لحظة، صورة
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-archive-muted">
          {GALLERY_PHOTOS.length} ذكرى محفوظة هنا. دوس على أي صورة عشان تكبرها.
        </p>
      </div>

      {/* Masonry-style grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <GalleryPhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <MagneticButton
            variant="ghost"
            data-cursor="hover"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, GALLERY_PHOTOS.length))}
          >
            اعرض المزيد ({GALLERY_PHOTOS.length - visibleCount} باقي)
          </MagneticButton>
        </div>
      )}

      <GalleryLightbox
        photos={visiblePhotos}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </motion.section>
  );
}
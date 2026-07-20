"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/types";
import { EASE } from "@/lib/constants";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null;
  const photo = isOpen ? photos[activeIndex] : null;

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goPrev(); // RTL: right = previous
      if (e.key === "ArrowLeft") goNext(); // RTL: left = next
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.smooth }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            data-cursor="hover"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
            aria-label="اغلاق"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute left-6 top-6 z-10 font-mono text-xs tracking-widest text-white/60">
            {activeIndex! + 1} / {photos.length}
          </div>

          {/* Prev (RTL: appears on the right side visually via order) */}
          <button
            data-cursor="hover"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold md:right-8"
            aria-label="السابق"
          >
            <ChevronRight size={22} />
          </button>

          {/* Next */}
          <button
            data-cursor="hover"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold md:left-8"
            aria-label="التالي"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Image */}
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE.smooth }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto max-h-[85vh] max-w-[90vw]"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl shadow-black/60"
            />
            {photo.caption && (
              <p className="mt-4 text-center font-body text-sm text-white/80">
                {photo.caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
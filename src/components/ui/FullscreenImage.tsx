"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { EASE } from "@/lib/constants";

interface FullscreenImageProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps any thumbnail-sized image so clicking it opens a fullscreen
 * viewer, portaled to document.body (same approach as VHSPlayer) so it's
 * never affected by a transformed ancestor breaking `position: fixed`.
 */
export function FullscreenImage({ src, alt, children, className }: FullscreenImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label={`تكبير ${alt}`}
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE.smooth }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-10"
                onClick={() => setIsOpen(false)}
              >
                <button
                  data-cursor="hover"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-archive-gold/60 hover:text-archive-gold"
                  aria-label="اغلاق"
                >
                  <X size={20} />
                </button>

                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE.smooth }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative aspect-auto h-[85vh] w-full max-w-5xl"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="90vw"
                    quality={95}
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import type { MemoryEntry } from "@/types";
import { cn } from "@/lib/utils";
import { FullscreenImage } from "@/components/ui/FullscreenImage";

interface TimelineChapterProps {
  memory: MemoryEntry;
  index: number;
}

/**
 * One full "chapter" of the timeline per memory: a large parallax
 * background photo with the year/title/description composited directly
 * over it, instead of a text card separated from a photo grid far below.
 * Secondary photos (if the memory has more than one) appear as a small
 * filmstrip beneath the headline photo so everything for this memory
 * lives in one continuous block. Every photo — hero and filmstrip alike —
 * opens fullscreen on click via FullscreenImage.
 */
export function TimelineChapter({ memory, index }: TimelineChapterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7, 0.9], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.15, 0.4], [40, 0]);

  const heroPhoto = memory.photos[0];
  const secondaryPhotos = memory.photos.slice(1);
  const isEven = index % 2 === 0;

  return (
    <section
      ref={containerRef}
      id={`chapter-${memory.id}`}
      className="relative flex min-h-[100vh] items-center overflow-hidden py-24"
    >
      {/* Parallax hero background — clickable to open fullscreen.
          focalPoint (if set on the photo) re-frames the crop so a
          specific subject (e.g. a person's face) stays visible instead
          of the default dead-center crop. */}
      {heroPhoto && (
        <FullscreenImage
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          className="absolute inset-0 -z-10 block h-full w-full cursor-pointer"
        >
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              sizes="100vw"
              quality={85}
              priority={index === 0}
              className="object-cover"
              style={{ objectPosition: heroPhoto.focalPoint || "center" }}
            />
          </motion.div>
        </FullscreenImage>
      )}

      {/* Dark cinematic gradient so text stays readable over any photo.
          Layered radial + directional gradients (not a flat linear fade)
          for a richer, more intentional vignette instead of a plain
          top-to-bottom darken. */}
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-t from-black via-black/55 to-black/20" />
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background: isEven
            ? "radial-gradient(ellipse 70% 90% at 25% 60%, rgba(0,0,0,0.65) 0%, transparent 60%)"
            : "radial-gradient(ellipse 70% 90% at 75% 60%, rgba(0,0,0,0.65) 0%, transparent 60%)",
        }}
      />

      {/* Text content, scroll-linked fade */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className={cn(
          "relative mx-auto w-full max-w-2xl px-6 text-center md:px-12",
          isEven ? "md:mr-auto md:ml-16 md:text-right" : "md:ml-auto md:mr-16 md:text-left"
        )}
      >
        <span className="font-mono text-sm uppercase tracking-[0.4em] text-archive-gold">
          {memory.year}
        </span>
        <h2 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-white md:text-6xl">
          {memory.title}
        </h2>
        <p className="mx-auto mt-6 max-w-md font-body text-lg leading-relaxed text-white/80 md:mx-0">
          {memory.description}
        </p>

        {/* Filmstrip of any additional photos for this memory. Landscape
            aspect ratio (16/10) matches how most of these photos were shot,
            so object-contain doesn't have to shrink them down to fit a tall
            frame — that's what made this look cropped/tiny before. */}
        {secondaryPhotos.length > 0 && (
          <div
            className={cn(
              "mt-10 flex flex-wrap gap-4",
              isEven ? "md:justify-end" : "md:justify-start"
            )}
          >
            {secondaryPhotos.map((photo) => (
              <FullscreenImage
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                className="vhs-scanlines relative aspect-[16/10] w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-xl transition-transform duration-300 hover:scale-105 sm:w-80 md:w-96"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 320px, 384px"
                  className="object-contain"
                  style={{ objectPosition: photo.focalPoint || "center" }}
                />
              </FullscreenImage>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

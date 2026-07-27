"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { VHS_VIDEOS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";
import { VHSPlayer } from "./VHSPlayer";

/**
 * Wraps a VHSPlayer so its <video> element (and the browser's metadata
 * request that comes with it) doesn't exist in the DOM at all until the
 * card is actually near the viewport. With 20 videos on one page, mounting
 * every <video preload="metadata"> tag immediately meant 20 simultaneous
 * network requests firing the moment the section appeared — that's what
 * caused the freeze. Now only cards close to the visible area ever mount
 * their <video>, so the browser only ever has a handful of requests
 * in flight regardless of how many videos are in the archive.
 */
function LazyVHSSlot({ video }: { video: (typeof VHS_VIDEOS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" } // start mounting a bit before it's on screen
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMount]);

  return (
    <div ref={ref} className="aspect-video w-full">
      {shouldMount ? (
        <VHSPlayer video={video} />
      ) : (
        <div className="vhs-scanlines flex h-full w-full items-center justify-center rounded-lg border border-white/10 bg-black/40">
          <span className="font-mono text-xs tracking-widest text-white/30">
            {video.dateLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export function VHSArchive() {
  const stage = useExperienceStore((s) => s.stage);

  if (stage !== "vhs") return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative min-h-screen px-6 py-24 md:px-12"
    >
      {/* Header */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
          <Film size={14} />
          الأرشيف المرئي
        </p>
        <h1 className="font-display text-5xl leading-[1.1] tracking-tight text-archive-text md:text-6xl">
          تسجيلات من زمان
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-archive-muted">
          {VHS_VIDEOS.length} شرائط محفوظة. دوس تشغيل على أي واحد.
        </p>
      </div>

      {/* Videos grid — each slot mounts its <video> lazily as it nears view */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {VHS_VIDEOS.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: EASE.smooth }}
          >
            <LazyVHSSlot video={video} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

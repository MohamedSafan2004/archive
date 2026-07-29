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
 * card is actually near the viewport.
 *
 * PERFORMANCE FIX: the previous rootMargin of "600px" was far too generous
 * for a 2-column grid of 20 videos — on a typical screen it caused 3-4 full
 * rows (6-8 <video> tags) to mount simultaneously the instant the section
 * came into view, firing 6-8 concurrent metadata requests at once. That's
 * what looked like "everything loading slowly at the same time." Shrinking
 * the margin to "150px" means only the row that's actually about to be
 * seen mounts ahead of time — typically 2 videos, occasionally 4 during a
 * fast scroll. Combined with unmounting cards once they scroll far out of
 * view (below), the number of <video> tags alive at any moment stays small
 * regardless of how many videos are in the archive.
 */
function LazyVHSSlot({ video }: { video: (typeof VHS_VIDEOS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isNear = entries[0]?.isIntersecting ?? false;
        setShouldMount(isNear);
      },
      { rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
          {VHS_VIDEOS.length} شرائط محفوظة
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

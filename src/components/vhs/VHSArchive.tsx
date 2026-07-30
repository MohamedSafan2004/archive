"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { VHS_VIDEOS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";
import { VHSPlayer } from "./VHSPlayer";

/**
 * One reel in the archive.
 *
 * PERFORMANCE: the <video> element for this reel does not exist in the DOM
 * at all until the reel is near the viewport ("armed"), and it's torn down
 * again once the reel scrolls far away ("retired"). At most 1-2 reels are
 * ever armed at once, regardless of how many videos are in the archive --
 * a fast scroll through 23 videos still only ever mounts a couple of
 * <video> tags, not all of them. Nothing plays until the person presses
 * play on it themselves.
 */
function ArchiveReel({
  video,
  index,
  total,
}: {
  video: (typeof VHS_VIDEOS)[number];
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  // Mount/unmount the player as the reel nears or leaves the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => setArmed(entries[0]?.isIntersecting ?? false),
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const romanIndex = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-[85vh] w-full items-center justify-center px-4 py-16 md:min-h-screen md:px-8"
    >
      {/* Reel number + progress mark -- a quiet spine running through the
          archive so the person can feel how far they've traveled, without
          it ever reading as a UI element like a progress bar. */}
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:left-10 md:flex">
        <span className="font-mono text-xs tracking-widest text-archive-muted/50">
          {romanIndex}
        </span>
        <div className="h-16 w-px bg-gradient-to-b from-archive-gold/40 via-white/10 to-transparent" />
        <span className="font-mono text-[10px] tracking-widest text-archive-muted/30">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: EASE.smooth }}
        className="aspect-video w-full max-w-4xl"
      >
        {armed ? (
          <VHSPlayer video={video} />
        ) : (
          <div className="vhs-scanlines flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-black/40">
            <span className="font-mono text-xs tracking-widest text-white/25">
              {video.dateLabel}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function VHSArchive() {
  const stage = useExperienceStore((s) => s.stage);

  // Stable list reference so the reels below don't remount on unrelated
  // re-renders of this component.
  const videos = useMemo(() => VHS_VIDEOS, []);

  if (stage !== "vhs") return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative"
    >
      {/* Intro -- sets the tone before the first reel, rather than a
          dashboard-style header sitting above a grid. */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center md:px-12">
        <p className="mb-5 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-archive-gold">
          <Film size={14} />
          الأرشيف المرئي
        </p>
        <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-archive-text md:text-6xl">
          تسجيلات من زمان
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-archive-muted">
          {videos.length} شريط محفوظ. اتفرج عليهم واحد واحد.
        </p>
      </div>

      {videos.map((video, index) => (
        <ArchiveReel key={video.id} video={video} index={index} total={videos.length} />
      ))}
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { VHS_VIDEOS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";
import { VHSPlayer } from "./VHSPlayer";

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

      {/* Videos grid — one column on mobile, two on larger screens.
          Only two videos ever render at once per row, so decode cost
          stays low even though these are heavier files than photos. */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {VHS_VIDEOS.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: EASE.smooth }}
          >
            <VHSPlayer video={video} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

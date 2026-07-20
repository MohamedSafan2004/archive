"use client";

import { motion } from "framer-motion";
import { ARCHIVE_CARDS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";
import { ArchiveCard } from "./ArchiveCard";
import { ParticlesField } from "@/components/ui/ParticlesField";

export function ArchiveDashboard() {
  const stage = useExperienceStore((s) => s.stage);

  if (stage !== "dashboard") return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE.smooth }}
      className="relative min-h-screen overflow-hidden bg-archive-bg px-6 py-24 md:px-16"
    >
      <ParticlesField
        count={120}
        className="pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          id="archive-logo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.smooth }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
            تم فتح الأرشيف
          </p>
          <h1 className="font-display text-4xl text-archive-text md:text-6xl">
            أهلاً بيك في الذكريات
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-body text-archive-muted">
            كل حاجة هنا اتحفظت عشان اللحظة دي بالذات. اختار من فين تحب تبدأ.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ARCHIVE_CARDS.map((card, index) => (
            <ArchiveCard key={card.id} data={card} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

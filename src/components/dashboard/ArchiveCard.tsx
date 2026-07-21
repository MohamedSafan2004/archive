"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { ArchiveCardData, ExperienceStage } from "@/types";
import { useExperienceStore } from "@/store/experienceStore";
import { cn } from "@/lib/utils";

interface ArchiveCardProps {
  data: ArchiveCardData;
  index: number;
}

export function ArchiveCard({ data, index }: ArchiveCardProps) {
  const setStage = useExperienceStore((s) => s.setStage);

  const Icon = (Icons[data.icon as keyof typeof Icons] ??
    Icons.Folder) as Icons.LucideIcon;

  function handleClick() {
    if (data.targetStage) {
      setStage(data.targetStage as ExperienceStage);
    } else if (data.targetSectionId) {
      setStage("timeline");
      setTimeout(() => {
        document
          .getElementById(data.targetSectionId!)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  }

  return (
    <motion.button
      data-cursor="hover"
      onClick={handleClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "glass-panel group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl p-8 text-right",
        "transition-colors duration-500 hover:border-archive-gold/25"
      )}
    >
      {/* Ghost catalog number — museum-plaque feel */}
      <span className="pointer-events-none absolute -left-2 -top-4 font-display text-8xl font-bold text-white/[0.025] transition-colors duration-500 group-hover:text-archive-gold/[0.06]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-archive-gold/0 via-archive-gold/0 to-archive-gold/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-archive-gold/[0.05]" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-archive-gold/25 text-archive-gold transition-all duration-500 group-hover:scale-110 group-hover:border-archive-gold/50 group-hover:shadow-[0_0_20px_-4px_rgba(201,169,97,0.5)]">
        <Icon size={20} strokeWidth={1.5} />
      </div>

      <div className="relative">
        <h3 className="mb-1.5 font-display text-2xl tracking-tight text-archive-text">
          {data.label}
        </h3>
        <p className="font-body text-sm leading-relaxed text-archive-muted">
          {data.description}
        </p>
      </div>

      <div className="relative mt-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-archive-gold opacity-0 transition-all duration-300 group-hover:translate-x-[-4px] group-hover:opacity-100">
        افتح ←
      </div>
    </motion.button>
  );
}
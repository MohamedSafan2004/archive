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
        "transition-colors duration-500 hover:border-archive-gold/30"
      )}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-archive-gold/0 via-archive-gold/0 to-archive-gold/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-archive-gold/[0.04]" />

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-archive-gold/20 text-archive-gold transition-transform duration-500 group-hover:scale-110">
        <Icon size={20} strokeWidth={1.5} />
      </div>

      <div>
        <h3 className="mb-1 font-display text-xl text-archive-text">{data.label}</h3>
        <p className="font-body text-sm text-archive-muted">{data.description}</p>
      </div>

      <div className="mt-2 font-mono text-xs uppercase tracking-wider text-archive-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        افتح ←
      </div>
    </motion.button>
  );
}

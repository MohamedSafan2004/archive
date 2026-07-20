"use client";

import { useLenis } from "@/hooks/useLenis";
import { useExperienceStore } from "@/store/experienceStore";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { PasswordGate } from "@/components/gate/PasswordGate";
import { ArchiveDashboard } from "@/components/dashboard/ArchiveDashboard";
import { MemoryTimeline } from "@/components/timeline/MemoryTimeline";
import { Gallery } from "@/components/gallery/Gallery";
import { TypedLetter } from "@/components/ending/TypedLetter";

export default function Home() {
  const stage = useExperienceStore((s) => s.stage);

  // Smooth scroll only once we're past the gate — no need on static intro screens
  useLenis(stage === "dashboard" || stage === "timeline" || stage === "gallery" || stage === "ending");

  return (
    <main className="relative">
      <LoadingScreen />
      <PasswordGate />
      <ArchiveDashboard />
      <MemoryTimeline />
      <Gallery />
      <TypedLetter />
    </main>
  );
}
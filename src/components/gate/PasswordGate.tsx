"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GATE_QUESTIONS } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE, DURATION } from "@/lib/constants";
import { QuestionCard } from "./QuestionCard";

export function PasswordGate() {
  const stage = useExperienceStore((s) => s.stage);
  const unlockGate = useExperienceStore((s) => s.unlockGate);
  const setStage = useExperienceStore((s) => s.setStage);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleCorrect() {
    if (currentIndex < GATE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      unlockGate();
      setTimeout(() => setStage("dashboard"), 1000);
    }
  }

  if (stage !== "gate") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: DURATION.cinematic, ease: EASE.smooth },
      }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-archive-bg px-6"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-archive-gold/[0.03] blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-archive-gold/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE.smooth }}
        className="relative mb-10 text-center"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-archive-gold">
          أرشيف سري
        </p>
        <h1 className="font-display text-3xl text-archive-text md:text-4xl">
          محتاج تثبت إنك أنت
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          {GATE_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "w-8 bg-archive-gold"
                  : i < currentIndex
                  ? "w-4 bg-archive-gold/50"
                  : "w-4 bg-archive-border"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Question cards */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={GATE_QUESTIONS[currentIndex].id}
          question={GATE_QUESTIONS[currentIndex]}
          onCorrect={handleCorrect}
        />
      </AnimatePresence>
    </motion.div>
  );
}

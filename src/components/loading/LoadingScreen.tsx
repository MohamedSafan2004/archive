"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { gsap } from "@/hooks/useGSAP";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE, DURATION } from "@/lib/constants";

const LOADING_LABELS = [
  "جاري فتح الأرشيف",
  "استرجاع الذكريات",
  "تجهيز اللحظات",
  "شبه خلصنا",
];

export function LoadingScreen() {
  const stage = useExperienceStore((s) => s.stage);
  const loadingProgress = useExperienceStore((s) => s.loadingProgress);
  const setLoadingProgress = useExperienceStore((s) => s.setLoadingProgress);
  const setStage = useExperienceStore((s) => s.setStage);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (stage !== "loading") return;

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: 100,
      duration: 3.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setLoadingProgress(Math.floor(counter.value));
      },
      onComplete: () => {
        setTimeout(() => setStage("gate"), 500);
      },
    });

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const currentLabel =
    LOADING_LABELS[Math.min(Math.floor(loadingProgress / 25), LOADING_LABELS.length - 1)];

  return (
    <AnimatePresence>
      {stage === "loading" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-archive-bg"
          exit={{
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: DURATION.cinematic, ease: EASE.smooth },
          }}
        >
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-archive-gold/5 blur-[120px]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE.smooth }}
            className="relative mb-12 flex h-20 w-20 items-center justify-center rounded-full border border-archive-gold/30"
          >
            <div className="h-2 w-2 rounded-full bg-archive-gold" />
            <motion.div
              className="absolute inset-0 rounded-full border border-archive-gold/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          {/* Progress number */}
          <div className="relative mb-4 font-display text-6xl font-light tabular-nums text-archive-text md:text-7xl">
            {loadingProgress}
            <span className="text-2xl text-archive-gold">%</span>
          </div>

          {/* Progress bar */}
          <div className="relative h-[1px] w-64 overflow-hidden bg-archive-border md:w-80">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 bg-archive-gold transition-all duration-100 ease-linear"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Status label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-archive-muted"
            >
              {currentLabel}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

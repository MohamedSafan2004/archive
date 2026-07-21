"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { LETTER_CONTENT } from "@/lib/content";
import { useExperienceStore } from "@/store/experienceStore";
import { EASE } from "@/lib/constants";

const TYPE_SPEED_MS = 28;

function useTypewriter(text: string, active: boolean, startDelay: number = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    indexRef.current = 0;
    setDisplayed("");
    setIsDone(false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, TYPE_SPEED_MS);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active]);

  return { displayed, isDone };
}

function TypedParagraph({
  text,
  active,
  delay,
  onDone,
}: {
  text: string;
  active: boolean;
  delay: number;
  onDone?: () => void;
}) {
  const { displayed, isDone } = useTypewriter(text, active, delay);

  useEffect(() => {
    if (isDone) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <p className="font-body text-lg leading-relaxed text-archive-text md:text-xl">
      {displayed}
      {active && !isDone && (
        <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-archive-gold align-middle" />
      )}
    </p>
  );
}

export function TypedLetter() {
  const stage = useExperienceStore((s) => s.stage);
  const markEndingSeen = useExperienceStore((s) => s.markEndingSeen);
  const [activeParagraph, setActiveParagraph] = useState(-1);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    if (stage === "ending") {
      const timeout = setTimeout(() => setActiveParagraph(0), 600);
      return () => clearTimeout(timeout);
    }
  }, [stage]);

  if (stage !== "ending") return null;

  function handleParagraphDone(index: number) {
    if (index < LETTER_CONTENT.paragraphs.length - 1) {
      setActiveParagraph(index + 1);
    } else {
      setTimeout(() => {
        setShowSignature(true);
        markEndingSeen();
      }, 400);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE.smooth }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-archive-gold/[0.05] blur-[150px]" />
        {/* Soft light beam from above, like a single spotlight on the letter */}
        <div
          className="absolute left-1/2 top-0 h-full w-[400px] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(201,169,97,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE.smooth }}
        className="glass-panel relative mx-auto w-full max-w-2xl rounded-2xl px-8 py-12 text-right md:px-14 md:py-16"
        dir="rtl"
      >
        {/* Corner ornament — museum letter / certificate feel */}
        <div className="absolute right-6 top-6 h-8 w-8 border-r border-t border-archive-gold/20 md:right-8 md:top-8" />
        <div className="absolute left-6 bottom-6 h-8 w-8 border-b border-l border-archive-gold/20 md:left-8 md:bottom-8" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8 font-display text-3xl tracking-tight text-archive-gold md:text-4xl"
        >
          {LETTER_CONTENT.greeting}
        </motion.p>

        <div className="space-y-6">
          {LETTER_CONTENT.paragraphs.map((paragraph, i) => (
            <div key={i} className={activeParagraph >= i ? "block" : "hidden"}>
              <TypedParagraph
                text={paragraph}
                active={activeParagraph === i}
                delay={0}
                onDone={() => handleParagraphDone(i)}
              />
            </div>
          ))}
        </div>

        {showSignature && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.smooth }}
            className="mt-12 border-t border-archive-border pt-6"
          >
            <p className="font-display text-xl text-archive-gold">
              — {LETTER_CONTENT.signature}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { GateQuestion } from "@/types";
import { normalizeAnswer, cn } from "@/lib/utils";
import { GATE_MAX_ATTEMPTS_BEFORE_HINT } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface QuestionCardProps {
  question: GateQuestion;
  onCorrect: () => void;
}

export function QuestionCard({ question, onCorrect }: QuestionCardProps) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeAnswer(value);
    const isCorrect = question.acceptedAnswers.some(
      (ans) => normalizeAnswer(ans) === normalized
    );

    if (isCorrect) {
      onCorrect();
    } else {
      setAttempts((prev) => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }

  const showHint = attempts >= GATE_MAX_ATTEMPTS_BEFORE_HINT && question.hint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
      }}
      transition={{ duration: isShaking ? 0.4 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel w-full max-w-md rounded-2xl p-8 md:p-10"
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-archive-gold">
        سؤال التحقق
      </p>
      <h2 className="mb-8 font-display text-2xl leading-relaxed text-archive-text md:text-3xl">
        {question.question}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          dir="rtl"
          className={cn(
            "w-full rounded-xl border border-archive-border bg-white/[0.02] px-5 py-4",
            "font-body text-archive-text placeholder:text-archive-muted/60",
            "outline-none transition-all duration-300",
            "focus:border-archive-gold/50 focus:bg-white/[0.04]"
          )}
          autoFocus
        />

        {showHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="font-body text-sm text-archive-muted"
          >
            💡 {question.hint}
          </motion.p>
        )}

        <MagneticButton type="submit" className="w-full" data-cursor="hover">
          تأكيد
        </MagneticButton>
      </form>
    </motion.div>
  );
}

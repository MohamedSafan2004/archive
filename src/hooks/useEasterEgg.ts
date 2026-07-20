"use client";

import { useEffect, useRef, useCallback } from "react";
import { KONAMI_SEQUENCE } from "@/lib/constants";
import { useExperienceStore } from "@/store/experienceStore";
import type { EasterEgg } from "@/types";

/**
 * Listens for the Konami code sequence globally and unlocks the
 * associated easter egg when matched.
 */
export function useKonamiCode(egg: EasterEgg | undefined) {
  const unlockEasterEgg = useExperienceStore((s) => s.unlockEasterEgg);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const positionRef = useRef(0);

  useEffect(() => {
    if (!egg) return;

    function handleKeyDown(e: KeyboardEvent) {
      const expected = KONAMI_SEQUENCE[positionRef.current];
      const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (pressed === expected) {
        positionRef.current += 1;
        if (positionRef.current === KONAMI_SEQUENCE.length) {
          unlockEasterEgg(egg!.id);
          openSecretMemory(egg!.id);
          positionRef.current = 0;
        }
      } else {
        positionRef.current = pressed === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [egg, unlockEasterEgg, openSecretMemory]);
}

/**
 * Returns a click handler that unlocks an easter egg after N clicks
 * on a target element.
 */
export function useClickCountEgg(egg: EasterEgg | undefined) {
  const unlockEasterEgg = useExperienceStore((s) => s.unlockEasterEgg);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const countRef = useRef(0);

  const handleClick = useCallback(() => {
    if (!egg) return;
    const required = egg.triggerConfig?.requiredCount ?? 5;
    countRef.current += 1;

    if (countRef.current >= required) {
      unlockEasterEgg(egg.id);
      openSecretMemory(egg.id);
      countRef.current = 0;
    }
  }, [egg, unlockEasterEgg, openSecretMemory]);

  return handleClick;
}

/**
 * Returns handlers for a press-and-hold interaction that unlocks
 * an easter egg after holding for the configured duration.
 */
export function useHoverHoldEgg(egg: EasterEgg | undefined) {
  const unlockEasterEgg = useExperienceStore((s) => s.unlockEasterEgg);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPressStart = useCallback(() => {
    if (!egg) return;
    const holdMs = egg.triggerConfig?.holdMs ?? 2000;
    timeoutRef.current = setTimeout(() => {
      unlockEasterEgg(egg.id);
      openSecretMemory(egg.id);
    }, holdMs);
  }, [egg, unlockEasterEgg, openSecretMemory]);

  const onPressEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { onPressStart, onPressEnd };
}

"use client";

import { useEffect, useRef } from "react";
import { useExperienceStore } from "@/store/experienceStore";
import type { EasterEgg } from "@/types";

const IDLE_THRESHOLD_MS = 45_000;

/**
 * Fires the given easter egg once the user has gone completely idle
 * (no mouse move, scroll, click, or keypress) for IDLE_THRESHOLD_MS.
 * Resets on any activity. Only fires once per session.
 */
export function useIdleEgg(egg: EasterEgg | undefined) {
  const unlockEasterEgg = useExperienceStore((s) => s.unlockEasterEgg);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!egg) return;

    function resetTimer() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hasFiredRef.current) return;

      timeoutRef.current = setTimeout(() => {
        hasFiredRef.current = true;
        unlockEasterEgg(egg!.id);
        openSecretMemory(egg!.id);
      }, IDLE_THRESHOLD_MS);
    }

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "scroll",
      "keydown",
      "click",
      "touchstart",
    ];

    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [egg, unlockEasterEgg, openSecretMemory]);
}

/**
 * Fires the given easter egg the first time the user types the target
 * name anywhere on the page — including inside a text input, since
 * keydown bubbles regardless of focused element.
 */
export function useNameTypedEgg(egg: EasterEgg | undefined, targetName: string) {
  const unlockEasterEgg = useExperienceStore((s) => s.unlockEasterEgg);
  const openSecretMemory = useExperienceStore((s) => s.openSecretMemory);
  const bufferRef = useRef("");
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!egg) return;
    const normalizedTarget = targetName.trim();

    function handleKeyDown(e: KeyboardEvent) {
      if (hasFiredRef.current) return;
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key).slice(-normalizedTarget.length * 2);

      if (bufferRef.current.includes(normalizedTarget)) {
        hasFiredRef.current = true;
        unlockEasterEgg(egg!.id);
        openSecretMemory(egg!.id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [egg, targetName, unlockEasterEgg, openSecretMemory]);
}

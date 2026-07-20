"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { LENIS_CONFIG } from "@/lib/constants";

/**
 * Initializes Lenis smooth scroll and syncs it with requestAnimationFrame.
 * Also exposes the Lenis instance via ref for GSAP ScrollTrigger sync.
 */
export function useLenis(enabled: boolean = true) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis(LENIS_CONFIG);
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}

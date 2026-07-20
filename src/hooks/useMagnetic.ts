"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/hooks/useGSAP";
import { isTouchDevice } from "@/lib/utils";

interface UseMagneticOptions {
  strength?: number; // 0-1, how much the element follows the cursor
  scale?: number; // hover scale multiplier
}

/**
 * Applies a magnetic "pull toward cursor" effect on hover.
 * Disabled automatically on touch devices.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.35,
  scale = 1.05,
}: UseMagneticOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        scale,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    function handleMouseLeave() {
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, scale]);

  return ref;
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";
import { isTouchDevice } from "@/lib/utils";

/**
 * Renders a soft radial glow that follows the cursor with a
 * slight lag, adding depth and dynamic lighting to dark sections.
 */
export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouchDevice()) return;
    const glow = glowRef.current;
    if (!glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    function handleMouseMove(e: MouseEvent) {
      quickX(e.clientX);
      quickY(e.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isTouchDevice()) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(201,169,97,0.12) 0%, rgba(201,169,97,0.04) 40%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

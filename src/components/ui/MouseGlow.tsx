"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGSAP";
import { isTouchDevice } from "@/lib/utils";

/**
 * Renders a soft radial glow that follows the cursor with a
 * slight lag, adding depth and dynamic lighting to dark sections.
 *
 * Fix: previously the glow started pinned at (0,0) and only moved
 * on the first mousemove event, causing a visible "jump"/flash from
 * the corner combined with mix-blend-screen (looked like a glitch).
 * Now it starts hidden (opacity 0) and fades in only once we have a
 * real cursor position, then follows smoothly with no snapping.
 */
export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const hasPositionedRef = useRef(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const glow = glowRef.current;
    if (!glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });

    function handleMouseMove(e: MouseEvent) {
      if (!hasPositionedRef.current) {
        // First real cursor position: snap instantly (no tween) so there's
        // no visible travel from the corner, then fade the glow in.
        gsap.set(glow, { x: e.clientX, y: e.clientY });
        gsap.to(glow, { opacity: 1, duration: 0.6, ease: "power2.out" });
        hasPositionedRef.current = true;
        return;
      }
      quickX(e.clientX);
      quickY(e.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(201,169,97,0.12) 0%, rgba(201,169,97,0.04) 40%, transparent 70%)",
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    />
  );
}
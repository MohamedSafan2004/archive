"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGSAP";
import { isTouchDevice } from "@/lib/utils";

/**
 * Small dot cursor that scales up over interactive elements
 * (anything with data-cursor="hover").
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const dot = dotRef.current;
    if (!dot) return;

    const quickX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power2.out" });
    const quickY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power2.out" });

    function handleMouseMove(e: MouseEvent) {
      quickX(e.clientX);
      quickY(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('[data-cursor="hover"]'));
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[70] -translate-x-1/2 -translate-y-1/2 rounded-full border border-archive-gold/60 transition-all duration-300 ease-out"
      style={{
        width: isHovering ? 48 : 10,
        height: isHovering ? 48 : 10,
        backgroundColor: isHovering ? "rgba(201,169,97,0.1)" : "rgba(201,169,97,0.8)",
      }}
      aria-hidden="true"
    />
  );
}

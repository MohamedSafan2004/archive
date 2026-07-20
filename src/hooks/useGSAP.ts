"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Runs a GSAP animation callback scoped to a container ref.
 * Automatically creates a gsap.context() for cleanup on unmount,
 * so all tweens/ScrollTriggers created inside `callback` are reverted.
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
  scopeRef?: RefObject<HTMLElement>
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx);
    }, scopeRef?.current ?? undefined);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}

export { gsap, ScrollTrigger };

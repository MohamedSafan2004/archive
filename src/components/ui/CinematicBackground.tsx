"use client";

/**
 * The signature atmospheric layer for the whole experience.
 *
 * PERFORMANCE NOTE: the previous version animated `transform: scale()` on
 * elements with a large `blur-[160px]` filter. Animating a scaled, blurred
 * element forces the browser to recompute the blur kernel every frame
 * (blur is expensive relative to plain transforms), which was the main
 * cause of the sluggishness — it ran constantly, on every page, competing
 * with everything else for GPU time.
 *
 * Fix: the blurred glow elements are now static (blur computed once,
 * cached as a GPU layer) — no animation on the blur itself. Only cheap,
 * non-blurred elements (the thin light streaks) animate, and only via
 * `transform`, which is compositor-only and does not trigger repaint.
 * Visual result is effectively identical; cost is now negligible.
 */
export function CinematicBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-archive-bg"
      aria-hidden="true"
    >
      {/* Base glow — static, GPU-cached, no per-frame blur recompute */}
      <div
        className="absolute left-[20%] top-[15%] h-[900px] w-[900px] rounded-full opacity-[0.08] blur-[160px]"
        style={{
          background: "radial-gradient(circle, #c9a961 0%, transparent 65%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Secondary rust/burgundy glow — static */}
      <div
        className="absolute bottom-[10%] right-[15%] h-[700px] w-[700px] rounded-full opacity-[0.055] blur-[140px]"
        style={{
          background: "radial-gradient(circle, #8a3b2e 0%, transparent 65%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Drifting light streak #1 — cheap transform-only animation, no blur */}
      <div
        className="absolute -left-1/4 top-1/3 h-[2px] w-[150%] opacity-[0.04] will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c9a961 50%, transparent 100%)",
          animation: "lightDrift 26s linear infinite",
        }}
      />

      {/* Drifting light streak #2 */}
      <div
        className="absolute -left-1/4 top-2/3 h-[1px] w-[150%] opacity-[0.03] will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #e8c983 50%, transparent 100%)",
          animation: "lightDrift2 34s linear infinite",
        }}
      />

      {/* Edge vignette for depth — static gradient, zero cost */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Cinematic letterbox fade — static gradient, zero cost */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes lightDrift {
          0% {
            transform: rotate(-8deg) translateX(-5%);
          }
          100% {
            transform: rotate(-8deg) translateX(5%);
          }
        }

        @keyframes lightDrift2 {
          0% {
            transform: rotate(6deg) translateX(5%);
          }
          100% {
            transform: rotate(6deg) translateX(-5%);
          }
        }
      `}</style>
    </div>
  );
}
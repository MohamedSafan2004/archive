"use client";

/**
 * The signature atmospheric layer for the whole experience.
 * Replaces a flat #050505 void with:
 * 1. A slow-breathing radial gradient (like distant light through fog)
 * 2. Two soft "light bleed" streaks that drift very slowly, evoking
 *    streetlight through a window at night — cinematic, not decorative
 * 3. A subtle vertical vignette for depth at the edges
 *
 * Fixed and behind everything (z-index 0), pointer-events disabled.
 * Pure CSS animation — no JS per-frame cost, safe to run everywhere.
 */
export function CinematicBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-archive-bg"
      aria-hidden="true"
    >
      {/* Base breathing glow, off-center for asymmetry */}
      <div
        className="absolute left-[20%] top-[15%] h-[900px] w-[900px] rounded-full opacity-[0.07] blur-[160px]"
        style={{
          background: "radial-gradient(circle, #c9a961 0%, transparent 65%)",
          animation: "cinematicBreathe 14s ease-in-out infinite",
        }}
      />

      {/* Secondary rust/burgundy glow, lower-right, slower and dimmer */}
      <div
        className="absolute bottom-[10%] right-[15%] h-[700px] w-[700px] rounded-full opacity-[0.05] blur-[140px]"
        style={{
          background: "radial-gradient(circle, #8a3b2e 0%, transparent 65%)",
          animation: "cinematicBreathe 18s ease-in-out infinite reverse",
        }}
      />

      {/* Drifting light streak #1 */}
      <div
        className="absolute -left-1/4 top-1/3 h-[2px] w-[150%] opacity-[0.04]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c9a961 50%, transparent 100%)",
          transform: "rotate(-8deg)",
          animation: "lightDrift 22s linear infinite",
        }}
      />

      {/* Drifting light streak #2 */}
      <div
        className="absolute -left-1/4 top-2/3 h-[1px] w-[150%] opacity-[0.03]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #e8c983 50%, transparent 100%)",
          transform: "rotate(6deg)",
          animation: "lightDrift 30s linear infinite reverse",
        }}
      />

      {/* Edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Very subtle top-to-bottom fade for cinematic letterbox feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes cinematicBreathe {
          0%,
          100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.07;
          }
          50% {
            transform: scale(1.15) translate(3%, -2%);
            opacity: 0.1;
          }
        }

        @keyframes lightDrift {
          0% {
            transform: rotate(-8deg) translateX(-5%);
          }
          100% {
            transform: rotate(-8deg) translateX(5%);
          }
        }
      `}</style>
    </div>
  );
}
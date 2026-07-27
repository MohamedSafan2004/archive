"use client";

/**
 * The atmospheric background layer for the whole experience.
 *
 * Fully static — zero animation, zero JS, zero per-frame cost. Just a
 * few pre-computed CSS gradients that paint once and never repaint.
 * This is as cheap as a background layer can possibly be while still
 * giving the archive a moody, cinematic depth instead of flat black.
 */
export function CinematicBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-archive-bg"
      aria-hidden="true"
    >
      {/* Soft warm glow, upper-left — static */}
      <div
        className="absolute left-[10%] top-[-10%] h-[800px] w-[800px] rounded-full opacity-[0.06] blur-[160px]"
        style={{
          background: "radial-gradient(circle, #c9a961 0%, transparent 65%)",
        }}
      />

      {/* Soft rust glow, lower-right — static */}
      <div
        className="absolute bottom-[-10%] right-[5%] h-[700px] w-[700px] rounded-full opacity-[0.04] blur-[150px]"
        style={{
          background: "radial-gradient(circle, #8a3b2e 0%, transparent 65%)",
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Cinematic top/bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}

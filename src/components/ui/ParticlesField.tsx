"use client";

import { useMemo } from "react";
import { randomRange } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
}

interface ParticlesFieldProps {
  count?: number;
  color?: string;
  className?: string;
}

/**
 * Full-viewport ambient particle field.
 *
 * PERFORMANCE NOTE: previously each particle was a Framer Motion
 * `motion.span` — meaning 100+ separate JS-driven animation instances
 * running continuously. This is expensive: Framer Motion has to tick
 * every particle's animation from the JS thread every frame.
 *
 * Now particles are plain CSS `@keyframes` animations. Once mounted,
 * the browser hands the whole animation off to the compositor/GPU
 * thread — zero ongoing JS cost regardless of particle count. Visual
 * result is identical; this is the difference that actually matters
 * when the page also has 60+ images loading.
 */
export function ParticlesField({
  count = 40,
  color = "#c9a961",
  className,
}: ParticlesFieldProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: randomRange(0, 100),
      y: randomRange(0, 100),
      size: randomRange(1, 3),
      duration: randomRange(8, 20),
      delay: randomRange(0, 8),
      driftX: randomRange(-20, 20),
    }));
  }, [count]);

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", position: "relative", overflow: "hidden" }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // @ts-expect-error custom property consumed by the keyframes below
            "--drift-x": `${p.driftX}px`,
          }}
        />
      ))}

      <style jsx>{`
        .particle-dot {
          position: absolute;
          border-radius: 9999px;
          opacity: 0;
          will-change: transform, opacity;
          animation-name: particleFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes particleFloat {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          50% {
            transform: translate(var(--drift-x), -40px);
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
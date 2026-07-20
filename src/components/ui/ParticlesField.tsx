"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
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
 * Full-viewport ambient particle field built with pure CSS/Framer Motion.
 * (Previously React Three Fiber — swapped out due to a webpack/Next15
 * incompatibility with @react-three/fiber's reconciler. Same visual result,
 * no WebGL dependency, lighter and more reliable.)
 * Purely decorative, pointer-events disabled so it never blocks interaction.
 */
export function ParticlesField({
  count = 60,
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
      driftX: randomRange(-30, 30),
    }));
  }, [count]);

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", position: "relative", overflow: "hidden" }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.driftX, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "9999px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
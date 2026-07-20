// ============================================
// EASING CURVES (shared across Framer Motion + GSAP)
// ============================================
export const EASE = {
  smooth: [0.22, 1, 0.36, 1] as const, // signature "cinematic" ease-out
  snappy: [0.65, 0, 0.35, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
  gsapSmooth: "power3.out",
  gsapSnappy: "power2.inOut",
} as const;

// ============================================
// DURATIONS (seconds, for Framer Motion)
// ============================================
export const DURATION = {
  instant: 0.2,
  fast: 0.4,
  base: 0.6,
  slow: 1,
  cinematic: 1.6,
  stageTransition: 1.2,
} as const;

// ============================================
// BREAKPOINTS (px)
// ============================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// ============================================
// LENIS CONFIG
// ============================================
export const LENIS_CONFIG = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
} as const;

// ============================================
// AUDIO
// ============================================
export const AUDIO_FADE_MS = 1500;
export const DEFAULT_VOLUME = 0.4;

// ============================================
// EASTER EGG CONFIG
// ============================================
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// ============================================
// GATE
// ============================================
export const GATE_MAX_ATTEMPTS_BEFORE_HINT = 2;

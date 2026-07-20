// ============================================
// EXPERIENCE STAGES
// ============================================
export type ExperienceStage =
  | "loading"
  | "gate"
  | "dashboard"
  | "timeline"
  | "gallery"
  | "ending";

// ============================================
// PASSWORD GATE
// ============================================
export interface GateQuestion {
  id: string;
  question: string;
  acceptedAnswers: string[]; // lowercase, trimmed comparison
  hint?: string;
}

// ============================================
// MEMORY TIMELINE
// ============================================
export type MemoryTransitionVariant = "reveal-slide" | "mask-wipe" | "parallax-stack";

export interface MemoryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface MemoryEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  photos: MemoryPhoto[];
  transitionVariant: MemoryTransitionVariant;
  isSecret?: boolean; // unlocked via easter egg
}

// ============================================
// VHS PLAYER
// ============================================
export interface VHSVideo {
  id: string;
  src: string;
  poster: string;
  title: string;
  dateLabel: string; // e.g. "REC. SUMMER '19"
}

// ============================================
// AUDIO
// ============================================
export interface AudioTrack {
  id: string;
  src: string;
  title: string;
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: AudioTrack | null;
}

// ============================================
// EASTER EGGS
// ============================================
export type EasterEggTrigger = "click-sequence" | "hover-hold" | "konami" | "click-count";

export interface EasterEgg {
  id: string;
  trigger: EasterEggTrigger;
  triggerConfig?: {
    targetId?: string;
    requiredCount?: number;
    holdMs?: number;
  };
  unlockedMemoryId?: string; // links to a secret MemoryEntry
  title: string;
  content: string;
  isUnlocked: boolean;
}

// ============================================
// GALLERY (museum-style photo collection, separate from timeline)
// ============================================
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

// ============================================
// ARCHIVE DASHBOARD
// ============================================
export interface ArchiveCardData {
  id: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  targetStage?: ExperienceStage;
  targetSectionId?: string;
}

// ============================================
// ENDING / LETTER
// ============================================
export interface LetterContent {
  greeting: string;
  paragraphs: string[];
  signature: string;
}

// ============================================
// STORE
// ============================================
export interface ExperienceStoreState {
  stage: ExperienceStage;
  setStage: (stage: ExperienceStage) => void;

  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;

  isGateUnlocked: boolean;
  unlockGate: () => void;

  unlockedEasterEggs: string[];
  unlockEasterEgg: (id: string) => void;

  audio: AudioState;
  setAudioPlaying: (isPlaying: boolean) => void;
  setAudioMuted: (isMuted: boolean) => void;
  setAudioVolume: (volume: number) => void;

  activeSecretMemoryId: string | null;
  openSecretMemory: (id: string) => void;
  closeSecretMemory: () => void;

  hasSeenEnding: boolean;
  markEndingSeen: () => void;
}
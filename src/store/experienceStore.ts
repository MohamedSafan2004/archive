import { create } from "zustand";
import type { ExperienceStoreState } from "@/types";
import { DEFAULT_VOLUME } from "@/lib/constants";

export const useExperienceStore = create<ExperienceStoreState>((set, get) => ({
  // ============================================
  // STAGE
  // ============================================
  stage: "loading",
  setStage: (stage) => set({ stage }),

  // ============================================
  // LOADING
  // ============================================
  loadingProgress: 0,
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),

  // ============================================
  // GATE
  // ============================================
  isGateUnlocked: false,
  unlockGate: () => set({ isGateUnlocked: true }),

  // ============================================
  // EASTER EGGS
  // ============================================
  unlockedEasterEggs: [],
  unlockEasterEgg: (id) => {
    const current = get().unlockedEasterEggs;
    if (current.includes(id)) return;
    set({ unlockedEasterEggs: [...current, id] });
  },

  // ============================================
  // AUDIO
  // ============================================
  audio: {
    isPlaying: false,
    isMuted: false,
    volume: DEFAULT_VOLUME,
    currentTrack: null,
  },
  setAudioPlaying: (isPlaying) =>
    set((state) => ({ audio: { ...state.audio, isPlaying } })),
  setAudioMuted: (isMuted) =>
    set((state) => ({ audio: { ...state.audio, isMuted } })),
  setAudioVolume: (volume) =>
    set((state) => ({ audio: { ...state.audio, volume } })),

  // ============================================
  // SECRET MEMORY MODAL
  // ============================================
  activeSecretMemoryId: null,
  openSecretMemory: (id) => set({ activeSecretMemoryId: id }),
  closeSecretMemory: () => set({ activeSecretMemoryId: null }),

  // ============================================
  // ENDING
  // ============================================
  hasSeenEnding: false,
  markEndingSeen: () => set({ hasSeenEnding: true }),
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExperienceStoreState } from "@/types";
import { DEFAULT_VOLUME } from "@/lib/constants";

/**
 * Fields that survive a page refresh, stored in localStorage under
 * "archive-experience-storage". Everything else (stage, loadingProgress,
 * audio playback state, the open secret-memory modal) intentionally does
 * NOT persist -- those are moment-to-moment UI state, and re-running the
 * loading/intro animation on a fresh visit is part of the experience.
 *
 * What DOES persist is exactly the stuff that would be genuinely annoying
 * to lose: once someone has solved the gate questions once, a refresh (or
 * closing and reopening the tab) shouldn't send them back to the
 * inside-joke quiz every time.
 */
interface PersistedState {
  isGateUnlocked: boolean;
  unlockedEasterEggs: string[];
  hasSeenEnding: boolean;
}

export const useExperienceStore = create<ExperienceStoreState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "archive-experience-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedState => ({
        isGateUnlocked: state.isGateUnlocked,
        unlockedEasterEggs: state.unlockedEasterEggs,
        hasSeenEnding: state.hasSeenEnding,
      }),
    }
  )
);

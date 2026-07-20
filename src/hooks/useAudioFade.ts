"use client";

import { useCallback, useRef } from "react";
import { Howl } from "howler";
import { AUDIO_FADE_MS } from "@/lib/constants";

/**
 * Provides fade-in / fade-out control over a Howler sound instance.
 */
export function useAudioFade(soundRef: React.RefObject<Howl | null>) {
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fadeIn = useCallback(
    (targetVolume: number, duration: number = AUDIO_FADE_MS) => {
      const sound = soundRef.current;
      if (!sound) return;

      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

      if (!sound.playing()) {
        sound.volume(0);
        sound.play();
      }
      sound.fade(sound.volume(), targetVolume, duration);
    },
    [soundRef]
  );

  const fadeOut = useCallback(
    (duration: number = AUDIO_FADE_MS, stopAfter: boolean = false) => {
      const sound = soundRef.current;
      if (!sound) return;

      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

      sound.fade(sound.volume(), 0, duration);

      if (stopAfter) {
        fadeTimeoutRef.current = setTimeout(() => {
          sound.stop();
        }, duration);
      }
    },
    [soundRef]
  );

  return { fadeIn, fadeOut };
}

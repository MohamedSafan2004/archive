"use client";

import { useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import { Howl } from "howler";
import { useExperienceStore } from "@/store/experienceStore";
import { useAudioFade } from "@/hooks/useAudioFade";
import { AUDIO_TRACKS } from "@/lib/content";
import { DEFAULT_VOLUME } from "@/lib/constants";

interface AudioContextValue {
  fadeIn: () => void;
  fadeOut: () => void;
}

const AudioContextInternal = createContext<AudioContextValue | null>(null);

export function useAudioContext() {
  const ctx = useContext(AudioContextInternal);
  if (!ctx) throw new Error("useAudioContext must be used within AudioProvider");
  return ctx;
}

interface AudioProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app and owns the single Howler instance for the
 * ambient background track. Handles fade in/out based on
 * play state and mute state from the store.
 */
export function AudioProvider({ children }: AudioProviderProps) {
  const soundRef = useRef<Howl | null>(null);
  const isPlaying = useExperienceStore((s) => s.audio.isPlaying);
  const isMuted = useExperienceStore((s) => s.audio.isMuted);
  const volume = useExperienceStore((s) => s.audio.volume);
  const stage = useExperienceStore((s) => s.stage);

  const { fadeIn, fadeOut } = useAudioFade(soundRef);

  useEffect(() => {
    const track = AUDIO_TRACKS[0];
    if (!track) return;

    soundRef.current = new Howl({
      src: [track.src],
      loop: true,
      volume: 0,
      html5: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  // Auto-start ambient music once the gate is unlocked (dashboard onward)
  useEffect(() => {
    if (stage === "dashboard" || stage === "timeline" || stage === "ending") {
      if (!isMuted) fadeIn(volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (isMuted) {
      fadeOut(800);
    } else if (stage !== "loading" && stage !== "gate") {
      fadeIn(volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  useEffect(() => {
    soundRef.current?.volume(volume);
  }, [volume]);

  return (
    <AudioContextInternal.Provider value={{ fadeIn: () => fadeIn(volume), fadeOut: () => fadeOut() }}>
      {children}
    </AudioContextInternal.Provider>
  );
}

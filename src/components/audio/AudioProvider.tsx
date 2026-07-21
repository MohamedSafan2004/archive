"use client";

import { useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import { Howl } from "howler";
import { useExperienceStore } from "@/store/experienceStore";
import { useAudioFade } from "@/hooks/useAudioFade";
import { AUDIO_TRACKS } from "@/lib/content";

interface AudioContextValue {
  fadeIn: () => void;
  fadeOut: () => void;
  /**
   * Starts ambient playback immediately. Call this directly inside a
   * user-triggered click handler (not after a setTimeout or state change)
   * so browsers' autoplay policies treat it as a genuine user gesture
   * and don't silently block it.
   */
  startPlayback: () => void;
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
  const isMuted = useExperienceStore((s) => s.audio.isMuted);
  const volume = useExperienceStore((s) => s.audio.volume);
  const stage = useExperienceStore((s) => s.stage);
  const hasStartedRef = useRef(false);

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

  function startPlayback() {
    if (hasStartedRef.current || isMuted) return;
    hasStartedRef.current = true;
    fadeIn(volume);
  }

  // Fallback: if the user reaches dashboard/timeline/ending some other way
  // (e.g. navigating back), make sure playback is running.
  useEffect(() => {
    if (
      !hasStartedRef.current &&
      (stage === "dashboard" || stage === "timeline" || stage === "gallery" || stage === "ending")
    ) {
      startPlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (isMuted) {
      fadeOut(800);
    } else if (hasStartedRef.current) {
      fadeIn(volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  useEffect(() => {
    soundRef.current?.volume(volume);
  }, [volume]);

  return (
    <AudioContextInternal.Provider
      value={{ fadeIn: () => fadeIn(volume), fadeOut: () => fadeOut(), startPlayback }}
    >
      {children}
    </AudioContextInternal.Provider>
  );
}
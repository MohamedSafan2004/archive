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
  // True once Howler has actually finished loading the audio file.
  // Some browsers silently refuse play() if called before the sound
  // is ready — even from inside a real click handler — so we track
  // this and retry once loading completes.
  const isLoadedRef = useRef(false);
  // If startPlayback() was called before the file finished loading,
  // remember that intent and fire it the moment load completes.
  const pendingStartRef = useRef(false);

  const { fadeIn, fadeOut } = useAudioFade(soundRef);

  useEffect(() => {
    const track = AUDIO_TRACKS[0];
    if (!track) return;

    const sound = new Howl({
      src: [track.src],
      loop: true,
      volume: 0,
      html5: true,
      onload: () => {
        isLoadedRef.current = true;
        if (pendingStartRef.current) {
          pendingStartRef.current = false;
          fadeIn(volume);
        }
      },
    });
    soundRef.current = sound;

    return () => {
      sound.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function attemptPlay() {
    if (isMuted) return;

    if (!isLoadedRef.current) {
      // Not ready yet — remember we tried, onload will pick it up.
      pendingStartRef.current = true;
      return;
    }
    fadeIn(volume);
  }

  function startPlayback() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    attemptPlay();
  }

  // Fallback: if the user reaches dashboard/timeline/ending some other way
  // (e.g. navigating back), make sure playback is running.
  useEffect(() => {
    if (
      !hasStartedRef.current &&
      (stage === "dashboard" || stage === "timeline" || stage === "gallery" || stage === "vhs" || stage === "ending")
    ) {
      startPlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Extra safety net: browsers can still block the very first play()
  // even when it looks like a valid gesture. If playback still isn't
  // running a moment after we tried, listen for the next real user
  // interaction anywhere on the page and retry then — this is what
  // makes music start on the *next* click/move instead of needing the
  // user to touch the volume slider specifically.
  useEffect(() => {
    if (!hasStartedRef.current || isMuted) return;

    const checkTimeout = setTimeout(() => {
      const sound = soundRef.current;
      if (!sound || sound.playing()) return;

      function retry() {
        attemptPlay();
        window.removeEventListener("pointerdown", retry);
        window.removeEventListener("keydown", retry);
      }

      window.addEventListener("pointerdown", retry, { once: true });
      window.addEventListener("keydown", retry, { once: true });
    }, 400);

    return () => clearTimeout(checkTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (isMuted) {
      fadeOut(800);
    } else if (hasStartedRef.current) {
      attemptPlay();
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

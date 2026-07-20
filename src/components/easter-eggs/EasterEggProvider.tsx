"use client";

import { type ReactNode, useEffect } from "react";
import { EASTER_EGGS } from "@/lib/content";
import { useKonamiCode, useClickCountEgg } from "@/hooks/useEasterEgg";

interface EasterEggProviderProps {
  children: ReactNode;
}

/**
 * Wires up all global easter egg listeners for the app.
 * Konami code works anywhere; the logo-click egg attaches
 * to #archive-logo once it exists in the DOM (dashboard stage).
 */
export function EasterEggProvider({ children }: EasterEggProviderProps) {
  const konamiEgg = EASTER_EGGS.find((e) => e.trigger === "konami");
  const logoClickEgg = EASTER_EGGS.find((e) => e.trigger === "click-count");

  useKonamiCode(konamiEgg);
  const handleLogoClick = useClickCountEgg(logoClickEgg);

  useEffect(() => {
    if (!logoClickEgg?.triggerConfig?.targetId) return;

    function attachListener() {
      const el = document.getElementById(logoClickEgg!.triggerConfig!.targetId!);
      if (el) {
        el.addEventListener("click", handleLogoClick);
        return () => el.removeEventListener("click", handleLogoClick);
      }
    }

    // Poll briefly since the target may mount after stage transitions
    const interval = setInterval(() => {
      const cleanup = attachListener();
      if (cleanup) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [logoClickEgg, handleLogoClick]);

  return <>{children}</>;
}

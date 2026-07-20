"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export function MagneticButton({
  children,
  variant = "primary",
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>({ strength: 0.4, scale: 1.08 });

  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5",
        "font-body text-sm tracking-wide transition-colors duration-300",
        "will-change-transform",
        variant === "primary" &&
          "bg-archive-gold text-archive-bg hover:bg-archive-gold/90",
        variant === "ghost" &&
          "border border-archive-border bg-archive-glass text-archive-text backdrop-blur-md hover:border-archive-gold/40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

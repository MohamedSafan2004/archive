"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE } from "@/lib/constants";

interface ScrollToTopButtonProps {
  /** Pixels scrolled before the button appears */
  threshold?: number;
}

/**
 * Fixed floating button (bottom-left, RTL-friendly) that appears once
 * the user has scrolled past `threshold` and smooth-scrolls back to the
 * top of the page on click. Meant for long, single-page sections like
 * the Gallery where scrolling all the way back up manually is tedious.
 */
export function ScrollToTopButton({ threshold = 600 }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > threshold);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          data-cursor="hover"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: EASE.smooth }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="glass-panel fixed bottom-8 left-6 z-[55] flex h-12 w-12 items-center justify-center rounded-full text-archive-text transition-colors duration-300 hover:border-archive-gold/40 hover:text-archive-gold"
          aria-label="ارجع لفوق"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

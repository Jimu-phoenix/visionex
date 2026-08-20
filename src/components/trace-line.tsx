"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The site's one signature element: a thin path with two nodes, echoing a
 * network diagram. Blue node = idle, orange node = active/destination.
 * Keep this to one instance per section — it's a signature, not a pattern
 * to sprinkle everywhere.
 */
export function TraceLine({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 220 420"
      fill="none"
      aria-hidden
      className={className}
    >
      <motion.path
        d="M20 0 C20 90, 110 100, 110 190 C110 280, 190 290, 190 380"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <circle cx="20" cy="0" r="3.5" fill="var(--color-signal-blue)" />
      <motion.circle
        cx="190"
        cy="380"
        r="4"
        fill="var(--color-signal-orange)"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.7 }}
      />
    </svg>
  );
}
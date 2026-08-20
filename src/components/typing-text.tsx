"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function TypingText({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1400,
  className,
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">(
    "typing"
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (display.length < current.length) {
        timeout = setTimeout(
          () => setDisplay(current.slice(0, display.length + 1)),
          typingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), pause / 2);
    } else {
      if (display.length > 0) {
        timeout = setTimeout(
          () => setDisplay(current.slice(0, display.length - 1)),
          deletingSpeed
        );
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [
    display,
    phase,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pause,
    prefersReducedMotion,
  ]);

  const text = prefersReducedMotion ? words[0] : display;

  return (
    <span className={className}>
      {text}
      <span
        aria-hidden
        className="ml-0.5 inline-block w-[2px] translate-y-[0.1em] bg-signal-orange align-middle animate-blink"
        style={{ height: "0.85em" }}
      />
    </span>
  );
}
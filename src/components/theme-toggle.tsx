"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const ORDER = ["light", "dark", "system"] as const;
type ThemeOption = (typeof ORDER)[number];

const ICONS: Record<ThemeOption, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeOption, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System theme",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: the resolved theme is only known client-side.
  useEffect(() => setMounted(true), []);

  const current = (theme as ThemeOption) ?? "system";
  const Icon = ICONS[current];

  function cycle() {
    const nextIndex = (ORDER.indexOf(current) + 1) % ORDER.length;
    setTheme(ORDER[nextIndex]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={mounted ? `Switch theme, currently ${LABELS[current]}` : "Switch theme"}
      title={mounted ? LABELS[current] : undefined}
      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-signal-blue focus-visible:text-signal-blue"
    >
      {mounted ? <Icon size={16} strokeWidth={1.75} /> : <span className="h-4 w-4" />}
    </button>
  );
}
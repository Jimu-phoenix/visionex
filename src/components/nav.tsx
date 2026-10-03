"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "gallery", href: "/gallery" },
  { label: "profiles", href: "/profiles" },
  { label: "contact", href: "/contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6"
    >
      <nav
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-2 font-mono text-xs backdrop-blur-md sm:gap-2 sm:px-3"
      >
        <Link
          href="/"
          className="mr-1 flex items-center gap-1.5 rounded-full px-2 py-1.5 tracking-tight sm:mr-2"
          aria-label="Phoenix — home"
        >
          <Image
            src="/images/vis_logo_white.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-auto"
          />
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 uppercase tracking-[0.12em] transition-colors sm:px-3 ${
                    active
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1 w-1 rounded-full transition-colors ${
                      active
                        ? "bg-signal-orange"
                        : "bg-signal-blue/40 group-hover:bg-signal-blue"
                    }`}
                  />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-1 h-4 w-px bg-border sm:ml-2" aria-hidden />
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
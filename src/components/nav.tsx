"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "gallery", href: "/gallery" },
  { label: "contact", href: "/contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Links close the sheet on tap — navigating away should never leave the menu
  // hanging open over the new page.
  const close = () => setOpen(false);

  const dot = (active: boolean) =>
    `h-1 w-1 shrink-0 rounded-full transition-colors ${
      active ? "bg-signal-orange" : "bg-signal-blue/40 group-hover:bg-signal-blue"
    }`;

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:top-6 sm:bottom-auto"
    >
      <nav
        aria-label="Primary"
        className="relative flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-2 font-mono text-xs backdrop-blur-md sm:gap-2 sm:px-3"
      >
        <Link
          href="/"
          onClick={close}
          className="mr-auto flex items-center gap-1.5 rounded-full px-2 py-1.5 tracking-tight sm:mr-2"
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

        {/* Desktop: inline row. */}
        <ul className="hidden items-center gap-0.5 sm:flex sm:gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 uppercase tracking-[0.12em] transition-colors sm:px-3 ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span aria-hidden className={dot(active)} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile: hamburger, which becomes the close affordance. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink sm:hidden"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        <div className="hidden h-4 w-px bg-border sm:ml-2 sm:block" aria-hidden />
        <ThemeToggle />

        {/* Sheet sits above the bar. Anchored to the pill's own left edge and
            pulled back by half its width, since the bar is centred. */}
        <AnimatePresence>
          {open && (
            <motion.ul
              id="mobile-menu"
              key="mobile-menu"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full left-1/2 mb-3 w-[min(15rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface/95 p-2 font-mono text-xs uppercase tracking-[0.12em] backdrop-blur-md sm:hidden"
            >
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-2.5 rounded-xl px-3 py-3 transition-colors ${
                        active ? "text-ink" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <span aria-hidden className={dot(active)} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

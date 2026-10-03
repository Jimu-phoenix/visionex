"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import CreativeCore from "@/components/creative-core";
import { TypingText } from "@/components/typing-text";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery } from "@/lib/use-media-query";

const PORTRAIT = {
  src: "/images/phoenix-secondary.png",
  alt: "Prince Vision Jimu, developer and network educator",
};

const ROLES = ["Dev", "Designer", "Educator"];

/**
 * Two hard sections, no diagonal and no radius, with a flat blue section and
 * the figure living inside it.
 *
 * MOBILE — stacked, text band on top, blue band below, growing the full
 *   height. DESKTOP — side by side, blue section on the right, growing the
 *   full width.
 *
 * The blue section is absolutely positioned with right:0 bottom:0 rather than
 * being a flex cell. A flex item grows to the right (or downward in a column)
 * and gets clipped by the container, so nothing would appear to happen;
 * anchored to the far edges, the free edge travels inward across the text
 * until the blue fills the screen.
 *
 * Layers: blue section z-0, text z-10, CTA z-20. The figure is nested in the
 * blue section so it rides the sweep, capped in both axes so it translates
 * rather than ballooning once the section passes its natural size.
 *
 * The text fades as the blue crosses it. Ink on signal-blue is not readable,
 * and the section is guaranteed to end up underneath the text by the end.
 *
 * CreativeCore resolves in the middle of the composition once the blue is
 * nearly full width. It sits above the blue section but below the text and
 * CTA, and is desktop-only: it is a decorative canvas that draws every frame,
 * and the mobile band is too short for it to read.
 *
 * Every animated value is published as a CSS custom property, with CSS picking
 * the winner per breakpoint (h-[var(--panel-h)] on mobile, md:w-[var(--panel-w)]
 * on desktop). Branching in JS on a matchMedia value would paint the mobile
 * treatment first on desktop and then visibly snap, since the query is
 * unresolved during SSR and the first render.
 */
export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const panelWidth = useTransform(scrollYProgress, [0, 1], ["50%", "100%"]);
  const panelHeight = useTransform(scrollYProgress, [0, 1], ["42vh", "100vh"]);

  const textOpacity = useTransform(scrollYProgress, [0.05, 0.5], [1, 0]);
  const rolesBlur = useTransform(
    scrollYProgress,
    [0, 0.85],
    ["blur(0px)", "blur(7px)"]
  );

  // Blue spans 50% -> 100% across the whole scroll, so 90% width lands at
  // progress 0.8. Hold it invisible until then, then fade in over the last
  // fifth of the sweep.
  const coreOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const animated = !prefersReducedMotion;

  // Undefined custom properties fall back to the literal in each var() call,
  // so reduced motion gets a clean static layout.
  const panelVars = animated
    ? ({
        "--panel-w": panelWidth,
        "--panel-h": panelHeight,
      } as React.CSSProperties)
    : undefined;

  const textVars = animated
    ? ({ "--text-o": textOpacity } as React.CSSProperties)
    : undefined;

  const rolesVars =
    animated && !isDesktop
      ? ({ "--roles-blur": rolesBlur } as React.CSSProperties)
      : undefined;

  return (
    <section
      ref={wrapperRef}
      className={animated ? "relative h-[220vh]" : "relative h-screen"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden md:flex md:flex-row">
        {/* Text half */}
        <motion.div
          style={textVars}
          className="absolute inset-x-0 top-0 z-10 px-6 pb-6 pt-32 opacity-[var(--text-o,1)] sm:px-12 md:static md:flex md:h-full md:w-1/2 md:flex-none md:flex-col md:justify-center md:px-12 md:py-0"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            Prince Vision Jimu
          </p>

          <h1 className="mt-4 max-w-md font-display text-[clamp(2.5rem,8.5vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tighter">
            <TypingText words={["Create. Build. Design."]} loop={false} />
          </h1>

          <p className="mt-6 flex items-center gap-2 font-mono text-sm text-ink-muted">
            <span className="text-signal-blue">→</span>
            build signals not noise
          </p>
        </motion.div>

        {/* Blue section — bottom band on mobile (grows to full height), right
            half on desktop (grows to full width). Anchored right/bottom so the
            free edge travels inward rather than off-screen. */}
        <motion.div
          style={panelVars}
          className="dot-grid absolute bottom-0 right-0 z-0 h-[var(--panel-h,42vh)] w-full overflow-hidden bg-signal-blue md:top-0 md:h-full md:w-[var(--panel-w,50%)]"
        >
          <p className="absolute right-6 top-6 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 sm:right-10 sm:top-10">
            Available for work
          </p>

          {/* Figure rides the section. On mobile it's capped in height so it
              sits in the lower band and leaves the roles clear above it;
              on desktop it fills the section's height. */}

          <Image
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            width={1000}
            height={1000}
            priority
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-[62%] w-auto max-w-full object-contain md:inset-0 md:mx-0 md:h-full md:max-w-[520px]"
          />

          {/* One word per line, hard against the section's right edge. Mobile
              hangs from the top of the band; desktop centres vertically. */}
          <motion.ul
            style={rolesVars}
            className="absolute right-6 top-14 z-10 text-right [filter:var(--roles-blur,none)] sm:right-10 md:top-1/2 md:-translate-y-1/2"
          >
            {ROLES.map((role) => (
              <li
                key={role}
                className="font-display text-[clamp(1.75rem,4vw,3.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-white"
              >
                {role}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* CreativeCore — resolves between the figure and the text as the blue
            closes to full width. z-[5] keeps it above the blue section (z-0)
            but under the text (z-10) and CTA (z-20). pointer-events-none so the
            canvas never intercepts the CTA or text selection. Desktop only: the
            canvas draws every frame and the mobile band is too short for it. */}
        {animated && isDesktop && (
          <motion.div
            style={{ opacity: coreOpacity }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] hidden h-[min(70vh,34rem)] w-[min(70vh,34rem)] -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <CreativeCore />
          </motion.div>
        )}

        {/* CTA — sibling of both halves: bottom-left on desktop so it never
            collides with the figure, centred on mobile. */}
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-10 md:left-12 md:right-auto md:justify-start">
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-surface transition-colors hover:bg-signal-orange hover:text-white"
          >
            See the work
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
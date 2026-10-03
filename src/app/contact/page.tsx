import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronsRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { TraceLine } from "@/components/trace-line";
import { EMAIL, PHONE, SOCIAL_LINKS } from "@/lib/contact";

export const metadata = {
  title: "Contact — Phoenix",
  description:
    "Reach Phoenix about web and SaaS builds or 3D and motion projects.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      <main>
        {/* Same split-diagonal hero construction as home and 404. The blue
            block holds the primary action this time — email is the ask. */}
        <section className="relative overflow-hidden">
          <div className="flex min-h-[70vh] flex-col md:min-h-[86vh] md:flex-row">
            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-14 pt-32 sm:px-12 md:w-[46%] md:flex-none md:pt-0">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                  N.07 — Contact
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-4 flex items-center gap-2 sm:gap-4">
                  <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] font-bold uppercase leading-[0.85] tracking-tighter">
                    Say hi
                  </h1>
                  <ChevronsRight
                    strokeWidth={3}
                    className="h-12 w-12 shrink-0 text-signal-orange sm:h-16 sm:w-16"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
                  Web and SaaS builds 3D and motion — or
                  something that doesn&apos;t fit those labels yet. Email is
                  fastest; I answer everything.
                </p>
              </Reveal>
            </div>

            {/* Primary action. Big because it is the one thing you came here
                for — everything below is the long way round. */}
            <div className="relative flex-1 overflow-hidden bg-signal-blue md:h-auto md:w-[54%] md:[clip-path:polygon(8%_0,100%_0,100%_100%,0%_100%)]">
              <p className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 sm:right-10 sm:top-10">
                Prefer a terminal?
              </p>

              <div className="flex h-full flex-col justify-center px-6 py-24 sm:px-10 md:pl-14 md:pr-10">
                <Reveal>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Send a message
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-3 inline-block font-mono text-[clamp(0.95rem,2.2vw,1.35rem)] text-white underline decoration-signal-orange decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
                  >
                    {EMAIL}
                  </a>
                </Reveal>

                <Reveal delay={0.1}>
                  <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Or call
                  </p>
                  <a
                    href={PHONE.href}
                    className="mt-3 inline-block font-mono text-[clamp(0.95rem,2.2vw,1.35rem)] text-white underline decoration-signal-orange decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
                  >
                    {PHONE.display}
                  </a>
                </Reveal>

                <Reveal delay={0.2}>
                  <p className="mt-10 max-w-xs font-mono text-xs leading-relaxed text-white/70">
                    Based in Malawi, so expect replies in GMT+2. Calls land
                    better on weekday afternoons.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Elsewhere. Hairline rows rather than cards — a list of places is
            a list, not a set of tiles. */}
        <section className="px-6 py-24 sm:px-12 sm:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-tight">
                Elsewhere
              </h2>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
                N.08 — Channels
              </p>
            </Reveal>

            <div className="mt-10 border-t border-border">
              {SOCIAL_LINKS.map((link, i) => (
                <Reveal key={link.label} delay={i * 0.05}>
                  <a
                    href={link.href} target="blank"
                    className="group flex items-center justify-between gap-4 border-b border-border py-6 transition-colors hover:bg-surface-raised"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-signal-blue">
                        0{i + 1}
                      </span>
                      <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                        {link.label}
                      </span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="hidden font-mono text-xs text-ink-muted sm:inline">
                        {link.handle}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="shrink-0 text-ink-muted transition-colors group-hover:text-signal-orange"
                      />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-surface transition-colors hover:bg-signal-orange hover:text-white"
                >
                  Back to home
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
                >
                  See the work
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TraceLine gets its one signature instance — a vertical slot that
            fits its 220x420 aspect, and the natural way back to the top. */}
        <section className="border-t border-border px-6 py-20 sm:px-12">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
            <Reveal>
              <p className="max-w-sm font-display text-xl font-semibold tracking-tight sm:text-2xl">
                No reply? The packet probably got dropped.
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                Try the phone number, or check the YouTube channel — most
                questions I get are already answered in a video.
              </p>
            </Reveal>

            {/* <Reveal delay={0.1} className="w-[110px] shrink-0 sm:w-[220px]">
              <TraceLine className="h-auto w-full" />
            </Reveal> */}
          </div>
        </section>
      </main>
    </>
  );
}
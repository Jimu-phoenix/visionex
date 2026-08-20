import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { TypingText } from "@/components/typing-text";
import { TraceLine } from "@/components/trace-line";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "PostgreSQL",
  "Blender",
  "Packet Tracer",
  "Node.js",
];

const DOMAINS = [
  {
    id: "N.01",
    title: "Web & SaaS",
    body: "TrustLedger, a multi-tenant helpdesk platform, plus sites and web apps for local businesses — clean interfaces, no bloat.",
  },
  {
    id: "N.02",
    title: "Network education",
    body: "A CCNA 200-301 series for Yaza IT Malawi — routing, switching, WLAN, and the topologies that make them make sense.",
  },
  {
    id: "N.03",
    title: "3D & motion",
    body: "Scenes like The Orbit, built with non-destructive modifiers and procedural materials only — no downloaded shortcuts.",
  },
];

const WORK = [
  {
    tag: "SaaS",
    title: "TrustLedger",
    body: "A multi-tenant helpdesk product, from ticket lifecycle to tenant workspace to the control dashboard.",
  },
  {
    tag: "Education",
    title: "Yaza IT Malawi",
    body: "CCNA 200-301 video series — scripts, branded decks, and practice topologies, module by module.",
  },
  {
    tag: "3D",
    title: "The Orbit",
    body: "A space scene for CIT-IMG-421 — five objects, five modifiers, built and demonstrated live in the viewport.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-12 sm:pt-44">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              Blantyre — Mzuzu, Malawi
            </p>

            <h1 className="mt-6 max-w-xl font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-tighter">
              I build the{" "} <br />
              <TypingText words={["networks", "interfaces", "scenes"]} />
              <br />
              that ideas run on.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
              Web apps and SaaS products for small businesses, a CCNA series
              for Yaza IT Malawi, and 3D work built the hard way —
              non-destructive, procedural, no shortcuts.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="rounded-full bg-signal-orange px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5"
              >
                See the work
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-signal-blue px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-signal-blue transition-colors hover:bg-signal-blue hover:text-white"
              >
                Start a project
              </Link>
            </div>
          </div>

          {/* Portrait with oversized ghost text bleeding behind it — the
              one "text overlapping design" moment on the page. */}
          <div className="relative mx-auto flex w-full max-w-sm justify-center lg:max-w-none">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,14vw,9rem)] font-bold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--color-border)]"
            >
              Phoenix
            </span>

            <Image
              src="/images/phoenix-hero.png"
              alt="Phoenix, developer and network educator, adjusting his blazer"
              width={1200}
              height={1200}
              priority
              className="relative h-auto w-full drop-shadow-none"
            />

            <TraceLine className="pointer-events-none absolute -right-6 bottom-0 hidden h-[65%] w-auto sm:block" />
          </div>
        </div>
      </section>

      {/* Stack marquee */}
      <div className="border-y border-border py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee gap-8 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {[...STACK, ...STACK].map((item, i) => (
              <span key={i} className="flex items-center gap-8">
                {item}
                <span className="text-signal-blue/50">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Domains */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              What I work on
            </p>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
            {DOMAINS.map((domain, i) => (
              <Reveal key={domain.id} delay={i * 0.08}>
                <div className="h-full bg-surface-raised p-8">
                  <p className="font-mono text-xs text-signal-blue">
                    {domain.id}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                    {domain.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {domain.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Work preview */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-tight">
              Selected work
            </h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
            >
              All projects
              <ArrowUpRight size={14} />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {WORK.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Link
                  href="/projects"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border p-8 transition-colors hover:border-signal-blue"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
                      {item.tag}
                    </p>
                    <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="mt-8 text-ink-muted transition-colors group-hover:text-signal-orange"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How I work + second portrait */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="order-2 flex justify-center lg:order-1">
            <Image
              src="/images/phoenix-secondary.png"
              alt="Phoenix adjusting his watch"
              width={1200}
              height={1200}
              className="h-auto w-full"
            />
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              N.04 — How I work
            </p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-tight">
              Uptime over hype.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
              I'd rather ship something that holds up than something that
              looks good in a screenshot. That means non-destructive edits in
              Blender, real content over stock templates, and topologies I've
              actually tested before I teach them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Footer / contact */}
      <footer className="border-t border-border px-6 py-16 sm:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              N.05 — Get in touch
            </p>
            <Link
              href="/contact"
              className="mt-4 block font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tighter transition-colors hover:text-signal-orange"
            >
              Let's talk.
            </Link>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            <a href="#" className="transition-colors hover:text-signal-blue">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-signal-blue">
              YouTube — Yaza IT Malawi
            </a>
            <a href="#" className="transition-colors hover:text-signal-blue">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1200px] items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          <span>© {new Date().getFullYear()} Phoenix</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-orange" />
            Mzuzu, MW
          </span>
        </div>
      </footer>
    </>
  );
}
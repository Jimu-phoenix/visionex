import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, ChevronsRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { TypingText } from "@/components/typing-text";

export const metadata: Metadata = {
  title: "404 — No route to host",
  description: "That page never made it past the third hop.",
};

// A traceroute that gives up. The joke is that the missing page isn't a
// missing page — it's a packet that got dropped somewhere upstream.
const HOPS = [
  { hop: "1", host: "gateway.local", ms: "0.412 ms" },
  { hop: "2", host: "edge.isp.mw", ms: "8.104 ms" },
  { hop: "3", host: "backbone-2.mw", ms: "24.771 ms" },
  { hop: "4", host: "core.peering", ms: "61.338 ms" },
  { hop: "5", host: "*", ms: "*  *" },
  { hop: "6", host: "*", ms: "*  *" },
];

export default function NotFound() {
  return (
    <>
      <Nav />

      <main>
        {/* Same split-diagonal construction as the home hero — the 404 should
            feel like the site, not a bolted-on error state. */}
        <section className="relative overflow-hidden">
          <div className="flex min-h-[72vh] flex-col md:min-h-[92vh] md:flex-row">
            {/* Left — the number, the chevrons, the excuse */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-14 pt-32 sm:px-12 md:w-[46%] md:flex-none md:pt-0">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                  N.06 — Error 404
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-4 flex items-center gap-2 sm:gap-4">
                  <h1 className="font-display text-[clamp(3.5rem,11vw,7.5rem)] font-bold uppercase leading-[0.85] tracking-tighter">
                    404
                  </h1>
                  <ChevronsRight
                    strokeWidth={3}
                    className="h-12 w-12 shrink-0 text-signal-orange sm:h-16 sm:w-16"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-6 flex items-center gap-2 font-mono text-sm text-ink-muted">
                  <span className="text-signal-blue">→</span>
                  <TypingText
                    words={[
                      "no route to host.",
                      "lost past hop three.",
                      "never arrived.",
                    ]}
                  />
                </p>
              </Reveal>
            </div>

            {/* Right — the terminal. Blue block echoes the home hero; the clip
                is milder there because clipped text has to survive it. */}
            <div className="relative flex-1 overflow-hidden bg-signal-blue md:h-auto md:w-[54%] md:[clip-path:polygon(8%_0,100%_0,100%_100%,0%_100%)]">
              <p className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 sm:right-10 sm:top-10">
                Error 404
              </p>

              <div className="flex h-full flex-col justify-end px-6 pb-14 pt-24 sm:px-10 sm:pb-16 md:pl-14 md:pr-10">
                <div className="font-mono text-xs leading-relaxed sm:text-[13px]">
                  <Reveal>
                    <p className="text-white">
                      <span className="text-white/60">$</span> traceroute to /404
                    </p>
                  </Reveal>

                  <div className="mt-4 space-y-1">
                    {HOPS.map((row, i) => (
                      <Reveal key={row.hop} delay={0.12 + i * 0.07}>
                        <p className="flex gap-3 text-white/80">
                          <span className="w-4 shrink-0 text-white/50">
                            {row.hop}
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {row.host}
                          </span>
                          <span className="shrink-0 tabular-nums">{row.ms}</span>
                        </p>
                      </Reveal>
                    ))}
                  </div>

                  <Reveal delay={0.6}>
                    <p className="mt-5 flex items-center gap-2 text-white">
                      <span aria-hidden className="text-signal-orange">
                        !
                      </span>
                      no route to host
                      <span
                        aria-hidden
                        className="inline-block h-[0.9em] w-[2px] bg-signal-orange animate-blink"
                      />
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Way out — same pill and text-link pair as the home hero/footer. */}
        <section className="px-6 py-24 sm:px-12 sm:py-32">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-tight">
                The signal ends here.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
                Whoever typed that address got it wrong, or I moved something and
                forgot to leave a redirect. Either way, the working routes are
                one hop back.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="flex shrink-0 flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-surface transition-colors hover:bg-signal-orange hover:text-white"
              >
                Back to home
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-1 self-start font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
              >
                See the work
                <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
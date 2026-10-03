import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { EMAIL, SOCIAL_LINKS } from "@/lib/contact";

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

const PILLARS = [
  {
    id: "N.02",
    title: "Development",
    body: "Business websites for local clients, plus two products out of hackathons: TrustLedger, a financial reputation scoring platform for informal Malawian SMEs, and a Private Hostel Management System.",
  },
  {
    id: "N.03",
    title: "Design",
    body: "Graphic design across flat images and 3D work.",
    href: "/gallery",
    linkLabel: "View gallery",
  },
  {
    id: "N.04",
    title: "Tech Education",
    body: "Tutoring at Yaza IT Malawi on CCNA 200-301, Mubas Innovations Hub on programming, and ElevatEd on networking.",
  },
];

const WORK = [
  {
    tag: "Fintech",
    title: "TrustLedger",
    body: "Financial reputation scoring for informal Malawian SMEs, started at the FINOVATE 2026 hackathon (MUBAS/CoSISS) and since grown into a multi-tenant helpdesk SaaS.",
  },
  {
    tag: "Web app",
    title: "Hostel Management System",
    body: "Hostel search, tenant payment history, and an owner dashboard covering rent and monthly expenses.",
  },
  {
    tag: "Freelance",
    title: "Business websites",
    body: "Marketing sites and web apps for local clients — built to be handed over and maintained without me.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />

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

      {/* About + pillars */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              N.01 — About
            </p>
            <p className="mt-6 max-w-3xl font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-medium leading-snug tracking-tight">
              I&rsquo;m Prince Vision Jimu —{" "}
              <span className="text-signal-blue">Phoenix</span> — a developer,
              designer, and tech educator based in Blantyre Malawi. I build
              software, design in both flat and 3D, and teach the networking and
              programming behind it.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.id} delay={i * 0.08}>
                <div className="flex h-full flex-col bg-surface-raised p-8">
                  <p className="font-mono text-xs text-signal-blue">
                    {pillar.id}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {pillar.body}
                  </p>
                  {pillar.href && (
                    <Link
                      href={pillar.href}
                      className="mt-5 flex items-center gap-1 self-start font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
                    >
                      {pillar.linkLabel}
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
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


      {/* Footer / contact */}
      <footer className="border-t border-border px-6 py-16 sm:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              N.06 — Get in touch
            </p>
            <Link
              href="/contact"
              className="mt-4 block font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tighter transition-colors hover:text-signal-orange"
            >
              Let&rsquo;s talk.
            </Link>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-signal-blue"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors hover:text-signal-blue"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1200px] items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          <span>© {new Date().getFullYear()} Phoenix</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-orange" />
            Blantyre, MW
          </span>
        </div>
      </footer>
    </>
  );
}
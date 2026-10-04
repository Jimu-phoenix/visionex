import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { PROJECTS, type Project } from "@/lib/projects";

export const metadata = {
  title: "Projects — Phoenix",
  description:
    "Selected work by Prince Vision Jimu: fintech, web apps, business sites, 3D, and CCNA teaching material.",
};

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon ?? ArrowUpRight;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors group-hover:border-signal-blue">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        /* Placeholder slot — a tinted field and the project icon, so cards
           without a screenshot still read as deliberate rather than broken. */
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-signal-blue/8 [background-image:radial-gradient(circle_at_center,rgb(0_110_195_/_0.25)_1px,transparent_1.5px)] [background-size:1.25rem_1.25rem]"
          />
          <Icon
            aria-hidden
            strokeWidth={1.25}
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-signal-blue"
          />
        </>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Nav />

      <main>
        <section className="px-6 pb-8 pt-32 sm:px-12 sm:pt-40">
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                N.01 — Projects
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold uppercase leading-[0.9] tracking-tighter">
                The work
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
                Fintech, web apps, client sites, teaching material, and 3D — five
                things I have shipped or taught. Newest first.
              </p>
            </Reveal>
          </div>
        </section>

        {/* One row per project: visual left, text right on desktop, stacked on
            mobile. Hairline rows rather than a tile grid — a project list reads
            as an index, not a set of cards. */}
        <section className="px-6 pb-24 sm:px-12 sm:pb-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="border-t border-border">
              {PROJECTS.map((project, i) => {
                const inner = (
                  <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,320px)_1fr] sm:gap-10">
                    <ProjectVisual project={project} />

                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-signal-blue">
                          {project.id}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                          {project.date}
                        </span>
                      </div>

                      <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                        {project.title}
                      </h2>

                      <p className="max-w-md text-sm leading-relaxed text-ink-muted">
                        {project.summary}
                      </p>

                      {project.href && (
                        <span className="mt-2 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors group-hover:text-signal-orange">
                          View project
                          <ArrowUpRight size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                );

                const className =
                  "block border-b border-border py-8 transition-colors hover:bg-surface-raised sm:py-10";

                return (
                  <Reveal key={project.slug} delay={i * 0.05}>
                    {project.href ? (
                      <Link href={project.href} className={`group ${className}`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={`group ${className}`}>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
                >
                  <ArrowLeft size={14} />
                  Back to home
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
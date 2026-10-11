"use client";

import Image from "next/image";
import Link from "next/link";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ICONS, ICON_FALLBACK, type IconName } from "@/lib/icons";
import { api } from "@/convex/_generated/api";

/**
 * Reactive project rows. The page preloads the query server-side so this renders
 * real HTML on first paint, then stays live — an edit in /admin shows up here
 * without a reload.
 */

type PreloadedProjects = Preloaded<typeof api.projects.list>;

function ProjectVisual({
  imageUrl,
  icon,
}: {
  imageUrl: string | null;
  icon?: string;
}) {
  const Icon = ICONS[icon as IconName] ?? ICON_FALLBACK;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors group-hover:border-signal-blue">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        /* Placeholder slot — a tinted field and the project icon, so projects
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

export function ProjectsList({ preloaded }: { preloaded: PreloadedProjects }) {
  const projects = usePreloadedQuery(preloaded);

  return (
    <div className="border-t border-border">
      {projects.map((project, i) => {
        const inner = (
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,320px)_1fr] sm:gap-10">
            <ProjectVisual imageUrl={project.imageUrl} icon={project.icon} />

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-signal-blue">
                  {project.nodeId}
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

        const rowClass =
          "block border-b border-border py-8 transition-colors hover:bg-surface-raised sm:py-10";

        return (
          <Reveal key={project._id} delay={i * 0.05}>
            {project.href ? (
              <Link
                href={project.href}
                className={`group ${rowClass}`}
                target="_blank"
                rel="noreferrer"
              >
                {inner}
              </Link>
            ) : (
              <div className={`group ${rowClass}`}>{inner}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

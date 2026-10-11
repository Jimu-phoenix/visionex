"use client";

import Image from "next/image";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { Reveal } from "@/components/reveal";
import { ICONS, ICON_FALLBACK, type IconName } from "@/lib/icons";
import { api } from "@/convex/_generated/api";

/**
 * Reactive gallery sections. Preloaded server-side, live on the client.
 *
 * The section wrapper and its header live here too, because the node numbers
 * and descriptions come from the database — the page has no static copy left.
 */

type PreloadedGallery = Preloaded<typeof api.gallery.list>;

const ASPECT = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

function Tile({
  imageUrl,
  icon,
  nodeId,
  title,
  orientation,
}: {
  imageUrl: string | null;
  icon?: string;
  nodeId: string;
  title: string;
  orientation: keyof typeof ASPECT;
}) {
  const Icon = ICONS[icon as IconName] ?? ICON_FALLBACK;

  return (
    <figure className="group">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors group-hover:border-signal-blue ${ASPECT[orientation]}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          /* Placeholder slot — tinted field, dot lattice, and the item icon. */
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-signal-blue/8 [background-image:radial-gradient(circle_at_center,rgb(0_110_195_/_0.25)_1px,transparent_1.5px)] [background-size:1.25rem_1.25rem]"
            />
            <Icon
              aria-hidden
              strokeWidth={1.25}
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-signal-blue"
            />
          </>
        )}
      </div>

      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-signal-blue">{nodeId}</span>
        <span className="text-sm text-ink-muted">{title}</span>
      </figcaption>
    </figure>
  );
}

export function GallerySections({ preloaded }: { preloaded: PreloadedGallery }) {
  const sections = usePreloadedQuery(preloaded);

  return (
    <>
      {sections.map((section) => (
        <section key={section._id} className="px-6 py-16 sm:px-12 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-signal-blue">
                  {section.nodeId}
                </p>
                <h2 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-tight">
                  {section.title}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                {section.description}
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {section.items.map((item, i) => (
                <Reveal key={item._id} delay={i * 0.05}>
                  <Tile
                    imageUrl={item.imageUrl}
                    icon={item.icon}
                    nodeId={item.nodeId}
                    title={item.title}
                    orientation={item.orientation}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

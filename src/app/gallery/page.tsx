import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/footer";
import { GALLERY, type GalleryItem } from "@/lib/gallery";

export const metadata = {
  title: "Gallery — Phoenix",
  description:
    "Graphics, project images, and photography by Prince Vision Jimu.",
};

const ASPECT = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

function Tile({ item }: { item: GalleryItem }) {
  const Icon = item.icon ?? ArrowUpRight;

  return (
    <figure className="group">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors group-hover:border-signal-blue ${ASPECT[item.orientation]}`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          /* Placeholder slot — tinted field, dot lattice, and the item icon, so
             empty tiles still read as deliberate rather than broken. */
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
        <span className="font-mono text-[11px] text-signal-blue">{item.id}</span>
        <span className="text-sm text-ink-muted">{item.title}</span>
      </figcaption>
    </figure>
  );
}

export default function GalleryPage() {
  return (
    <>
      <Nav />

      <main>
        <section className="px-6 pb-8 pt-32 sm:px-12 sm:pt-40">
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                N.01 — Gallery
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold uppercase leading-[0.9] tracking-tighter">
                Visual work
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
                Graphics, screens from the builds, and everything else. Slots are
                placeholders until the real files land.
              </p>
            </Reveal>
          </div>
        </section>

        {/* One section per category, each a masonry-ish grid that tolerates
            mixed tile aspect ratios. */}
        {GALLERY.map((section) => (
          <section
            key={section.id}
            className="px-6 py-16 sm:px-12 sm:py-24"
          >
            <div className="mx-auto max-w-[1200px]">
              <Reveal className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-signal-blue">
                    {section.id}
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
                  <Reveal key={item.id} delay={i * 0.05}>
                    <Tile item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
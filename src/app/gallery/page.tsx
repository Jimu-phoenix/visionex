import { preloadQuery } from "convex/nextjs";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/footer";
import { GallerySections } from "@/components/gallery-sections";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Gallery — Phoenix",
  description:
    "Graphics, project images, and photography by Prince Vision Jimu.",
};

export default async function GalleryPage() {
  const preloaded = await preloadQuery(api.gallery.list);

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

        <GallerySections preloaded={preloaded} />
      </main>

      <Footer />
    </>
  );
}

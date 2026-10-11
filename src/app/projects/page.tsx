import Link from "next/link";
import { preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { ProjectsList } from "@/components/projects-list";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Projects — Phoenix",
  description:
    "Selected work by Prince Vision Jimu: fintech, web apps, business sites, 3D, and CCNA teaching material.",
};

export default async function ProjectsPage() {
  // Preloaded on the server so the list is real HTML on first paint; the client
  // component then keeps it live.
  const preloaded = await preloadQuery(api.projects.list);

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
            <ProjectsList preloaded={preloaded} />

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

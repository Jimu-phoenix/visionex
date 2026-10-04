import Link from "next/link";
import { EMAIL, SOCIAL_LINKS } from "@/lib/contact";

/**
 * Site footer. Shared by home, gallery, and any other index page so the
 * contact block, social column, and location line stay identical across them.
 *
 * The location and social handles come from @/lib/contact and are still
 * placeholders — swap them there, not here.
 */
export function Footer() {
  return (
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
          Lilongwe, MW
        </span>
      </div>
    </footer>
  );
}
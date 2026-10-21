import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DocsViewer } from "@/components/docs-viewer";

/**
 * Unlisted utility page: intentionally absent from Nav and marked noindex.
 * Kept out of the site's information architecture on purpose.
 */

export const metadata = {
  title: "Docs — Phoenix",
  description: "Read a Markdown file locally in the browser.",
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          Tool
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-bold uppercase tracking-tighter">
          Docs
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
          Drop in a Markdown file to read it here. The file is opened in this tab
          with the File API and never leaves your browser — nothing is uploaded,
          sent or stored.
        </p>

        <div className="mt-12">
          <DocsViewer />
        </div>
      </div>
    </main>
  );
}

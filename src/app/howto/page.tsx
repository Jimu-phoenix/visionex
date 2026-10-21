import Image from "next/image";

/**
 * Unlisted utility page: intentionally absent from Nav and marked noindex.
 * Display-only: it is projected in class to give students the sandbox steps,
 * so nothing here is interactive and everything is sized to fit one screen.
 * Needs public/class-bars-qr.png (QR code for the sandbox URL).
 */

export const metadata = {
  title: "Class-BARS Demo — Phoenix",
  description: "Steps for trying the Class-BARS sandbox.",
  robots: { index: false, follow: false },
};

const SITE_LABEL = "class-bars.vercel.app";

const STEPS: { title: string; hint?: string }[] = [
  { title: "Click “Try Demo”" },
  {
    title: "Complete the reCAPTCHA",
    hint: "Reload the page if it takes too long to load.",
  },
  { title: "Enroll your face" },
  { title: "Join the live class" },
  { title: "Match your face" },
];

export default function SandboxPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-[5vh] sm:px-12">
      <div className="flex w-full flex-col gap-[5vh] lg:flex-row lg:items-center lg:justify-between lg:gap-[4vw]">
        <div className="min-w-0">
          <p className="font-mono text-[min(1.4vw,2.2vh)] uppercase tracking-[0.2em] text-ink-muted">
            Class-BARS
          </p>
          <h1 className="mt-4 font-display text-[min(4vw,7vh)] font-bold uppercase leading-none tracking-tighter">
            Try the demo
          </h1>
          <p className="mt-4 text-[min(1.8vw,3vh)] leading-relaxed text-ink-muted">
            Open this link on your phone and follow the steps below.
          </p>
          <p className="mt-[2vh] break-words font-display text-[min(5vw,11vh)] font-bold leading-none tracking-tighter">
            {SITE_LABEL}
          </p>

          <p className="mt-[5vh] font-mono text-[min(1.4vw,2.2vh)] uppercase tracking-[0.2em] text-ink-muted">
            Steps
          </p>
          <ol className="mt-4 space-y-[2.2vh]">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-baseline gap-[3vw]">
                <span className="font-mono text-[min(2.4vw,4vh)] text-signal-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-[min(3.6vw,5.6vh)] font-bold leading-tight tracking-tight">
                    {step.title}
                  </p>
                  {step.hint ? (
                    <p className="mt-1 text-[min(1.8vw,3vh)] leading-snug text-ink-muted">
                      {step.hint}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="shrink-0 self-center">
          <Image
            src="/class-bars-qr.png"
            alt={`QR code for ${SITE_LABEL}`}
            width={1200}
            height={1200}
            priority
            unoptimized
            className="h-auto w-[min(70vw,42vh)] lg:w-[min(22vw,42vh)]"
          />
          <figcaption className="mt-4 text-center text-[min(1.6vw,2.4vh)] tracking-[0.2em] text-ink">
            Scan to open <br />
           <span className="font-extrabold"> {SITE_LABEL}</span>
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
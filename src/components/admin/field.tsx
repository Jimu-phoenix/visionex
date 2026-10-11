"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Form primitives for /admin. Deliberately plainer than the marketing pages —
 * this is a working surface, so contrast and hit targets beat the display type.
 */

const inputBase =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus:border-signal-blue";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
      {label}
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-2 text-[11px] normal-case tracking-normal text-ink-muted">{hint}</p>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-24 resize-y leading-relaxed ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Button({
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger" | "ghost";
}) {
  const styles = {
    default:
      "bg-ink text-surface hover:bg-signal-orange hover:text-white",
    danger:
      "border border-border text-ink-muted hover:border-signal-orange hover:text-signal-orange",
    ghost: "text-ink-muted hover:text-ink",
  }[variant];

  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${styles} ${props.className ?? ""}`}
    />
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6">
      {children}
    </div>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-xl border border-signal-orange/40 bg-signal-orange/10 px-4 py-3 font-mono text-xs leading-relaxed text-ink">
      {message}
    </p>
  );
}

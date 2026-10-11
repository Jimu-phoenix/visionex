"use client";

import { useState, type ReactNode } from "react";
import { useAction } from "convex/react";
import { Lock } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { adminToken, useAdminToken } from "@/lib/admin-token";

/**
 * Gate for /admin.
 *
 * A submitted secret is checked against the deployment by admin.verify before it
 * is written to localStorage, so a typo fails here with a clear reason instead of
 * unlocking the UI and then rejecting the first save. The token is still checked
 * by Convex on every write — this only decides what to render and what to keep.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const token = useAdminToken();
  const verify = useAction(api.admin.verify);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <form
          className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            const trimmed = draft.trim();
            if (!trimmed || checking) return;

            setChecking(true);
            setError(null);
            try {
              await verify({ token: trimmed });
              adminToken.set(trimmed);
            } catch (cause) {
              // Kept verbatim: assertAdmin distinguishes "wrong secret" from
              // "ADMIN_SECRET is not set on this deployment", and that
              // difference is the whole reason to verify before unlocking.
              setError(
                cause instanceof Error ? cause.message : "Something went wrong."
              );
            } finally {
              setChecking(false);
            }
          }}
        >
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            <Lock size={14} />
            Admin
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Enter the admin secret
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Stored in this browser only. It is the same value as{" "}
            <code className="font-mono text-signal-blue">ADMIN_SECRET</code> on
            the Convex deployment.
          </p>

          <label className="mt-6 block font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            Secret
            <input
              type="password"
              autoComplete="current-password"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm normal-case tracking-normal text-ink outline-none focus:border-signal-blue"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-signal-orange/40 bg-signal-orange/10 px-4 py-3 text-sm leading-relaxed text-signal-orange"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={checking}
            className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-surface transition-colors hover:bg-signal-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={adminToken.clear}
          className="rounded-full border border-border bg-surface/90 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted backdrop-blur-md transition-colors hover:text-signal-orange"
        >
          Lock admin
        </button>
      </div>
    </>
  );
}

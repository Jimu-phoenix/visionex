"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Markdown } from "@/components/markdown";

/**
 * Local Markdown preview.
 *
 * The file never leaves the tab: it is read with the File API and kept in
 * component state. There is deliberately no fetch, no localStorage and no
 * IndexedDB, so navigating away discards it. If persistence is ever wanted,
 * localStorage is the smallest change — but it would then survive on a shared
 * machine, which is the reason it is absent here.
 */

type Loaded = { name: string; size: number; source: string };

function readableSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
}

export function DocsViewer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [doc, setDoc] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function load(file: File) {
    if (!/\.(md|markdown)$/i.test(file.name)) {
      setError("That is not a Markdown file — choose a .md or .markdown file.");
      return;
    }

    try {
      const source = await file.text();
      setError(null);
      setDoc({ name: file.name, size: file.size, source });
    } catch {
      setError("The browser could not read that file.");
    }
  }

  function clear() {
    setDoc(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void load(file);
        }}
        className={`rounded-2xl border border-dashed p-6 transition-colors ${
          dragging
            ? "border-signal-blue bg-signal-blue/5"
            : "border-border bg-surface-raised"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".md,.markdown,text/markdown"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void load(file);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Upload size={18} className="shrink-0 text-signal-blue" />
            <div>
              <p className="font-display text-sm font-semibold tracking-tight text-ink">
                Choose a Markdown file
              </p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                .md or .markdown · drag and drop works too
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-surface transition-colors hover:bg-signal-orange hover:text-white"
          >
            Browse
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-signal-orange/40 bg-signal-orange/10 px-4 py-3 font-mono text-xs leading-relaxed text-ink"
        >
          {error}
        </p>
      )}

      {doc && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-ink-muted">
              <FileText size={14} className="shrink-0 text-signal-blue" />
              <span className="truncate">{doc.name}</span>
              <span className="shrink-0">· {readableSize(doc.size)}</span>
            </span>

            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-signal-orange"
            >
              <X size={14} />
              Clear
            </button>
          </div>

          <Markdown source={doc.source} />
        </div>
      )}
    </div>
  );
}

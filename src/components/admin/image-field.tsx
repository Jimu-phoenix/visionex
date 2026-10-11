"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useConvex } from "convex/react";
import { Upload, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button, Field } from "./field";

/**
 * Uploads straight to Convex file storage. The signed URL comes from a mutation,
 * the bytes go directly to storage, and only the resulting storage ID is
 * persisted. Nothing passes through a Next.js route handler.
 *
 * A freshly uploaded file has no servable URL until it is saved, so the preview
 * falls back to a local object URL for the in-between state.
 */
export function ImageField({
  token,
  imageId,
  imageUrl,
  onChange,
}: {
  token: string;
  imageId?: string;
  imageUrl: string | null;
  onChange: (storageId: string | null) => void;
}) {
  const convex = useConvex();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoking on unmount keeps the blob from outliving the editor.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function upload(file: File) {
    setBusy(true);
    setError(null);

    const preview = URL.createObjectURL(file);

    try {
      const url = await convex.mutation(api.files.generateUploadUrl, { token });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) throw new Error(`Upload failed (${response.status})`);

      const { storageId } = (await response.json()) as { storageId: string };
      onChange(storageId);
      setLocalPreview(preview);
    } catch (cause) {
      URL.revokeObjectURL(preview);
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const preview = localPreview ?? imageUrl;

  return (
    <Field
      label="Image"
      hint={
        imageId
          ? "Uploaded. Save to apply a replacement or a removal."
          : "Optional. Without one the placeholder tile is used."
      }
    >
      <div className="flex items-start gap-4">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
          {preview ? (
            preview.startsWith("blob:") ? (
              // Plain <img>: next/image cannot optimise a blob: URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <Image
                src={preview}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            )
          ) : (
            <span className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
              None
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              // Reset so re-picking the same file still fires a change event.
              event.target.value = "";
              if (file) upload(file);
            }}
          />

          <Button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={14} className="mr-2 inline" />
            {busy ? "Uploading" : imageId ? "Replace" : "Upload"}
          </Button>

          {imageId && (
            <Button type="button" variant="danger" onClick={() => onChange(null)}>
              <X size={14} className="mr-2 inline" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 font-mono text-xs text-signal-orange">{error}</p>}
    </Field>
  );
}

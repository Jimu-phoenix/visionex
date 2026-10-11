"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ICON_NAMES } from "@/lib/icons";
import { Button, ErrorNote, Field, Panel, Select, TextArea, TextInput } from "./field";
import { ImageField } from "./image-field";

type Draft = {
  title: string;
  slug: string;
  summary: string;
  date: string;
  nodeId: string;
  order: number;
  icon: string;
  href: string;
  imageId: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY: Draft = {
  title: "",
  slug: "",
  summary: "",
  date: "",
  nodeId: "",
  order: 0,
  icon: "",
  href: "",
  imageId: null,
};

function toDraft(row: {
  title: string;
  slug: string;
  summary: string;
  date: string;
  nodeId: string;
  order: number;
  icon?: string;
  href?: string;
  imageId?: string;
}): Draft {
  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    date: row.date,
    nodeId: row.nodeId,
    order: row.order,
    icon: row.icon ?? "",
    href: row.href ?? "",
    imageId: row.imageId ?? null,
  };
}

export function ProjectsEditor({ token }: { token: string }) {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>, onDone?: () => void) {
    setBusy(true);
    setError(null);
    try {
      await action();
      onDone?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => {
      // Keep the slug in step with the title only while it has not been edited
      // by hand — otherwise retyping a title would clobber a custom slug.
      // Branching on the literal key narrows `value` to the title's type.
      if (key === "title") {
        const title = value as string;
        return {
          ...current,
          title,
          slug:
            current.slug === slugify(current.title)
              ? slugify(title)
              : current.slug,
        };
      }

      return { ...current, [key]: value };
    });
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-signal-blue">N.01</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Projects
          </h2>
        </div>
        <p className="text-sm text-ink-muted">{projects?.length ?? 0} rows</p>
      </div>

      <div className="mt-6 space-y-4">
        <ErrorNote message={error} />

        {projects?.map((project) => (
          <ProjectRow
            key={project._id}
            token={token}
            imageUrl={project.imageUrl}
            initial={toDraft(project)}
            busy={busy}
            onSave={(next) =>
              run(() =>
                update({
                  token,
                  id: project._id,
                  title: next.title,
                  slug: next.slug,
                  summary: next.summary,
                  date: next.date,
                  nodeId: next.nodeId,
                  order: next.order,
                  icon: next.icon || null,
                  href: next.href || null,
                  imageId: next.imageId,
                })
              )
            }
            onDelete={() =>
              run(() => remove({ token, id: project._id }))
            }
          />
        ))}

        <Panel>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            New project
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="TrustLedger"
              />
            </Field>

            <Field label="Slug">
              <TextInput
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="trustledger"
              />
            </Field>

            <Field label="Node id" hint="Shown in mono above the title.">
              <TextInput
                value={draft.nodeId}
                onChange={(e) => set("nodeId", e.target.value)}
                placeholder="N.06"
              />
            </Field>

            <Field label="Date">
              <TextInput
                value={draft.date}
                onChange={(e) => set("date", e.target.value)}
                placeholder="2026"
              />
            </Field>

            <Field label="Order" hint="Lower numbers come first.">
              <TextInput
                type="number"
                value={draft.order}
                onChange={(e) => set("order", Number(e.target.value))}
              />
            </Field>

            <Field label="Icon" hint="Used when there is no image.">
              <Select
                value={draft.icon}
                onChange={(e) => set("icon", e.target.value)}
              >
                <option value="">None</option>
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Summary">
                <TextArea
                  value={draft.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Link" hint="Optional. Empty renders a static tile.">
                <TextInput
                  value={draft.href}
                  onChange={(e) => set("href", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              disabled={busy || !draft.title || !draft.slug}
              onClick={() =>
                run(
                  () =>
                    create({
                      token,
                      title: draft.title,
                      slug: draft.slug,
                      summary: draft.summary,
                      date: draft.date,
                      nodeId: draft.nodeId,
                      order: draft.order,
                      icon: draft.icon || undefined,
                      href: draft.href || undefined,
                    }),
                  () => setDraft(EMPTY)
                )
              }
            >
              <Plus size={14} className="mr-2 inline" />
              Add project
            </Button>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function ProjectRow({
  token,
  imageUrl,
  initial,
  busy,
  onSave,
  onDelete,
}: {
  token: string;
  imageUrl: string | null;
  initial: Draft;
  busy: boolean;
  onSave: (draft: Draft) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [open, setOpen] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-left font-display text-lg font-semibold tracking-tight"
        >
          <span className="mr-2 font-mono text-xs text-signal-blue">
            {draft.nodeId}
          </span>
          {draft.title || "Untitled"}
          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            #{draft.order}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {dirty && (
            <Button type="button" disabled={busy} onClick={() => onSave(draft)}>
              Save
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Edit"}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={busy}
            onClick={() => {
              if (window.confirm(`Delete "${draft.title}"? This cannot be undone.`)) {
                onDelete();
              }
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <Field label="Slug">
            <TextInput value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
          </Field>

          <Field label="Node id">
            <TextInput value={draft.nodeId} onChange={(e) => set("nodeId", e.target.value)} />
          </Field>

          <Field label="Date">
            <TextInput value={draft.date} onChange={(e) => set("date", e.target.value)} />
          </Field>

          <Field label="Order">
            <TextInput
              type="number"
              value={draft.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </Field>

          <Field label="Icon">
            <Select value={draft.icon} onChange={(e) => set("icon", e.target.value)}>
              <option value="">None</option>
              {ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Summary">
              <TextArea
                value={draft.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Link">
              <TextInput value={draft.href} onChange={(e) => set("href", e.target.value)} />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <ImageField
              token={token}
              imageId={draft.imageId ?? undefined}
              imageUrl={imageUrl}
              onChange={(value) => set("imageId", value)}
            />
          </div>
        </div>
      )}
    </Panel>
  );
}

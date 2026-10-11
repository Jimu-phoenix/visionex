"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ICON_NAMES } from "@/lib/icons";
import { Button, ErrorNote, Field, Panel, Select, TextArea, TextInput } from "./field";
import { ImageField } from "./image-field";

const ORIENTATIONS = ["landscape", "portrait", "square"] as const;

type ItemDraft = {
  title: string;
  nodeId: string;
  orientation: (typeof ORIENTATIONS)[number];
  order: number;
  caption: string;
  icon: string;
  imageId: string | null;
};

type SectionDraft = {
  title: string;
  description: string;
  nodeId: string;
  order: number;
};

const EMPTY_ITEM: ItemDraft = {
  title: "",
  nodeId: "",
  orientation: "landscape",
  order: 0,
  caption: "",
  icon: "",
  imageId: null,
};

const EMPTY_SECTION: SectionDraft = {
  title: "",
  description: "",
  nodeId: "",
  order: 0,
};

export function GalleryEditor({ token }: { token: string }) {
  const sections = useQuery(api.gallery.list);
  const createSection = useMutation(api.gallery.createSection);
  const updateSection = useMutation(api.gallery.updateSection);
  const removeSection = useMutation(api.gallery.removeSection);
  const createItem = useMutation(api.gallery.createItem);
  const updateItem = useMutation(api.gallery.updateItem);
  const removeItem = useMutation(api.gallery.removeItem);

  const [sectionDraft, setSectionDraft] = useState<SectionDraft>(EMPTY_SECTION);
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

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-signal-blue">N.02</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Gallery
          </h2>
        </div>
        <p className="text-sm text-ink-muted">
          {sections?.length ?? 0} sections ·{" "}
          {sections?.reduce((total, s) => total + s.items.length, 0) ?? 0} items
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <ErrorNote message={error} />

        {sections?.map((section) => (
          <Panel key={section._id}>
            <SectionRow
              token={token}
              initial={{
                title: section.title,
                description: section.description,
                nodeId: section.nodeId,
                order: section.order,
              }}
              items={section.items.map((item) => ({
                id: item._id,
                imageUrl: item.imageUrl,
                draft: {
                  title: item.title,
                  nodeId: item.nodeId,
                  orientation: item.orientation,
                  order: item.order,
                  caption: item.caption ?? "",
                  icon: item.icon ?? "",
                  imageId: item.imageId ?? null,
                },
              }))}
              busy={busy}
              onSave={(next) =>
                run(() => updateSection({ token, id: section._id, ...next }))
              }
              onDelete={() => {
                if (
                  window.confirm(
                    `Delete "${section.title}" and its ${section.items.length} items? This cannot be undone.`
                  )
                ) {
                  run(() => removeSection({ token, id: section._id }));
                }
              }}
              onCreateItem={(draft) =>
                run(() =>
                  createItem({
                    token,
                    sectionId: section._id,
                    title: draft.title,
                    nodeId: draft.nodeId,
                    orientation: draft.orientation,
                    order: draft.order,
                    caption: draft.caption || undefined,
                    icon: draft.icon || undefined,
                  })
                )
              }
              onSaveItem={(id, draft) =>
                run(() =>
                  updateItem({
                    token,
                    id,
                    title: draft.title,
                    nodeId: draft.nodeId,
                    orientation: draft.orientation,
                    order: draft.order,
                    caption: draft.caption || null,
                    icon: draft.icon || null,
                    imageId: draft.imageId,
                  })
                )
              }
              onDeleteItem={(id, title) => {
                if (window.confirm(`Delete "${title}"?`)) {
                  run(() => removeItem({ token, id }));
                }
              }}
            />
          </Panel>
        ))}

        <Panel>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            New section
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={sectionDraft.title}
                onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                placeholder="Graphics"
              />
            </Field>

            <Field label="Node id">
              <TextInput
                value={sectionDraft.nodeId}
                onChange={(e) => setSectionDraft({ ...sectionDraft, nodeId: e.target.value })}
                placeholder="N.05"
              />
            </Field>

            <Field label="Order">
              <TextInput
                type="number"
                value={sectionDraft.order}
                onChange={(e) =>
                  setSectionDraft({ ...sectionDraft, order: Number(e.target.value) })
                }
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Description">
                <TextArea
                  value={sectionDraft.description}
                  onChange={(e) =>
                    setSectionDraft({ ...sectionDraft, description: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              disabled={busy || !sectionDraft.title}
              onClick={() =>
                run(
                  () => createSection({ token, ...sectionDraft }),
                  () => setSectionDraft(EMPTY_SECTION)
                )
              }
            >
              <Plus size={14} className="mr-2 inline" />
              Add section
            </Button>
          </div>
        </Panel>
      </div>
    </section>
  );
}

type Item = {
  id: Id<"galleryItems">;
  imageUrl: string | null;
  draft: ItemDraft;
};

function SectionRow({
  token,
  initial,
  items,
  busy,
  onSave,
  onDelete,
  onCreateItem,
  onSaveItem,
  onDeleteItem,
}: {
  token: string;
  initial: SectionDraft;
  items: Item[];
  busy: boolean;
  onSave: (draft: SectionDraft) => void;
  onDelete: () => void;
  onCreateItem: (draft: ItemDraft) => void;
  onSaveItem: (id: Id<"galleryItems">, draft: ItemDraft) => void;
  onDeleteItem: (id: Id<"galleryItems">, title: string) => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [open, setOpen] = useState(false);
  const [itemDraft, setItemDraft] = useState<ItemDraft>(EMPTY_ITEM);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-left font-display text-lg font-semibold tracking-tight"
        >
          <span className="mr-2 font-mono text-xs text-signal-blue">{draft.nodeId}</span>
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
          <Button type="button" variant="danger" disabled={busy} onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Node id">
            <TextInput value={draft.nodeId} onChange={(e) => setDraft({ ...draft, nodeId: e.target.value })} />
          </Field>
          <Field label="Order">
            <TextInput
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <TextArea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </Field>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3 border-l border-border pl-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          Items
        </p>

        {items.map((item) => (
          <ItemRow
            key={item.id}
            token={token}
            imageUrl={item.imageUrl}
            initial={item.draft}
            busy={busy}
            onSave={(next) => onSaveItem(item.id, next)}
            onDelete={() => onDeleteItem(item.id, initial.title)}
          />
        ))}

        <Panel>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            New item
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={itemDraft.title}
                onChange={(e) => setItemDraft({ ...itemDraft, title: e.target.value })}
              />
            </Field>
            <Field label="Node id">
              <TextInput
                value={itemDraft.nodeId}
                onChange={(e) => setItemDraft({ ...itemDraft, nodeId: e.target.value })}
                placeholder="G.12"
              />
            </Field>
            <Field label="Order">
              <TextInput
                type="number"
                value={itemDraft.order}
                onChange={(e) => setItemDraft({ ...itemDraft, order: Number(e.target.value) })}
              />
            </Field>
            <Field label="Orientation">
              <Select
                value={itemDraft.orientation}
                onChange={(e) =>
                  setItemDraft({
                    ...itemDraft,
                    orientation: e.target.value as ItemDraft["orientation"],
                  })
                }
              >
                {ORIENTATIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Icon">
              <Select
                value={itemDraft.icon}
                onChange={(e) => setItemDraft({ ...itemDraft, icon: e.target.value })}
              >
                <option value="">None</option>
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Caption">
              <TextInput
                value={itemDraft.caption}
                onChange={(e) => setItemDraft({ ...itemDraft, caption: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Button
              type="button"
              disabled={busy || !itemDraft.title}
              onClick={() => {
                onCreateItem(itemDraft);
                setItemDraft(EMPTY_ITEM);
              }}
            >
              <Plus size={14} className="mr-2 inline" />
              Add item
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ItemRow({
  token,
  imageUrl,
  initial,
  busy,
  onSave,
  onDelete,
}: {
  token: string;
  imageUrl: string | null;
  initial: ItemDraft;
  busy: boolean;
  onSave: (draft: ItemDraft) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [open, setOpen] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-left font-mono text-sm text-ink"
        >
          <span className="mr-2 text-signal-blue">{draft.nodeId}</span>
          {draft.title || "Untitled"}
          <span className="ml-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            {draft.orientation} #{draft.order}
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
          <Button type="button" variant="danger" disabled={busy} onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Node id">
            <TextInput value={draft.nodeId} onChange={(e) => setDraft({ ...draft, nodeId: e.target.value })} />
          </Field>
          <Field label="Order">
            <TextInput
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
            />
          </Field>
          <Field label="Orientation">
            <Select
              value={draft.orientation}
              onChange={(e) =>
                setDraft({ ...draft, orientation: e.target.value as ItemDraft["orientation"] })
              }
            >
              {ORIENTATIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Icon">
            <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
              <option value="">None</option>
              {ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Caption">
            <TextInput value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              token={token}
              imageId={draft.imageId ?? undefined}
              imageUrl={imageUrl}
              onChange={(value) => setDraft({ ...draft, imageId: value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

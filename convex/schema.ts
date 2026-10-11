import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Content model. Everything here is editable from /admin.
 *
 * `nodeId` carries the design system's N.xx / G.xx numbering that the pages
 * render in mono — it is content, not derived, because the gaps in the sequence
 * are intentional (a section with no entry does not shift the numbers).
 *
 * `order` is an explicit number rather than relying on _creationTime, so
 * ordering can be changed from the admin without rewriting rows.
 *
 * `icon` is the *name* of a lucide icon, resolved to a component in
 * src/lib/icons.ts. A component reference cannot be stored here.
 *
 * `imageId` is a Convex storage ID. Queries resolve it to a URL with
 * ctx.storage.getUrl, so the client never handles the raw ID.
 */

const orientation = v.union(
  v.literal("portrait"),
  v.literal("landscape"),
  v.literal("square")
);

export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    /** Display date, e.g. "2026" or "Mar 2026". */
    date: v.string(),
    nodeId: v.string(),
    order: v.number(),
    icon: v.optional(v.string()),
    href: v.optional(v.string()),
    imageId: v.optional(v.string()),
  }).index("by_order", ["order"]),

  gallerySections: defineTable({
    nodeId: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  galleryItems: defineTable({
    sectionId: v.id("gallerySections"),
    nodeId: v.string(),
    title: v.string(),
    caption: v.optional(v.string()),
    orientation,
    order: v.number(),
    icon: v.optional(v.string()),
    imageId: v.optional(v.string()),
  }).index("by_section", ["sectionId"]),
});

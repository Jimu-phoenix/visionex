import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

/**
 * Gallery. Two tables: sections are the N.02 / N.03 / N.04 groups, items hang
 * off a section. Items get their own table so the admin can add, reorder, and
 * delete a single tile without rewriting its siblings.
 */

async function withImages<Doc extends { imageId?: string }>(
  ctx: QueryCtx | MutationCtx,
  docs: Doc[]
) {
  return Promise.all(
    docs.map(async (doc) => ({
      ...doc,
      imageUrl: doc.imageId ? await ctx.storage.getUrl(doc.imageId) : null,
    }))
  );
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("gallerySections")
      .withIndex("by_order")
      .collect();

    return Promise.all(
      sections.map(async (section) => {
        const items = await ctx.db
          .query("galleryItems")
          .withIndex("by_section", (q) => q.eq("sectionId", section._id))
          .collect();

        return { ...section, items: await withImages(ctx, items) };
      })
    );
  },
});

export const createSection = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.string(),
    nodeId: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const { token: _token, ...fields } = args;
    return ctx.db.insert("gallerySections", fields);
  },
});

export const updateSection = mutation({
  args: {
    token: v.string(),
    id: v.id("gallerySections"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    nodeId: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const { token: _token, id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return id;
  },
});

export const removeSection = mutation({
  args: { token: v.string(), id: v.id("gallerySections") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    const items = await ctx.db
      .query("galleryItems")
      .withIndex("by_section", (q) => q.eq("sectionId", args.id))
      .collect();

    for (const item of items) {
      if (item.imageId) await ctx.storage.delete(item.imageId);
      await ctx.db.delete(item._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const createItem = mutation({
  args: {
    token: v.string(),
    sectionId: v.id("gallerySections"),
    title: v.string(),
    nodeId: v.string(),
    orientation: v.union(
      v.literal("portrait"),
      v.literal("landscape"),
      v.literal("square")
    ),
    order: v.number(),
    caption: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const { token: _token, ...fields } = args;
    return ctx.db.insert("galleryItems", fields);
  },
});

export const updateItem = mutation({
  args: {
    token: v.string(),
    id: v.id("galleryItems"),
    title: v.optional(v.string()),
    nodeId: v.optional(v.string()),
    orientation: v.optional(
      v.union(v.literal("portrait"), v.literal("landscape"), v.literal("square"))
    ),
    order: v.optional(v.number()),
    caption: v.optional(v.union(v.string(), v.null())),
    icon: v.optional(v.union(v.string(), v.null())),
    imageId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    const { token: _token, id, ...fields } = args;

    // Deleting the old file on replace keeps storage from accumulating
    // superseded uploads.
    if (fields.imageId !== null && fields.imageId !== undefined) {
      const previous = await ctx.db.get(id);
      if (previous?.imageId && previous.imageId !== fields.imageId) {
        await ctx.storage.delete(previous.imageId);
      }
    }

    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== null)
    );
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const removeItem = mutation({
  args: { token: v.string(), id: v.id("galleryItems") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const item = await ctx.db.get(args.id);
    if (item?.imageId) await ctx.storage.delete(item.imageId);
    await ctx.db.delete(args.id);
  },
});

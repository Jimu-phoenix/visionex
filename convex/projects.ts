import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

/**
 * Projects. Public reads, admin-guarded writes.
 *
 * Reads resolve storage IDs to URLs before returning, so the client receives a
 * URL ready for next/image and never has to know about storage IDs.
 */

type Row = {
  nodeId: string;
  title: string;
  summary: string;
  date: string;
  icon?: string;
  href?: string;
  imageId?: string;
};

async function withImages<Doc extends Row>(
  ctx: QueryCtx,
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
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .collect();
    return withImages(ctx, rows);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    date: v.string(),
    nodeId: v.string(),
    order: v.number(),
    icon: v.optional(v.string()),
    href: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const { token: _token, ...fields } = args;
    return ctx.db.insert("projects", fields);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    date: v.optional(v.string()),
    nodeId: v.optional(v.string()),
    order: v.optional(v.number()),
    icon: v.optional(v.union(v.string(), v.null())),
    href: v.optional(v.union(v.string(), v.null())),
    imageId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    // undefined = leave alone, null = clear. Convex patches need the distinction
    // made explicit, so nullish values are converted to undefined before patch.
    const { token: _token, id, ...fields } = args;
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== null)
    );

    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("projects") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    // Drop the image too, otherwise storage files leak for the life of the
    // deployment every time a project is deleted.
    const row = await ctx.db.get(args.id);
    if (row?.imageId) await ctx.storage.delete(row.imageId);

    await ctx.db.delete(args.id);
  },
});

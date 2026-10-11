import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

/**
 * File uploads. Convex hands out a short-lived signed URL; the browser POSTs the
 * bytes straight to storage and never routes them through a Next.js route
 * handler. The returned storage ID is what gets stored on the row.
 */

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    return ctx.storage.generateUploadUrl();
  },
});

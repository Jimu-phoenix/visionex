import { v } from "convex/values";
import { action } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

/**
 * Checks a candidate token before /admin stores it, so a wrong secret fails at
 * unlock rather than at the first save.
 *
 * This is an action rather than a query for two reasons: it is an imperative
 * credential check that touches no table, and actions can be invoked on demand
 * from the client (useAction), whereas a query is declarative and would fire
 * the moment a token existed — including one just read back from localStorage.
 *
 * It grants nothing by itself. Every write mutation still calls assertAdmin, so
 * this is a usability improvement, not the security boundary: skipping it would
 * leave writes correctly rejected, just later and with a worse message.
 */
export const verify = action({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    return true;
  },
});

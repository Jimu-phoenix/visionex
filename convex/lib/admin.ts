import { ConvexError } from "convex/values";

/**
 * Admin authorisation for /admin.
 *
 * Single-operator model: one shared secret, stored as ADMIN_SECRET on the
 * Convex deployment (server-side env, never NEXT_PUBLIC_ so it cannot leak to
 * the browser bundle). The browser holds the token in localStorage and sends it
 * with every write; the comparison happens here, inside the function, so an
 * untrusted caller cannot forge it.
 *
 * This is deliberately not a session system. There is one operator and no user
 * accounts — if that ever changes, replace this with Convex Auth or an OIDC
 * provider rather than extending it.
 */

const UNAUTHORISED = "Not authorised.";

export async function assertAdmin(_ctx: unknown, token: string) {
  const expected = process.env.ADMIN_SECRET;

  if (!expected) {
    throw new ConvexError(
      "ADMIN_SECRET is not set on this deployment. Run: npx convex env set ADMIN_SECRET <value>"
    );
  }

  if (token !== expected) {
    throw new ConvexError(UNAUTHORISED);
  }
}

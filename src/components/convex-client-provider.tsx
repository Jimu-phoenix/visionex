"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

/**
 * Single ConvexReactClient for the whole app. Creating it at module scope means
 * client-side navigation between pages reuses the connection instead of opening
 * a new one.
 */

const url = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!url) {
  // Loud and actionable rather than a cryptic client error. `npx convex dev`
  // writes this variable into .env.local, so hitting this means that has not
  // been run yet.
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` to create a deployment and write .env.local."
  );
}

const convex = new ConvexReactClient(url);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

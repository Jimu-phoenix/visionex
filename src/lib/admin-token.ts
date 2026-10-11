"use client";

import { useSyncExternalStore } from "react";

/**
 * Admin token, held in localStorage and read by useAdminToken.
 *
 * Built on useSyncExternalStore rather than useState + useEffect so reading it
 * does not trigger the `react-hooks/set-state-in-effect` rule (four instances
 * of that already exist elsewhere in this app) and, more importantly, so the
 * snapshot is cached: useSyncExternalStore requires getSnapshot to return a
 * referentially stable value, which a naive localStorage read on every render
 * would not.
 */

const KEY = "phoenix.admin.token";

const listeners = new Set<() => void>();

let cached: string | null = null;
let loaded = false;

function getSnapshot(): string | null {
  // Server render has no localStorage; returning null here keeps the first paint
  // identical to the client's, so no hydration mismatch.
  if (typeof window === "undefined") return null;

  if (!loaded) {
    loaded = true;
    try {
      cached = window.localStorage.getItem(KEY);
    } catch {
      // Private browsing or blocked storage — treat as signed out.
      cached = null;
    }
  }

  return cached;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function setToken(next: string | null) {
  cached = next;
  loaded = true;

  try {
    if (next) window.localStorage.setItem(KEY, next);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Ignore: the in-memory value still works for this session.
  }

  for (const listener of listeners) listener();
}

export function useAdminToken() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export const adminToken = {
  set: setToken,
  clear: () => setToken(null),
};

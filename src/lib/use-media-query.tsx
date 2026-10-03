"use client";

import { useEffect, useState } from "react";

/**
 * Starts false on both server and client, then syncs after mount — same
 * tradeoff as the mounted-guard in theme-toggle.tsx (a brief flash of the
 * "false" layout is preferable to a hydration mismatch).
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handleChange = () => setMatches(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
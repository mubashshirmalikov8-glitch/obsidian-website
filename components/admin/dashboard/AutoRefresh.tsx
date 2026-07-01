"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-runs the dashboard server component every ~20s so live metrics stay
 *  fresh. Only refreshes while the tab is visible. Renders nothing. */
export function AutoRefresh({ intervalMs = 20_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}

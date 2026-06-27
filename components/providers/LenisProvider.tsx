"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis-instance";

/**
 * Smooth scroll via Lenis, driven by a standard requestAnimationFrame loop.
 *
 * Respects prefers-reduced-motion by disabling wheel smoothing (native scroll).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    setLenis(lenis);
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    // Drive Lenis with rAF (the timestamp is already in ms, as Lenis expects).
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}

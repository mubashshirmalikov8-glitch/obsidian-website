"use client";

import { MotionConfig } from "motion/react";
import { LenisProvider } from "./LenisProvider";

/** Client-side provider stack: smooth scroll + motion config (no WebGL). */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisProvider>
  );
}

"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  strength?: number;
};

/**
 * Premium magnetic button — content eases toward the cursor on hover.
 * Renders an <a> when `href` is provided, otherwise a <button>.
 */
export function MagneticButton({
  href,
  onClick,
  children,
  className,
  variant = "primary",
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function handleMove(e: React.PointerEvent) {
    if (reduce) return; // no magnetic pull under reduced motion
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const classes = cn(
    "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-medium tracking-wide outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060a]",
    variant === "primary"
      ? "border border-ion/45 bg-[linear-gradient(180deg,rgba(94,230,255,0.16),rgba(94,230,255,0.07))] text-starlight [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.16),0_10px_34px_-10px_rgba(94,230,255,0.4)] hover:border-ion/70 hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.22),0_16px_46px_-10px_rgba(94,230,255,0.55)]"
      : "border border-white/15 bg-white/[0.02] text-starlight [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/30 hover:bg-white/[0.06]",
    className,
  );

  const inner = (
    <motion.span style={{ x: sx, y: sy }} className="inline-flex items-center gap-2.5">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        className={classes}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}

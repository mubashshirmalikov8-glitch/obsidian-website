"use client";

import { motion } from "motion/react";
import { EASE_REVEAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Shared eyebrow + title + intro header with an in-view reveal. */
export function SectionHeader({
  label,
  title,
  intro,
  accent = "ion",
}: {
  label: string;
  title: string;
  intro?: string;
  accent?: "ion" | "ember";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_REVEAL }}
      className="mx-auto max-w-3xl text-center"
    >
      <span
        className={cn(
          "font-mono text-[11px] uppercase tracking-label",
          accent === "ember" ? "text-ember" : "text-ion",
        )}
      >
        {label}
      </span>
      <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-tight tracking-tight text-starlight">
        {title}
      </h2>
      {intro ? (
        <p className="mx-auto mt-4 max-w-xl text-balance text-sm text-dust sm:text-base">
          {intro}
        </p>
      ) : null}
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE_REVEAL } from "@/lib/motion";

/**
 * Restrained count-up. Animates only the numeric part of a stat (e.g. "$170K",
 * "17 m²") from 0 to its value once, on reveal — no spring, bounce, odometer, or
 * blur. The true value is rendered server-side and only primed to 0 while the
 * card is off-screen (Results sits below the fold, so the reset never shows), so
 * SSR / no-JS keep the real numbers. Reduced-motion shows the final value instantly.
 */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const match = /^(\D*)([\d.]+)(.*)$/.exec(value);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : NaN;
  const suffix = match?.[3] ?? "";

  const [n, setN] = useState(Number.isFinite(target) ? target : 0);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    if (reduce) {
      setN(target);
      return;
    }
    if (!inView) {
      setN(0); // primed off-screen; never visible (section is below the fold)
      return;
    }
    // Gentle decelerate spreads the count across the full ~1s (EASE_REVEAL is too
    // front-loaded — the rounded integer would hit target in ~0.3s). No bounce.
    const controls = animate(0, target, {
      duration: 1.0,
      ease: "easeOut",
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, reduce, target]);

  if (!Number.isFinite(target)) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(n)}
      {suffix}
    </span>
  );
}

export function Results() {
  const { dict } = useDictionary();
  const r = dict.results;

  return (
    <section id="results" className="relative px-6 py-28 sm:py-32">
      <SectionHeader label={r.label} title={r.title} intro={r.intro} />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
        {r.stats.map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_REVEAL }}
            className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-stat border border-hairline bg-glass-2 p-6 text-center shadow-elev-1 backdrop-blur-xl transition-[transform,border-color,background-color,box-shadow] duration-500 ease-standard hover:-translate-y-1.5 hover:border-hairline-strong hover:bg-glass-3 hover:shadow-elev-2-ion sm:min-h-[176px] sm:p-8"
          >
            {/* soft top light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(94,230,255,0.06), transparent 70%)" }}
            />

            <div
              className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-none tracking-tight tabular-nums transition-transform duration-500 ease-standard group-hover:scale-[1.04]"
              style={{
                color: "#eef2fb",
                background: "linear-gradient(180deg, #f3f6ff 0%, #b6c2d8 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <CountUp value={st.value} />
            </div>
            <div className="mx-auto mt-3 max-w-[15ch] text-[12.5px] leading-snug text-dust sm:text-[13.5px]">
              {st.label}
            </div>

            {/* accent line — sweeps in on hover */}
            <span className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-center scale-x-50 bg-gradient-to-r from-transparent via-ion to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-standard group-hover:scale-x-100 group-hover:opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

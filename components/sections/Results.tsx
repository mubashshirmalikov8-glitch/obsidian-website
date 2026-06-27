"use client";

import { motion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Results() {
  const { dict } = useDictionary();
  const r = dict.results;

  return (
    <section id="results" className="relative px-6 py-28 sm:py-32">
      <SectionHeader label={r.label} title={r.title} intro={r.intro} />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {r.stats.map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.05] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.09),0_30px_60px_-36px_rgba(0,0,0,0.85),0_0_0_1px_rgba(94,230,255,0.14)] sm:min-h-[176px] sm:p-8"
          >
            {/* soft top light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(94,230,255,0.06), transparent 70%)" }}
            />

            <div
              className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-none tracking-tight tabular-nums transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              style={{
                color: "#eef2fb",
                background: "linear-gradient(180deg, #f3f6ff 0%, #b6c2d8 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {st.value}
            </div>
            <div className="mx-auto mt-3 max-w-[15ch] text-[12.5px] leading-snug text-dust sm:text-[13.5px]">
              {st.label}
            </div>

            {/* accent line — sweeps in on hover */}
            <span className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-center scale-x-50 bg-gradient-to-r from-transparent via-ion to-transparent opacity-0 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

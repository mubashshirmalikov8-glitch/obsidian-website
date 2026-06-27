"use client";

import { motion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Services() {
  const { dict } = useDictionary();
  const s = dict.services;

  return (
    <section id="services" className="relative px-6 py-28 sm:py-32">
      <SectionHeader label={s.label} title={s.title} intro={s.intro} />

      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-4">
        {s.items.map((it, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.09),0_30px_60px_-36px_rgba(0,0,0,0.85),0_0_0_1px_rgba(94,230,255,0.14)] sm:w-[calc(50%-0.5rem)] sm:p-7 lg:w-[calc(33.333%-0.667rem)]"
          >
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-ion/70">
              <span className="h-px w-4 bg-ion/45 transition-all duration-500 group-hover:w-6 group-hover:bg-ion/80" />
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-[1.05rem] font-semibold leading-tight tracking-tight text-starlight sm:text-lg">
              {it.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-dust">
              {it.desc}
            </p>
            <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-ion/80 via-ion/40 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE_REVEAL } from "@/lib/motion";

export function Services() {
  const { dict } = useDictionary();
  const s = dict.services;

  return (
    <section id="services" className="relative px-6 py-28 sm:py-32">
      <SectionHeader label={s.label} title={s.title} intro={s.intro} />

      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-6">
        {s.items.map((it, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE_REVEAL }}
            className="group relative w-full overflow-hidden rounded-card border border-hairline bg-glass-2 p-6 shadow-elev-1 backdrop-blur-xl transition-[transform,border-color,background-color,box-shadow] duration-500 ease-standard hover:-translate-y-1.5 hover:border-hairline-strong hover:bg-glass-3 hover:shadow-elev-2-ion sm:w-[calc(50%-0.5rem)] sm:p-7 lg:w-[calc(33.333%-0.667rem)]"
          >
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-label text-ion/70">
              <span className="h-px w-4 bg-ion/45 transition-[width,background-color] duration-500 ease-standard group-hover:w-6 group-hover:bg-ion/80" />
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-[1.05rem] font-semibold leading-tight tracking-tight text-starlight sm:text-lg">
              {it.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-dust">
              {it.desc}
            </p>
            <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-ion/80 via-ion/40 to-transparent transition-transform duration-500 ease-standard group-hover:scale-x-100" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

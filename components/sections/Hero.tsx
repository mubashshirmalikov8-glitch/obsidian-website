"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { HeroWave } from "@/components/hero/HeroWave";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/lib/lenis-instance";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { dict } = useDictionary();
  const ref = useRef<HTMLElement>(null);

  // Small, calm parallax on scroll (no scale-up so the photo stays sharp).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-6 pb-[16vh] text-center sm:pb-[14vh]"
    >
      {/* ---- Background: minimal animated canvas wave (no image / WebGL) ---- */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0">
        {/* Obsidian base + drifting blue/violet ribbons, rendered on Canvas 2D */}
        <HeroWave className="absolute inset-0" />

        {/* Cinematic vignette — centre stays open, edges settle into obsidian */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 105% at 50% 42%, rgba(4,5,10,0) 46%, rgba(4,5,10,0.32) 74%, rgba(4,5,10,0.7) 100%)",
          }}
        />
        {/* Readability scrim — a touch at the top for the nav, grounded at the base */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,5,10,0.45) 0%, rgba(4,5,10,0.04) 22%, rgba(4,5,10,0.04) 50%, rgba(4,5,10,0.34) 70%, rgba(4,5,10,0.72) 86%, rgba(4,5,10,0.97) 100%)",
          }}
        />
      </motion.div>

      {/* ---- Content ---- */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex w-full max-w-4xl flex-col items-center"
      >
        {/* Headline — mask reveal (rises into view from a clip) */}
        <h1 className="font-display text-[clamp(2.3rem,5.6vw,5rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-starlight [text-shadow:0_4px_34px_rgba(4,5,10,0.85)]">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
              className="block text-balance"
            >
              {dict.hero.title}
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.55, ease: EASE }}
          className="mt-8 max-w-xl text-balance text-[15px] leading-relaxed text-starlight/75 [text-shadow:0_1px_16px_rgba(4,5,10,0.9)] sm:text-[17px]"
        >
          {dict.hero.subtitle}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.78, ease: EASE }}
          className="mt-11"
        >
          <MagneticButton
            href="#team"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#team");
            }}
          >
            {dict.hero.cta}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden
            >
              <path
                d="M8 2.5v11M8 13.5 3.5 9M8 13.5 12.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

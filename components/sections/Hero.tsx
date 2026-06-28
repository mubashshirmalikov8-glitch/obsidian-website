"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { HeroWave } from "@/components/hero/HeroWave";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/lib/lenis-instance";
import { track } from "@/lib/analytics";
import { EASE_REVEAL } from "@/lib/motion";

export function Hero() {
  const { dict } = useDictionary();
  const ref = useRef<HTMLElement>(null);

  // Small, calm parallax on scroll (content + wave drift gently, stay sharp).
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

        {/* Cinematic vignette — centre stays open, edges settle into bg/void */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 105% at 50% 42%, rgba(5,6,10,0) 46%, rgba(5,6,10,0.32) 74%, rgba(5,6,10,0.7) 100%)",
          }}
        />
        {/* Readability scrim — a touch at the top for the nav, grounded at the base */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,6,10,0.45) 0%, rgba(5,6,10,0.04) 22%, rgba(5,6,10,0.04) 50%, rgba(5,6,10,0.34) 70%, rgba(5,6,10,0.72) 86%, rgba(5,6,10,0.97) 100%)",
          }}
        />
      </motion.div>

      {/* ---- Content ---- */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex w-full max-w-4xl flex-col items-center"
      >
        {/* Headline — clip-mask reveal. The text is painted immediately (no
            opacity gate) so it stays the LCP element per DS v2 §3.4; only the
            rise out of the clip animates. Calm, cinematic tempo kept.
            DS type/display, EXCEPT the clamp min is held at 2.3rem (not the DS
            2.5rem): at 2.5rem the longest RU word ("маркетплейсов.") clips at
            ≤390px. Everything else (5.5vw, 5rem cap, 1.05, -0.02em) is DS. */}
        <h1 className="font-display text-[clamp(2.3rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-starlight [text-shadow:0_4px_34px_rgba(5,6,10,0.85)]">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, delay: 0.2, ease: EASE_REVEAL }}
              className="block text-balance"
            >
              {dict.hero.title}
            </motion.span>
          </span>
        </h1>

        {/* Subtitle — DS text/secondary would be `dust`, but per the approved
            Hero exception (Decision B) it stays luminous (starlight/75) for
            legibility over the animated wave. No blur filter (DS reveal = y + opacity). */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.55, ease: EASE_REVEAL }}
          className="mt-8 max-w-xl text-balance text-[15px] leading-relaxed text-starlight/75 [text-shadow:0_1px_16px_rgba(5,6,10,0.9)] sm:text-[17px]"
        >
          {dict.hero.subtitle}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.78, ease: EASE_REVEAL }}
          className="mt-12"
        >
          <MagneticButton
            href="#team"
            onClick={(e) => {
              e.preventDefault();
              track("cta_click", { location: "hero", label: "view_team", target: "#team" });
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

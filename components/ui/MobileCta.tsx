"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { scrollToSection } from "@/lib/lenis-instance";
import { track } from "@/lib/analytics";
import { EASE_REVEAL } from "@/lib/motion";

/**
 * Restrained mobile-only sticky CTA (phones only). It appears once the hero has
 * scrolled away and hides whenever the questionnaire (#enroll) or the final CTA
 * (#cta) is on screen, so it never covers form controls or duplicates the
 * finale. Premium glass pill — native to OBSIDIAN, not a sales banner.
 */
export function MobileCta() {
  const { dict } = useDictionary();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ids = ["hero", "enroll", "cta"] as const;
    const els = ids.map((id) => document.getElementById(id));
    // Assume the hero is in view on load so the CTA stays hidden initially.
    const onScreen: Record<string, boolean> = { hero: true, enroll: false, cta: false };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) onScreen[e.target.id] = e.isIntersecting;
        setVisible(!onScreen.hero && !onScreen.enroll && !onScreen.cta);
      },
      { threshold: 0, rootMargin: "-10% 0px -10% 0px" },
    );

    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  function go() {
    track("cta_click", { location: "mobile_sticky", label: "consult" });
    scrollToSection("#enroll");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 20 }}
          transition={{ duration: 0.4, ease: EASE_REVEAL }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:hidden"
        >
          <button
            type="button"
            onClick={go}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-ion/45 bg-[linear-gradient(180deg,rgba(94,230,255,0.16),rgba(94,230,255,0.07))] px-6 py-3.5 text-sm font-medium tracking-wide text-starlight outline-none backdrop-blur-2xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.16),0_12px_34px_-10px_rgba(94,230,255,0.5)] transition-transform duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            {dict.cta.consult}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

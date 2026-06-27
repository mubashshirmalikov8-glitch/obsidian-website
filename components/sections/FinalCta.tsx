"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { scrollToSection } from "@/lib/lenis-instance";
import { cn } from "@/lib/cn";

type Phase = "idle" | "format" | "tariff";

const EASE = [0.16, 1, 0.3, 1] as const;

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: EASE },
};

export function FinalCta() {
  const { dict } = useDictionary();
  const c = dict.cta;
  const [phase, setPhase] = useState<Phase>("idle");

  function goEnroll() {
    scrollToSection("#enroll");
  }

  return (
    <section id="cta" className="relative px-6 py-28 sm:py-36">
      <SectionHeader label={c.label} title={c.title} intro={c.subtitle} accent="ember" />

      <div className="relative mx-auto mt-14 max-w-3xl">
        {/* Calm ember ambient glow — gives the finale warmth and depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-16 bottom-0"
          style={{
            background:
              "radial-gradient(58% 64% at 50% 28%, rgba(255,106,61,0.11), transparent 72%)",
          }}
        />

        {/* Premium glass console — same language as the questionnaire */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.07),0_36px_100px_-44px_rgba(0,0,0,0.85)] sm:p-10"
        >
          {/* soft inner top light */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, rgba(255,106,61,0.08), transparent 76%)",
            }}
          />
          {/* thin top hairline accent */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-ember/45 to-transparent"
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  {...fade}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <MagneticButton onClick={goEnroll} variant="primary">
                    {c.consult}
                  </MagneticButton>
                  <MagneticButton onClick={() => setPhase("format")} variant="ghost">
                    {c.buyCourse}
                  </MagneticButton>
                </motion.div>
              )}

              {phase === "format" && (
                <motion.div key="format" {...fade}>
                  <Stepline title={c.courseTitle} onBack={() => setPhase("idle")} back={c.back} />
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OptionCard
                      title={c.online}
                      desc={c.onlineDesc}
                      onClick={() => setPhase("tariff")}
                      select={c.select}
                    />
                    <OptionCard
                      title={c.offline}
                      desc={c.offlineDesc}
                      onClick={() => setPhase("tariff")}
                      select={c.select}
                    />
                  </div>
                </motion.div>
              )}

              {phase === "tariff" && (
                <motion.div key="tariff" {...fade}>
                  <Stepline
                    title={c.tariffsTitle}
                    onBack={() => setPhase("format")}
                    back={c.back}
                  />
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <OptionCard title={c.start} desc={c.startDesc} onClick={goEnroll} select={c.select} />
                    <OptionCard
                      title={c.pro}
                      desc={c.proDesc}
                      onClick={goEnroll}
                      select={c.select}
                      featured
                    />
                    <OptionCard
                      title={c.premium}
                      desc={c.premiumDesc}
                      onClick={goEnroll}
                      select={c.select}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stepline({
  title,
  onBack,
  back,
}: {
  title: string;
  onBack: () => void;
  back: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-xs uppercase tracking-[0.2em] text-dust transition-colors hover:text-starlight"
      >
        ← {back}
      </button>
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-dust-dim">
        {title}
      </span>
    </div>
  );
}

function OptionCard({
  title,
  desc,
  onClick,
  select,
  featured = false,
}: {
  title: string;
  desc: string;
  onClick: () => void;
  select: string;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 text-left backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1",
        featured
          ? "border-ember/40 bg-ember/[0.06] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.08),var(--shadow-glow-ember)] hover:border-ember/60"
          : "border-white/10 bg-white/[0.04] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-white/25 hover:bg-white/[0.07] hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.09),0_30px_60px_-36px_rgba(0,0,0,0.85)]",
      )}
    >
      <h3 className="font-display text-xl font-semibold text-starlight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-dust">{desc}</p>
      <span
        className={cn(
          "mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
          featured ? "text-ember" : "text-ion",
        )}
      >
        {select}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
}

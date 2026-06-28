"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import {
  LEAD_STEPS,
  CHOICE_OPTIONS,
  CHOICE_COLS,
  leadSchema,
  type LeadStep,
  type LeadInput,
} from "@/lib/lead-schema";
import { cn } from "@/lib/cn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLeadIntent } from "@/lib/lead-intent";
import { track } from "@/lib/analytics";
import { EASE_REVEAL } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";
type Values = Partial<Record<LeadStep, string>>;

const TEXT_STEPS = new Set<LeadStep>(["name", "phone"]);

/**
 * In-page lead-capture questionnaire (4 steps → Supabase). Premium glass console
 * matching the rest of the page; no longer a gate — the page is freely scrollable.
 */
export function Questionnaire() {
  const { dict, locale } = useDictionary();
  const form = dict.form;
  // Course intent carried over from the Final CTA (format + tariff), if any.
  const intent = useLeadIntent();

  // Crisp step transition: x + opacity slide, no blur. Reduced motion → opacity only.
  const reduce = useReducedMotion();
  const stepVariants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir > 0 ? 44 : -44 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir > 0 ? -44 : 44 }),
  };

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot: bots fill this hidden field, humans never see it.
  const [website, setWebsite] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const step = LEAD_STEPS[stepIndex];
  const isLast = stepIndex === LEAD_STEPS.length - 1;
  const isText = TEXT_STEPS.has(step);
  const fieldCopy = form.fields[step];

  useEffect(() => {
    if (isText) {
      const t = setTimeout(() => inputRef.current?.focus(), 360);
      return () => clearTimeout(t);
    }
  }, [stepIndex, isText]);

  // Funnel: record each step the user actually sees.
  useEffect(() => {
    track("questionnaire_step_view", { step, index: stepIndex });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  function goTo(next: number, dir: number) {
    setDirection(dir);
    setError(null);
    setStepIndex(next);
  }

  function validateText(): boolean {
    const result = leadSchema.shape[step as "name" | "phone"].safeParse(
      values[step] ?? "",
    );
    if (!result.success) {
      setError(step === "name" ? form.errors.name : form.errors.phone);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (isText && !validateText()) return;
    if (!isText && !values[step]) {
      setError(form.errors.choice);
      return;
    }
    track("questionnaire_field_complete", { step, index: stepIndex });
    if (isLast) void submit(values);
    else goTo(stepIndex + 1, 1);
  }

  function selectChoice(value: string) {
    const next = { ...values, [step]: value };
    setValues(next);
    setError(null);
    track("questionnaire_field_complete", { step, index: stepIndex });
    if (isLast) void submit(next);
    else setTimeout(() => goTo(stepIndex + 1, 1), 240);
  }

  async function submit(payload: Values) {
    track("questionnaire_submit_attempt");
    // Merge in any course intent (format/tariff) selected in the Final CTA.
    const parsed = leadSchema.safeParse({ ...payload, locale, ...intent });
    if (!parsed.success) {
      setError(form.errors.network);
      track("questionnaire_submit_error", { reason: "client_validation" });
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // `website` is the honeypot; empty for real users, stripped server-side.
        body: JSON.stringify({ ...(parsed.data satisfies LeadInput), website }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        track("questionnaire_submit_success");
      } else {
        setStatus("error");
        setError(form.errors.network);
        track("questionnaire_submit_error", { reason: `http_${res.status}` });
      }
    } catch {
      setStatus("error");
      setError(form.errors.network);
      track("questionnaire_submit_error", { reason: "network" });
    }
  }

  function reset() {
    setValues({});
    setWebsite("");
    setStepIndex(0);
    setDirection(-1);
    setStatus("idle");
    setError(null);
  }

  return (
    <section
      id="enroll"
      className="relative flex min-h-[92svh] items-center justify-center px-6 py-28"
    >
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-label text-ion/90">
            {form.eyebrow}
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.08] tracking-tight text-starlight">
            {form.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-dust sm:text-[15px]">
            {form.subtitle}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-hairline bg-white/[0.04] p-8 shadow-elev-3 backdrop-blur-2xl sm:p-12">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <SuccessPanel
                key="success"
                title={form.success.title}
                subtitle={form.success.subtitle}
                again={form.success.again}
                onAgain={reset}
              />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Honeypot — visually hidden, off the tab order, ignored by AT.
                    Real users never fill it; bots do → server drops the lead. */}
                <div aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0">
                  <label htmlFor="company-website">Company website</label>
                  <input
                    id="company-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="mb-10 flex items-center gap-4">
                  <div className="flex flex-1 gap-1.5">
                    {LEAD_STEPS.map((s, i) => (
                      <span
                        key={s}
                        className={cn(
                          "h-[3px] flex-1 rounded-full transition-colors duration-500 ease-standard",
                          i <= stepIndex ? "bg-ion/70" : "bg-white/10",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-muted tabular-nums">
                    {String(stepIndex + 1).padStart(2, "0")} / {String(LEAD_STEPS.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="min-h-[14rem]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: EASE_REVEAL }}
                    >
                      <label
                        htmlFor={isText ? `q-${step}` : undefined}
                        className="block font-display text-2xl font-medium leading-snug tracking-tight text-starlight sm:text-[28px]"
                      >
                        {fieldCopy.q}
                      </label>

                      {isText ? (
                        <input
                          ref={inputRef}
                          id={`q-${step}`}
                          type={step === "phone" ? "tel" : "text"}
                          inputMode={step === "phone" ? "tel" : "text"}
                          autoComplete={step === "phone" ? "tel" : "name"}
                          value={values[step] ?? ""}
                          placeholder={"ph" in fieldCopy ? fieldCopy.ph : ""}
                          onChange={(e) => setValues((v) => ({ ...v, [step]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleNext();
                            }
                          }}
                          className="mt-8 w-full border-b border-white/15 bg-transparent pb-4 font-display text-[26px] text-starlight outline-none transition-colors duration-300 placeholder:text-dust-dim/50 focus:border-ion/70 sm:text-3xl"
                        />
                      ) : (
                        <div className={cn("mt-8 grid gap-2.5", CHOICE_COLS[step as "gender" | "age"])}>
                          {CHOICE_OPTIONS[step as "gender" | "age"].map((opt) => {
                            const isSel = values[step] === opt;
                            const labels = (fieldCopy as { options: Record<string, string> }).options;
                            return (
                              <button
                                key={opt}
                                type="button"
                                data-value={opt}
                                onClick={() => selectChoice(opt)}
                                aria-pressed={isSel}
                                className={cn(
                                  "rounded-xl border px-4 py-4 text-center text-sm outline-none transition-[transform,border-color,background-color,color,box-shadow] duration-300 ease-standard focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                                  isSel
                                    ? "border-ion/55 bg-ion/[0.08] text-starlight"
                                    : "border-white/10 bg-white/[0.02] text-dust hover:border-white/25 hover:bg-white/[0.04] hover:text-starlight",
                                )}
                              >
                                {labels[opt]}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {error && <p className="mt-5 font-mono text-xs text-ember/90">{error}</p>}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => stepIndex > 0 && goTo(stepIndex - 1, -1)}
                    disabled={stepIndex === 0}
                    className={cn(
                      "rounded font-mono text-[11px] uppercase tracking-[0.22em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                      stepIndex === 0
                        ? "cursor-not-allowed text-dust-dim/30"
                        : "text-dust hover:text-starlight",
                    )}
                  >
                    ← {form.back}
                  </button>

                  {(isText || isLast) && (
                    <MagneticButton onClick={handleNext} variant="primary" strength={0.3}>
                      {status === "submitting" ? form.submitting : isLast ? form.submit : form.next}
                    </MagneticButton>
                  )}
                </div>

                {isText && (
                  <p className="mt-5 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {form.enterHint}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SuccessPanel({
  title,
  subtitle,
  again,
  onAgain,
}: {
  title: string;
  subtitle: string;
  again: string;
  onAgain: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_REVEAL }}
      className="flex flex-col items-center py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: EASE_REVEAL }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-ion/35 bg-ion/[0.06]"
      >
        <svg width="30" height="30" viewBox="0 0 34 34" fill="none" aria-hidden>
          <path
            d="M9 17.5l5 5 11-11"
            stroke="#5ee6ff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-starlight sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3.5 max-w-sm text-balance text-sm leading-relaxed text-dust">
        {subtitle}
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-9 font-mono text-[11px] uppercase tracking-[0.22em] text-muted transition-colors duration-300 hover:text-ion"
      >
        {again}
      </button>
    </motion.div>
  );
}

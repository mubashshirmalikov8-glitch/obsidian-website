"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE_REVEAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Founder (Rashid) + AI engineer (Mubashshir) carry the warm ember accent. */
const FLAGSHIP = new Set([0, 6]);

/**
 * Real portrait drop-in (no layout change needed). Drop a file at each `src`
 * (e.g. `public/team/rashid.jpg`) and it appears automatically; until then the
 * monogram placeholder shows. Tune `position` (object-position) per member so
 * the face is framed nicely.
 */
// Per-portrait framing. Faces are centred horizontally (X=50%); Y is tuned to
// each photo's aspect + head height so every face sits in the upper third with
// headroom and never gets cropped. (asilbek/behruz are exactly 4:5 → no crop.)
const PHOTOS: { src: string; position: string }[] = [
  { src: "/team/rashid.jpg", position: "50% 14%" }, // 0.666, face high
  { src: "/team/zafarbek.jpg", position: "50% 22%" }, // 0.666
  { src: "/team/muhammad-ali.jpg", position: "50% 32%" }, // 0.666
  { src: "/team/asilbek.jpg", position: "50% 30%" }, // 0.800 (full frame)
  { src: "/team/behruz.jpg", position: "50% 30%" }, // 0.800 (full frame)
  { src: "/team/khusan.jpg", position: "50% 28%" }, // 0.750
  { src: "/team/mubashshir.jpg", position: "50% 30%" }, // 0.750
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function TeamSection() {
  const { dict } = useDictionary();
  const members = dict.team.members;

  return (
    <section id="team" className="relative px-6 py-28 sm:py-32">
      <SectionHeader
        label={dict.team.label}
        title={dict.team.title}
        intro={dict.team.intro}
      />

      <div className="relative mx-auto mt-16 flex max-w-6xl flex-wrap justify-center gap-6">
        {members.map((m, i) => (
          <TeamCard
            key={i}
            index={i}
            name={m.name}
            role={m.role}
            flagship={FLAGSHIP.has(i)}
            photo={PHOTOS[i]}
            delay={(i % 3) * 0.08}
          />
        ))}
      </div>
    </section>
  );
}

function TeamCard({
  index,
  name,
  role,
  flagship,
  photo,
  delay,
}: {
  index: number;
  name: string;
  role: string;
  flagship: boolean;
  photo: { src: string; position: string };
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_REVEAL }}
      className={cn(
        "group relative w-full overflow-hidden rounded-card border border-hairline bg-glass-2 shadow-elev-1 backdrop-blur-xl transition-[transform,border-color,background-color,box-shadow] duration-500 ease-standard",
        "hover:-translate-y-1.5 hover:border-hairline-strong hover:bg-glass-3",
        flagship ? "hover:shadow-elev-2-ember" : "hover:shadow-elev-2-ion",
        "sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]",
      )}
    >
      {/* ---- Portrait: real photo drops in over the monogram placeholder ---- */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* duotone placeholder base — gently zooms on hover */}
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-standard group-hover:scale-[1.06]"
          style={{
            background: flagship
              ? "radial-gradient(135% 100% at 28% 12%, #2c2014 0%, #150e0a 52%, #07080d 100%)"
              : "radial-gradient(135% 100% at 28% 12%, #123445 0%, #0a1824 52%, #06080d 100%)",
          }}
        />
        {/* soft top light for dimension */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(58% 36% at 30% 2%, rgba(255,255,255,0.07), transparent 72%)" }}
        />
        {/* monogram placeholder (hidden once a real photo loads on top) */}
        <span className="absolute inset-0 flex items-center justify-center pb-5 font-display text-[5.75rem] font-semibold leading-none text-white/[0.07] transition-[transform,color] duration-700 ease-standard group-hover:scale-[1.07] group-hover:text-white/[0.11]">
          {initials(name)}
        </span>

        {/* real portrait — object-position framed, lazy fade-in, hover zoom */}
        <CardPhoto src={photo.src} position={photo.position} alt={name} />

        {/* glass overlay + dark readability gradient (over photo + placeholder) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,13,0.18) 0%, rgba(6,8,13,0) 28%, rgba(6,8,13,0) 52%, rgba(7,8,13,0.9) 100%)",
          }}
        />

        {/* thin inner frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-inset border border-white/[0.07]"
        />
        {/* corner index with accent tick */}
        <span className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[11px] tracking-label text-white/55">
          <span className={cn("h-px w-4", flagship ? "bg-ember/60" : "bg-ion/60")} />
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* accent line */}
        <span
          className={cn(
            "absolute inset-x-5 bottom-0 h-px origin-center scale-x-75 opacity-60 transition-[transform,opacity] duration-500 ease-standard group-hover:scale-x-100 group-hover:opacity-100",
            flagship
              ? "bg-gradient-to-r from-transparent via-ember to-transparent"
              : "bg-gradient-to-r from-transparent via-ion to-transparent",
          )}
        />
        {/* hover sheen */}
        <span className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-[900ms] ease-standard group-hover:translate-x-[130%]" />
      </div>

      {/* ---- Info ---- */}
      <div className="px-5 pb-6 pt-5 sm:px-6">
        <h3 className="font-display text-[1.05rem] font-semibold leading-tight tracking-tight text-starlight sm:text-xl">
          {name}
        </h3>
        <p
          className={cn(
            "mt-2 text-[13px] leading-snug",
            flagship ? "text-ember/90" : "text-ion/90",
          )}
        >
          {role}
        </p>
      </div>
    </motion.article>
  );
}

/**
 * Real portrait image. Lazy-loaded, fades in gracefully on load, and falls back
 * to the monogram placeholder (returns null) if the file isn't there yet.
 */
function CardPhoto({
  src,
  position,
  alt,
}: {
  src: string;
  position: string;
  alt: string;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const ref = useRef<HTMLImageElement>(null);

  // A cached image can finish loading before React attaches `onLoad`, leaving
  // the fade-in stuck at opacity-0. Catch that already-complete case on mount.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setState("loaded");
  }, []);

  if (state === "error") return null;
  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      fill
      // Cards render at ~350–400px across breakpoints; let the optimizer pick a
      // matched (DPR-aware) width rather than shipping the full-res source.
      sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 380px"
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
      style={{ objectPosition: position }}
      className={cn(
        "object-cover transition-[opacity,transform] duration-[1200ms] ease-standard group-hover:scale-[1.06]",
        state === "loaded" ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

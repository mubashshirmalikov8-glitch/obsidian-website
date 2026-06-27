import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Smoothly scroll to a target (selector or element), respecting reduced motion. */
export function scrollToSection(target: string | HTMLElement) {
  const lenis = getLenis();
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (lenis && !reduce) {
    lenis.scrollTo(target, {
      offset: 0,
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

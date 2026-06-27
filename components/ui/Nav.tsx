"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/dictionary-context";
import { LangSwitcher } from "./LangSwitcher";
import { cn } from "@/lib/cn";

/** Floating glass top nav: wordmark + language switcher. Condenses on scroll. */
export function Nav() {
  const { dict, locale } = useDictionary();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full border border-white/[0.08] px-5 py-3 transition-all duration-500 sm:px-6 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.07),0_10px_30px_-14px_rgba(0,0,0,0.6)]",
          scrolled
            ? "border-white/[0.1] bg-void/70 backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.09),0_14px_38px_-16px_rgba(0,0,0,0.72)]"
            : "bg-white/[0.025] backdrop-blur-md",
        )}
      >
        <Link
          href={`/${locale}`}
          className="font-display text-lg font-semibold tracking-[0.2em] text-starlight"
        >
          {dict.brand.name}
        </Link>
        <LangSwitcher active={locale} />
      </nav>
    </header>
  );
}

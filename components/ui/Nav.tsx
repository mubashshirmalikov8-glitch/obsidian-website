"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/dictionary-context";
import { LangSwitcher } from "./LangSwitcher";
import { cn } from "@/lib/cn";

/** Floating glass top nav: wordmark + language switcher. Glass deepens on scroll. */
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
          "flex w-full max-w-6xl items-center justify-between rounded-full border px-5 py-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-standard sm:px-6",
          scrolled
            ? "border-white/10 bg-void/70 shadow-nav-scrolled backdrop-blur-xl"
            : "border-hairline bg-glass-1 shadow-nav backdrop-blur-md",
        )}
      >
        <Link
          href={`/${locale}`}
          className={cn(
            "rounded-md font-display text-lg font-semibold tracking-wordmark text-starlight outline-none",
            "[text-shadow:0_0_0_rgba(94,230,255,0)] transition-[color,text-shadow] duration-300 ease-standard",
            "hover:text-white hover:[text-shadow:0_0_18px_rgba(94,230,255,0.22)]",
            "focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
          )}
        >
          {dict.brand.name}
        </Link>
        <LangSwitcher active={locale} />
      </nav>
    </header>
  );
}

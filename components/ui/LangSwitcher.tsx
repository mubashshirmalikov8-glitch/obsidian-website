"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { localeLabels, isLocale, type Locale } from "@/i18n/config";
import { EASE_STANDARD } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Locales shown in the UI. EN routes + translations remain in the codebase
 * (config still lists "en"); it's just hidden from the switcher for now.
 */
const DISPLAY_LOCALES: Locale[] = ["uz", "ru"];

/** UZ / RU language switcher that preserves the current path under the new locale. */
export function LangSwitcher({ active }: { active: Locale }) {
  const pathname = usePathname();

  function hrefFor(target: Locale): string {
    const segments = pathname.split("/");
    // segments[0] === "" ; segments[1] is the current locale
    if (segments.length > 1 && isLocale(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    return segments.join("/") || `/${target}`;
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-hairline bg-glass-1 p-0.5 backdrop-blur-md"
      role="group"
      aria-label="Language"
    >
      {DISPLAY_LOCALES.map((loc) => {
        const isActive = loc === active;
        return (
          <Link
            key={loc}
            href={hrefFor(loc)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-meta outline-none transition-colors duration-300 ease-standard",
              "focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
              isActive ? "text-ion" : "text-dust hover:text-starlight",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="langActivePill"
                aria-hidden
                transition={{ duration: 0.32, ease: EASE_STANDARD }}
                className="absolute inset-0 rounded-full bg-control-selected"
              />
            )}
            <span className="relative z-10">{localeLabels[loc]}</span>
          </Link>
        );
      })}
    </div>
  );
}

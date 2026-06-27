"use client";

import { useDictionary } from "@/i18n/dictionary-context";

export function Footer() {
  const { dict } = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-display text-3xl font-semibold tracking-[0.2em] text-starlight">
            {dict.brand.name}
          </div>
          <p className="mt-3 max-w-sm text-balance text-sm text-dust">
            {dict.footer.tagline}
          </p>
        </div>
        <div className="text-sm text-dust-dim sm:text-right">
          <p>{dict.footer.madeBy}</p>
          <p className="mt-1 font-mono text-xs">
            © {year} {dict.brand.name}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

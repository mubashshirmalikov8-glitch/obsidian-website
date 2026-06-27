import type { Locale } from "./config";
import type en from "./messages/en.json";

// The English file is the source of truth for the dictionary shape.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uz: () => import("./messages/uz.json").then((m) => m.default as Dictionary),
  ru: () => import("./messages/ru.json").then((m) => m.default as Dictionary),
  en: () => import("./messages/en.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.uz)();
}

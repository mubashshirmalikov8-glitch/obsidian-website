"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./get-dictionary";

type DictionaryContextValue = {
  dict: Dictionary;
  locale: Locale;
};

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  dict,
  locale,
  children,
}: DictionaryContextValue & { children: React.ReactNode }) {
  return (
    <DictionaryContext.Provider value={{ dict, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): DictionaryContextValue {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return ctx;
}

/** Convenience: returns just the dictionary object. */
export function useT(): Dictionary {
  return useDictionary().dict;
}

import { useSyncExternalStore } from "react";

/**
 * Cross-section lead intent (course format + tariff).
 *
 * A visitor expresses intent in the Final CTA (Online/Offline → Start/Pro/
 * Premium) and then completes the questionnaire in a different section. This
 * tiny module-level store carries that intent across components so it reaches
 * the lead — no provider wiring needed (same idiom as `lenis-instance`).
 */

export type LeadFormat = "online" | "offline";
export type LeadTariff = "start" | "pro" | "premium";
export type LeadIntent = { format?: LeadFormat; tariff?: LeadTariff };

let intent: LeadIntent = {};
const listeners = new Set<() => void>();

/** Merge a partial intent (e.g. just the format, then just the tariff). */
export function setLeadIntent(patch: LeadIntent): void {
  intent = { ...intent, ...patch };
  listeners.forEach((l) => l());
}

export function getLeadIntent(): LeadIntent {
  return intent;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Subscribe to the current intent from a client component. */
export function useLeadIntent(): LeadIntent {
  // getLeadIntent returns a stable ref until setLeadIntent replaces it, so it's
  // safe as both the client and server snapshot.
  return useSyncExternalStore(subscribe, getLeadIntent, getLeadIntent);
}

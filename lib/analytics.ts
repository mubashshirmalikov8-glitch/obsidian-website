/**
 * Lightweight, vendor-agnostic analytics event layer.
 *
 * No external dependency and no PII. Every event is:
 *   1. pushed to `window.dataLayer` (GTM / GA4-ready),
 *   2. forwarded to any analytics provider that happens to be installed
 *      (gtag / Plausible / PostHog) — all no-ops until one is configured,
 *   3. logged to the console in dev or when debug mode is on, so events are
 *      verifiable without any vendor wired up yet.
 *
 * Client-only: every call is a no-op during SSR.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "questionnaire_step_view"
  | "questionnaire_field_complete"
  | "questionnaire_submit_attempt"
  | "questionnaire_submit_success"
  | "questionnaire_submit_error"
  | "course_format_click"
  | "course_tariff_click";

export type AnalyticsProps = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
    posthog?: { capture?: (event: string, props?: AnalyticsProps) => void };
  }
}

/** Whether to mirror events to the console (verification aid). */
function debugEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1") return true;
  try {
    return window.localStorage.getItem("obsidian_debug") === "1";
  } catch {
    return false;
  }
}

/**
 * Record an analytics event. Safe to call from anywhere in a client component.
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  const payload = { event, ts: Date.now(), ...props };

  // 1. GTM / GA4 dataLayer — the durable, vendor-agnostic sink.
  (window.dataLayer ??= []).push(payload);

  // 2. Forward to any installed provider (no-op until one is configured).
  try {
    window.gtag?.("event", event, props ?? {});
    window.plausible?.(event, props ? { props } : undefined);
    window.posthog?.capture?.(event, props ?? {});
  } catch {
    /* never let analytics break a user interaction */
  }

  // 3. Console mirror for verification.
  if (debugEnabled()) {
    // eslint-disable-next-line no-console
    console.info(
      `%c[analytics] ${event}`,
      "color:#5ee6ff;font-weight:600",
      props ?? {},
    );
  }
}

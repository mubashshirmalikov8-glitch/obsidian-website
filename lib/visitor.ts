// Client-side visitor identity + beat sender for the invisible VisitorTracker.
// No PII; ids are random UUIDs. Never imports the service-role client.

const VID_KEY = "obsidian_vid"; // persistent per browser (localStorage)
const SID_KEY = "obsidian_sid"; // per visit (sessionStorage)

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getVisitorId(): string {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = uuid();
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return uuid();
  }
}

export function getSessionId(): string {
  try {
    let s = sessionStorage.getItem(SID_KEY);
    if (!s) {
      s = uuid();
      sessionStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    return uuid();
  }
}

export type TrackPayload = {
  session_id: string;
  visitor_id: string;
  current_page: string;
  current_section?: string | null;
  locale?: string | null;
  referrer?: string | null;
  source?: string | null;
};

/** Fire-and-forget beat to /api/track. Never throws (must not affect the page). */
export function sendBeat(payload: TrackPayload, useBeacon = false): void {
  try {
    const body = JSON.stringify(payload);
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* swallow — analytics must never break the experience */
  }
}

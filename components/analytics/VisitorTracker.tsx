"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getVisitorId, getSessionId, sendBeat, type TrackPayload } from "@/lib/visitor";

/**
 * Invisible visitor tracker. Renders nothing and makes no visual/UX change.
 * - first-visit beat (with first-touch referrer/source)
 * - heartbeat every 30s (+ sendBeacon on tab-hide/unload)
 * - beat on route change
 * - current_section via a passive IntersectionObserver on existing section[id]s
 */
const SECTION_IDS = ["hero", "team", "services", "results", "enroll", "cta"];
const HEARTBEAT_MS = 30_000;
const isLoc = (s: string) => s === "uz" || s === "ru" || s === "en";

export function VisitorTracker() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const sectionRef = useRef<string | null>(null);
  const idsRef = useRef<{ vid: string; sid: string } | null>(null);
  const pageChangeInit = useRef(false);

  pathRef.current = pathname;

  function locale(): string | null {
    const seg = pathRef.current.split("/")[1];
    return isLoc(seg) ? seg : null;
  }
  function ids() {
    return (idsRef.current ??= { vid: getVisitorId(), sid: getSessionId() });
  }
  function beat(useBeacon = false, extra?: Partial<TrackPayload>) {
    const { vid, sid } = ids();
    sendBeat(
      {
        session_id: sid,
        visitor_id: vid,
        current_page: pathRef.current,
        current_section: sectionRef.current,
        locale: locale(),
        ...extra,
      },
      useBeacon,
    );
  }

  // First beat (first-touch referrer/source) + heartbeat + unload beacons.
  useEffect(() => {
    let referrer: string | null = null;
    let source: string | null = null;
    try {
      referrer = document.referrer || null;
      const usp = new URLSearchParams(window.location.search);
      source = usp.get("utm_source") || (referrer ? new URL(referrer).host : null);
    } catch {
      /* noop */
    }
    beat(false, { referrer, source });

    const interval = setInterval(() => beat(false), HEARTBEAT_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") beat(true);
    };
    const onPageHide = () => beat(true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Beat on route change (skip the initial mount — the first effect covers it).
  useEffect(() => {
    if (!pageChangeInit.current) {
      pageChangeInit.current = true;
      return;
    }
    beat(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Passive section tracking: keep the most-visible section id in a ref; it's
  // reported with the next heartbeat / route change (not per change).
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        let top: string | null = null;
        let max = 0;
        for (const [id, ratio] of visible) {
          if (ratio > max) {
            max = ratio;
            top = id;
          }
        }
        if (top) sectionRef.current = top;
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

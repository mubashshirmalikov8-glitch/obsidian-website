import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { parseUserAgent } from "@/lib/user-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generous per-IP rate limit — heartbeats are ~2/min per session; allow NAT.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

const trackSchema = z.object({
  session_id: z.string().uuid(),
  visitor_id: z.string().uuid(),
  current_page: z.string().max(200),
  current_section: z.string().max(60).nullish(),
  locale: z.enum(["uz", "ru", "en"]).nullish(),
  referrer: z.string().max(400).nullish(),
  source: z.string().max(120).nullish(),
});

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) return new NextResponse(null, { status: 429 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = trackSchema.safeParse(json);
  if (!parsed.success) return new NextResponse(null, { status: 422 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return new NextResponse(null, { status: 204 }); // dev w/o creds: no-op

  const { device, browser, os } = parseUserAgent(req.headers.get("user-agent"));
  const d = parsed.data;

  // last_seen + current_* on every beat; started_at (default) untouched on update.
  const row: Record<string, unknown> = {
    session_id: d.session_id,
    visitor_id: d.visitor_id,
    last_seen: new Date().toISOString(),
    current_page: d.current_page,
    current_section: d.current_section ?? null,
    locale: d.locale ?? null,
    device,
    browser,
    os,
  };
  // First-touch only (sent on the first beat, absent on heartbeats).
  if (d.referrer != null) row.referrer = d.referrer;
  if (d.source != null) row.source = d.source;

  const { error } = await supabase
    .from("visitor_sessions")
    .upsert(row, { onConflict: "session_id" });
  if (error) {
    console.error("[track] upsert failed:", error.message);
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

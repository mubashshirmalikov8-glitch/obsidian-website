import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // per-request: rate limiting + headers

// ---- Basic in-memory rate limiter -----------------------------------------
// Per-instance (resets on cold start) — adequate abuse control for a single
// lead form. Swap for a shared store (Upstash/Redis) if traffic grows.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// ---- Obvious-spam heuristics on the free-text name -------------------------
const SPAM_RE = /https?:\/\/|www\.|\[url|<a\s|\bviagra\b|\bcasino\b/i;
function looksSpammy(name: string): boolean {
  if (SPAM_RE.test(name)) return true;
  if (/(.)\1{6,}/.test(name)) return true; // 7+ of the same char in a row
  return false;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: a hidden `website` field real users never see. If it's filled,
  // it's a bot — respond 200 (so the bot can't learn the trap) but never store.
  const honey =
    typeof (json as { website?: unknown })?.website === "string"
      ? (json as { website: string }).website.trim()
      : "";
  if (honey) {
    console.warn("[lead] rejected: honeypot tripped", { ip });
    return NextResponse.json({ ok: true, stored: false });
  }

  const parsed = leadSchema.safeParse(json); // unknown keys (e.g. website) stripped
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (looksSpammy(parsed.data.name)) {
    console.warn("[lead] rejected: spam heuristic", { ip });
    return NextResponse.json({ error: "spam" }, { status: 422 });
  }

  const lead = {
    ...parsed.data,
    source: "onboarding",
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    // Production MUST NOT silently drop real leads behind a success screen.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[lead] Supabase not configured in production — lead NOT stored:",
        lead,
      );
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    // Dev/local only: log and report unstored so the form stays demonstrable.
    console.warn(
      "[lead] Supabase not configured (dev) — logging only. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Lead:",
      lead,
    );
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("leads").insert(lead);
  if (error) {
    console.error("[lead] insert failed:", error.message);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}

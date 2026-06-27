import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const lead = {
    ...parsed.data,
    source: "onboarding",
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  const supabase = getSupabaseAdmin();

  // Graceful fallback: no credentials yet → log and report success so the
  // questionnaire is fully demonstrable before Supabase is wired up.
  if (!supabase) {
    console.warn(
      "[lead] Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY). Lead:",
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

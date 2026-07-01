import { getSupabaseAdmin } from "@/lib/supabase";

// Server-only analytics reads (service-role). RLS stays deny-all; nothing here
// is ever exposed to the browser.

export type VisitorMetrics = {
  online: number; // unique visitors seen in the last 60s
  today: number; // unique visitors whose session started today
  month: number; // unique visitors in the last 30 days
  daily: { date: string; count: number }[]; // last 30 days (UTC), for the chart
};

export async function getVisitorMetrics(): Promise<VisitorMetrics> {
  const empty: VisitorMetrics = { online: 0, today: 0, month: 0, daily: [] };
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty;

  const now = Date.now();
  const since = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("visitor_sessions")
    .select("visitor_id, started_at, last_seen")
    .gte("started_at", since)
    .limit(50_000);
  if (error || !data) return empty;

  const onlineCut = now - 60 * 1000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const online = new Set<string>();
  const today = new Set<string>();
  const month = new Set<string>();
  const perDay = new Map<string, Set<string>>();

  for (const r of data) {
    month.add(r.visitor_id);
    if (new Date(r.last_seen).getTime() > onlineCut) online.add(r.visitor_id);
    if (new Date(r.started_at) >= todayStart) today.add(r.visitor_id);
    const key = String(r.started_at).slice(0, 10); // YYYY-MM-DD (UTC)
    let set = perDay.get(key);
    if (!set) perDay.set(key, (set = new Set()));
    set.add(r.visitor_id);
  }

  const daily: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const key = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    daily.push({ date: key, count: perDay.get(key)?.size ?? 0 });
  }

  return { online: online.size, today: today.size, month: month.size, daily };
}

export type LeadMetrics = { total: number; today: number };

export async function getLeadMetrics(): Promise<LeadMetrics> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { total: 0, today: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalRes, todayRes] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
  ]);

  return { total: totalRes.count ?? 0, today: todayRes.count ?? 0 };
}

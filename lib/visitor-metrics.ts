import { getSupabaseAdmin } from "@/lib/supabase";
import type { AdminLead } from "@/lib/lead-status";

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

export type OnlineVisitor = {
  visitor_id: string;
  current_page: string | null;
  current_section: string | null;
  device: string | null;
  locale: string | null;
  last_seen: string;
  became_lead: boolean;
};

/** Currently-online visitors (last_seen < 60s), unique per visitor (latest). */
export async function getOnlineVisitors(limit = 20): Promise<OnlineVisitor[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const cut = new Date(Date.now() - 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("visitor_sessions")
    .select("visitor_id, current_page, current_section, device, locale, last_seen, became_lead")
    .gte("last_seen", cut)
    .order("last_seen", { ascending: false })
    .limit(200);
  if (error || !data) return [];

  const seen = new Set<string>();
  const out: OnlineVisitor[] = [];
  for (const r of data as OnlineVisitor[]) {
    if (seen.has(r.visitor_id)) continue;
    seen.add(r.visitor_id);
    out.push(r);
    if (out.length >= limit) break;
  }
  return out;
}

/** Most recent leads for the dashboard widget. */
export async function getRecentLeads(limit = 8): Promise<AdminLead[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as AdminLead[];
}

export type ConversionSummary = {
  visitors: number; // unique visitors (30d)
  converted: number; // unique visitors who became a lead (30d)
  rate: number; // converted / visitors (0–1)
};

/** Visitor → lead conversion over the last 30 days (based on became_lead). */
export async function getConversionSummary(): Promise<ConversionSummary> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { visitors: 0, converted: 0, rate: 0 };

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("visitor_sessions")
    .select("visitor_id, became_lead")
    .gte("started_at", since)
    .limit(50_000);
  if (error || !data) return { visitors: 0, converted: 0, rate: 0 };

  const visitors = new Set<string>();
  const converted = new Set<string>();
  for (const r of data) {
    visitors.add(r.visitor_id);
    if (r.became_lead) converted.add(r.visitor_id);
  }
  const rate = visitors.size ? converted.size / visitors.size : 0;
  return { visitors: visitors.size, converted: converted.size, rate };
}

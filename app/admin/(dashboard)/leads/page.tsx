import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AdminLead } from "@/lib/lead-status";
import { LeadsView } from "./LeadsView";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type SearchParams = Record<string, string | string[] | undefined>;

function pick(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v ?? "").trim();
}

// Strip PostgREST filter metacharacters so a search term can't break out of
// the .or() filter string (filter injection).
function sanitize(q: string): string {
  return q.replace(/[,()*\\%]/g, "").slice(0, 80);
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const q = pick(sp.q);
  const status = pick(sp.status);
  const format = pick(sp.format);
  const tariff = pick(sp.tariff);
  const locale = pick(sp.locale);
  const page = Math.max(1, parseInt(pick(sp.page) || "1", 10) || 1);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <p className="text-sm text-dust">
        Supabase is not configured (missing service-role key).
      </p>
    );
  }

  let query = supabase.from("leads").select("*", { count: "exact" });

  const safeQ = sanitize(q);
  if (safeQ) query = query.or(`name.ilike.%${safeQ}%,phone.ilike.%${safeQ}%`);
  if (status) query = query.eq("status", status);
  if (format) query = query.eq("format", format);
  if (tariff) query = query.eq("tariff", tariff);
  if (locale) query = query.eq("locale", locale);

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  return (
    <LeadsView
      leads={(data ?? []) as AdminLead[]}
      total={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      filters={{ q, status, format, tariff, locale }}
      error={error?.message ?? null}
    />
  );
}

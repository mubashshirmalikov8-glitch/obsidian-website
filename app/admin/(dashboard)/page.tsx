import { requireAdmin } from "@/lib/admin-auth";
import { getVisitorMetrics, getLeadMetrics } from "@/lib/visitor-metrics";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard. Live stat cards from server-side (service-role) metrics.
 * The 30-day visitor chart is deferred to a later phase (data already exists
 * in getVisitorMetrics().daily).
 */
export default async function AdminDashboardPage() {
  await requireAdmin();
  const [v, l] = await Promise.all([getVisitorMetrics(), getLeadMetrics()]);

  const cards: { label: string; value: number }[] = [
    { label: "Online now", value: v.online },
    { label: "Visitors today", value: v.today },
    { label: "Visitors this month", value: v.month },
    { label: "Leads today", value: l.today },
    { label: "Total leads", value: l.total },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-starlight">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-dust">Live overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-hairline bg-white/[0.03] p-5">
            <p className="font-mono text-[10px] uppercase tracking-label text-muted">{c.label}</p>
            <p className="mt-3 font-display text-2xl tabular-nums text-starlight">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

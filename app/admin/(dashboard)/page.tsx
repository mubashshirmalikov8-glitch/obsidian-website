import { requireAdmin } from "@/lib/admin-auth";
import {
  getVisitorMetrics,
  getLeadMetrics,
  getOnlineVisitors,
  getRecentLeads,
  getConversionSummary,
} from "@/lib/visitor-metrics";
import { AutoRefresh } from "@/components/admin/dashboard/AutoRefresh";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { VisitorChart } from "@/components/admin/dashboard/VisitorChart";
import { LiveVisitors } from "@/components/admin/dashboard/LiveVisitors";
import { LatestLeads } from "@/components/admin/dashboard/LatestLeads";
import { ConversionSummary } from "@/components/admin/dashboard/ConversionSummary";

export const dynamic = "force-dynamic";

/** Premium admin dashboard — live KPIs, 30-day chart, live visitors, latest
 *  leads and conversion, on a ~20s auto-refresh. Admin-only. */
export default async function AdminDashboardPage() {
  await requireAdmin();

  const [v, l, online, recent, conv] = await Promise.all([
    getVisitorMetrics(),
    getLeadMetrics(),
    getOnlineVisitors(),
    getRecentLeads(8),
    getConversionSummary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <AutoRefresh />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-starlight">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-dust">Live overview.</p>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ion/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ion" />
          </span>
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Online now" value={v.online} live />
        <KpiCard label="Visitors today" value={v.today} />
        <KpiCard label="Visitors · 30d" value={v.month} />
        <KpiCard label="Leads today" value={l.today} accent="ember" />
        <KpiCard label="Total leads" value={l.total} accent="ember" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-hairline bg-white/[0.03] p-5 lg:col-span-2">
          <VisitorChart data={v.daily} />
        </div>
        <LiveVisitors visitors={online} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestLeads leads={recent} />
        </div>
        <ConversionSummary data={conv} />
      </div>
    </div>
  );
}

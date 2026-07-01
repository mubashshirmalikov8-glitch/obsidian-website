import Link from "next/link";
import type { AdminLead } from "@/lib/lead-status";
import { StatusBadge } from "@/app/admin/(dashboard)/leads/LeadsView";

function ago(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function LatestLeads({ leads }: { leads: AdminLead[] }) {
  return (
    <div className="rounded-2xl border border-hairline bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-label text-muted">Latest leads</p>
        <Link
          href="/admin/leads"
          className="font-mono text-[10px] uppercase tracking-label text-ion outline-none transition-colors hover:text-ion-soft focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
        >
          View all →
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="py-6 text-center text-sm text-dust-dim">No leads yet.</p>
      ) : (
        <ul className="divide-y divide-hairline/60">
          {leads.map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm text-starlight">{l.name}</p>
                <p className="font-mono text-[10px] text-muted">
                  {[l.format, l.tariff].filter(Boolean).join(" · ") || "consult"} · {ago(l.created_at)}
                </p>
              </div>
              <span className="ml-auto shrink-0">
                <StatusBadge status={l.status} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

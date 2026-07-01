"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type AdminLead,
  type LeadStatus,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_BADGE,
} from "@/lib/lead-status";
import { FORMATS, TARIFFS, LOCALES } from "@/lib/lead-schema";
import { cn } from "@/lib/cn";
import { LeadDrawer } from "./LeadDrawer";

type Filters = {
  q: string;
  status: string;
  format: string;
  tariff: string;
  locale: string;
};

function fmt(iso: string): string {
  // Deterministic (UTC) — avoids SSR/CSR hydration drift from locale/timezone.
  return iso.slice(0, 16).replace("T", " ");
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-label",
        LEAD_STATUS_BADGE[status] ?? LEAD_STATUS_BADGE.new,
      )}
    >
      {LEAD_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function LeadsView({
  leads,
  total,
  page,
  pageSize,
  filters,
  error,
}: {
  leads: AdminLead[];
  total: number;
  page: number;
  pageSize: number;
  filters: Filters;
  error: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSp = useSearchParams();
  const [selected, setSelected] = useState<AdminLead | null>(null);
  const [search, setSearch] = useState(filters.q);

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(currentSp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) p.set(k, v);
        else p.delete(k);
      }
      if (!("page" in updates)) p.delete("page"); // reset to page 1 on filter change
      router.push(`${pathname}?${p.toString()}`);
    },
    [currentSp, pathname, router],
  );

  // Debounced search on name/phone.
  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim() !== filters.q) setParams({ q: search.trim() });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const selectCls =
    "rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-starlight outline-none focus:border-ion/60";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-starlight">
            Leads
          </h1>
          <p className="mt-1.5 text-sm text-dust">
            {total} total · showing {start}–{end}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap gap-2.5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone…"
          className="min-w-[200px] flex-1 rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-starlight outline-none placeholder:text-dust-dim/60 focus:border-ion/60"
        />
        <select
          value={filters.status}
          onChange={(e) => setParams({ status: e.target.value })}
          className={selectCls}
          aria-label="Status"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={filters.format}
          onChange={(e) => setParams({ format: e.target.value })}
          className={selectCls}
          aria-label="Format"
        >
          <option value="">All formats</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={filters.tariff}
          onChange={(e) => setParams({ tariff: e.target.value })}
          className={selectCls}
          aria-label="Tariff"
        >
          <option value="">All tariffs</option>
          {TARIFFS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filters.locale}
          onChange={(e) => setParams({ locale: e.target.value })}
          className={selectCls}
          aria-label="Locale"
        >
          <option value="">All locales</option>
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-ember/30 bg-ember/[0.06] px-4 py-3 font-mono text-xs text-ember/90">
          Failed to load leads: {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-hairline">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline bg-white/[0.02] text-left font-mono text-[10px] uppercase tracking-label text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">Format</th>
              <th className="px-4 py-3 font-normal">Tariff</th>
              <th className="px-4 py-3 font-normal">Locale</th>
              <th className="px-4 py-3 font-normal">Created</th>
              <th className="px-4 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-dust">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="cursor-pointer border-b border-hairline/60 transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-starlight">{lead.name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-dust">{lead.phone}</td>
                  <td className="px-4 py-3 text-dust">{lead.format ?? "—"}</td>
                  <td className="px-4 py-3 text-dust">{lead.tariff ?? "—"}</td>
                  <td className="px-4 py-3 uppercase text-dust">{lead.locale ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-dust-dim">
                    {fmt(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setParams({ page: String(page - 1) })}
            className="rounded-lg border border-hairline px-3 py-1.5 text-sm text-dust outline-none transition-colors hover:border-hairline-strong hover:text-starlight disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setParams({ page: String(page + 1) })}
            className="rounded-lg border border-hairline px-3 py-1.5 text-sm text-dust outline-none transition-colors hover:border-hairline-strong hover:text-starlight disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

import type { OnlineVisitor } from "@/lib/visitor-metrics";

function ago(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m`;
}

export function LiveVisitors({ visitors }: { visitors: OnlineVisitor[] }) {
  return (
    <div className="rounded-2xl border border-hairline bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ion/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ion" />
        </span>
        <p className="font-mono text-[10px] uppercase tracking-label text-muted">Live visitors</p>
        <span className="ml-auto font-display text-sm tabular-nums text-starlight">{visitors.length}</span>
      </div>

      {visitors.length === 0 ? (
        <p className="py-6 text-center text-sm text-dust-dim">No one online right now.</p>
      ) : (
        <ul className="space-y-2.5">
          {visitors.map((v) => (
            <li key={v.visitor_id} className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 truncate font-mono text-[11px] uppercase text-ion">
                {v.current_section ?? "—"}
              </span>
              <span className="min-w-0 flex-1 truncate text-dust">{v.current_page ?? "—"}</span>
              <span className="shrink-0 font-mono text-[10px] text-muted">
                {(v.device ?? "").slice(0, 7)}
                {v.locale ? ` · ${v.locale.toUpperCase()}` : ""} · {ago(v.last_seen)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

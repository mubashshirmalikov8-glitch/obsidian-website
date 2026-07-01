import type { ConversionSummary as CS } from "@/lib/visitor-metrics";

export function ConversionSummary({ data }: { data: CS }) {
  const pct = Math.round(data.rate * 1000) / 10; // one decimal
  const barPct = Math.min(100, data.rate * 100);

  return (
    <div className="rounded-2xl border border-hairline bg-white/[0.03] p-5">
      <p className="font-mono text-[10px] uppercase tracking-label text-muted">Conversion · 30 days</p>
      <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-starlight">{pct}%</p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#5ee6ff,#ff6a3d)]"
          style={{ width: `${barPct}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between font-mono text-[11px]">
        <span className="text-dust">{data.visitors} visitors</span>
        <span className="text-ember">{data.converted} converted</span>
      </div>
    </div>
  );
}

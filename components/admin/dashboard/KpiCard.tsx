import { cn } from "@/lib/cn";

/** Premium KPI card — OBSIDIAN glass + subtle top-light, ion/ember accent. */
export function KpiCard({
  label,
  value,
  accent = "ion",
  live = false,
}: {
  label: string;
  value: number | string;
  accent?: "ion" | "ember";
  live?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-hairline bg-white/[0.03] p-5 transition-colors duration-300 hover:border-hairline-strong">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{
          background:
            accent === "ember"
              ? "radial-gradient(60% 100% at 50% 0%, rgba(255,106,61,0.08), transparent 76%)"
              : "radial-gradient(60% 100% at 50% 0%, rgba(94,230,255,0.08), transparent 76%)",
        }}
      />
      <div className="relative flex items-center gap-2">
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ion/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ion" />
          </span>
        )}
        <p className="font-mono text-[10px] uppercase tracking-label text-muted">{label}</p>
      </div>
      <p
        className={cn(
          "relative mt-3 font-display text-3xl font-semibold tabular-nums",
          accent === "ember" ? "text-ember" : "text-starlight",
        )}
      >
        {value}
      </p>
    </div>
  );
}

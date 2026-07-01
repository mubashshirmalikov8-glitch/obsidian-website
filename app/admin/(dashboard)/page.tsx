const PLACEHOLDERS = [
  "Online now",
  "Visitors today",
  "Visitors this month",
  "Leads today",
  "Total leads",
];

/**
 * Empty dashboard shell (Phase 1). Metrics, leads table and visitor tracking
 * arrive in later phases — these are inert placeholders only.
 */
export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-starlight">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-dust">
          Overview &amp; metrics land in a later phase.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {PLACEHOLDERS.map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-hairline bg-white/[0.03] p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-label text-muted">
              {label}
            </p>
            <p className="mt-3 font-display text-2xl text-dust-dim">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}

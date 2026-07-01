"use client";

import { useState } from "react";

type Pt = { date: string; count: number };

const fmt = (iso: string) => {
  const parts = (iso ?? "").split("-");
  return parts.length === 3 ? `${parts[2]}.${parts[1]}` : "";
};

/** Dependency-free premium SVG area chart of daily unique visitors (30d). */
export function VisitorChart({ data }: { data: Pt[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 220;
  const padX = 10;
  const padTop = 16;
  const padBottom = 22;
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.count));
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const x = (i: number) => (n <= 1 ? padX + innerW / 2 : padX + i * (innerW / (n - 1)));
  const y = (v: number) => padTop + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.count).toFixed(1)}`).join(" ");
  const area =
    n > 0
      ? `${line} L${x(n - 1).toFixed(1)},${(padTop + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padTop + innerH).toFixed(1)} Z`
      : "";

  const total = data.reduce((a, d) => a + d.count, 0);
  const peak = Math.max(0, ...data.map((d) => d.count));
  const shown = hover != null ? data[hover] : null;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (n <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * W;
    let idx = Math.round(((rx - padX) / innerW) * (n - 1));
    idx = Math.max(0, Math.min(n - 1, idx));
    setHover(idx);
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-label text-muted">Visitors · 30 days</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-starlight">{total}</p>
        </div>
        <p className="font-mono text-[11px] text-dust">
          {shown ? `${shown.count} on ${fmt(shown.date)}` : `peak ${peak}`}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Daily unique visitors over the last 30 days"
      >
        <defs>
          <linearGradient id="vc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ee6ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5ee6ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((g, i) => {
          const gy = padTop + innerH * g;
          return (
            <line key={i} x1={padX} x2={W - padX} y1={gy} y2={gy} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          );
        })}

        {area && <path d={area} fill="url(#vc-fill)" />}
        {line && (
          <path
            d={line}
            fill="none"
            stroke="#5ee6ff"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {shown && (
          <g>
            <line
              x1={x(hover!)}
              x2={x(hover!)}
              y1={padTop}
              y2={padTop + innerH}
              stroke="rgba(94,230,255,0.4)"
              strokeWidth="1"
            />
            <circle cx={x(hover!)} cy={y(shown.count)} r="3.5" fill="#5ee6ff" />
          </g>
        )}
      </svg>

      {n > 0 && (
        <div className="mt-2 flex justify-between font-mono text-[9px] text-muted">
          <span>{fmt(data[0].date)}</span>
          <span>{fmt(data[Math.floor(n / 2)].date)}</span>
          <span>{fmt(data[n - 1].date)}</span>
        </div>
      )}
    </div>
  );
}

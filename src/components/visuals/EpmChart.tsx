"use client";

import { useState } from "react";

/* Stage 13 report, config fingerprint 552a2214, seeds 0–1. */
const ROWS = [
  { steps: 100, rmse: 2.823, std: 0.329, ci: [2.494, 3.153], ms: 192.101, speed: 1, inside: null as boolean | null },
  { steps: 50, rmse: 2.753, std: 0.397, ci: [2.355, 3.15], ms: 103.349, speed: 1.86, inside: true },
  { steps: 20, rmse: 2.879, std: 0.466, ci: [2.413, 3.344], ms: 44.956, speed: 4.27, inside: true },
  { steps: 10, rmse: 2.998, std: 0.604, ci: [2.394, 3.603], ms: 23.14, speed: 8.3, inside: true },
  { steps: 5, rmse: 5.198, std: 0.204, ci: [4.994, 5.402], ms: 13.817, speed: 13.9, inside: false },
];
const REF = ROWS[0].ci;

const VW = 360;
const VH = 236;
const M = { l: 38, r: 10, t: 16, b: 40 };
const band = (VW - M.l - M.r) / ROWS.length;
const cx = (i: number) => M.l + band * i + band / 2;

function describe(i: number) {
  const r = ROWS[i];
  const where = r.inside === null ? "the 100-step reference" : r.inside ? "inside the 100-step 95% interval" : "outside the 100-step 95% interval";
  return `${r.steps} steps: RMSE ${r.rmse.toFixed(3)} ± ${r.std.toFixed(3)} (95% CI ${r.ci[0].toFixed(2)}–${r.ci[1].toFixed(2)}), ${where}; ${r.ms.toFixed(1)} ms per window${
    r.speed > 1 ? `, ${r.speed}× faster than 100 steps` : ""
  }.`;
}

export function EpmChart({ compact = false }: { compact?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? 3;

  const yR = (v: number) => M.t + (1 - v / 6) * (VH - M.t - M.b);
  const yL = (v: number) => M.t + (1 - v / 200) * (VH - M.t - M.b);
  const base = VH - M.b;

  const columns = (onEnter: (i: number) => void) => (
    <g>
      {ROWS.map((r, i) => (
        <rect
          key={r.steps}
          x={M.l + band * i}
          y={M.t}
          width={band}
          height={VH - M.t - M.b}
          fill={hover === i ? "var(--sunken)" : "transparent"}
          onMouseEnter={() => onEnter(i)}
        />
      ))}
    </g>
  );

  const xAxis = (second: (i: number) => string) => (
    <g>
      <line x1={M.l} x2={VW - M.r} y1={base} y2={base} stroke="var(--rule-strong)" strokeWidth={1} />
      {ROWS.map((r, i) => (
        <g key={r.steps}>
          <text x={cx(i)} y={base + 16} textAnchor="middle" className="dg-text-2" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
            {r.steps}
          </text>
          <text x={cx(i)} y={base + 31} textAnchor="middle" className="dg-text-3" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
            {second(i)}
          </text>
        </g>
      ))}
    </g>
  );

  return (
    <figure className="rounded-md border border-rule bg-surface p-4 sm:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[0.9375rem] font-[600] [font-stretch:108%]">Same weights, fewer DDIM sampling steps</span>
        <span className="meta">Stage 13 study, real runs</span>
      </figcaption>

      <div className={`mt-4 grid grid-cols-1 gap-5 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"}`} onMouseLeave={() => setHover(null)}>
        <div>
          <p className="meta mb-1 text-ink-2">Forecast error, RMSE (lower is better)</p>
          <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full" role="img" aria-label="RMSE by number of sampling steps. 100, 50, 20 and 10 steps all fall inside the 100-step confidence interval; 5 steps rises to 5.2.">
            {[0, 2, 4, 6].map((t) => (
              <g key={t}>
                <line x1={M.l} x2={VW - M.r} y1={yR(t)} y2={yR(t)} stroke="var(--rule)" strokeWidth={1} />
                <text x={M.l - 8} y={yR(t) + 4} textAnchor="end" className="dg-text-3" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
                  {t}
                </text>
              </g>
            ))}
            <rect x={M.l} y={yR(REF[1])} width={VW - M.l - M.r} height={yR(REF[0]) - yR(REF[1])} fill="var(--cobalt)" opacity={0.12} />
            <text x={VW - M.r - 4} y={yR(REF[0]) + 14} textAnchor="end" className="dg-text-3" style={{ fontSize: 10.5, fontFamily: "var(--font-mono)" }}>
              band: 100-step 95% CI
            </text>
            {columns(setHover)}
            {ROWS.map((r, i) => {
              const color = r.inside === false ? "var(--missed)" : "var(--cobalt)";
              return (
                <g key={r.steps} pointerEvents="none">
                  <line x1={cx(i)} x2={cx(i)} y1={yR(r.ci[0])} y2={yR(r.ci[1])} stroke={color} strokeWidth={2} strokeLinecap="round" />
                  <circle cx={cx(i)} cy={yR(r.rmse)} r={i === active ? 6 : 5} fill={color} stroke="var(--surface)" strokeWidth={2} />
                </g>
              );
            })}
            <text x={cx(4) - 10} y={yR(5.198) - 10} textAnchor="end" className="dg-text-2" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
              5.198, outside
            </text>
            {xAxis((i) => (ROWS[i].inside === null ? "ref" : ROWS[i].inside ? "inside" : "outside"))}
          </svg>
        </div>

        <div>
          <p className="meta mb-1 text-ink-2">Latency per forecast window, ms</p>
          <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full" role="img" aria-label="Latency by number of sampling steps: 192 ms at 100 steps, 103 at 50, 45 at 20, 23 at 10 and 14 at 5.">
            {[0, 100, 200].map((t) => (
              <g key={t}>
                <line x1={M.l} x2={VW - M.r} y1={yL(t)} y2={yL(t)} stroke="var(--rule)" strokeWidth={1} />
                <text x={M.l - 8} y={yL(t) + 4} textAnchor="end" className="dg-text-3" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
                  {t}
                </text>
              </g>
            ))}
            {columns(setHover)}
            {ROWS.map((r, i) => {
              const w = 22;
              const x = cx(i) - w / 2;
              const y = yL(r.ms);
              const h = base - y;
              const rr = Math.min(4, h);
              return (
                <g key={r.steps} pointerEvents="none">
                  <path
                    d={`M ${x} ${base} V ${y + rr} Q ${x} ${y} ${x + rr} ${y} H ${x + w - rr} Q ${x + w} ${y} ${x + w} ${y + rr} V ${base} Z`}
                    fill="var(--cobalt)"
                    opacity={i === active ? 1 : 0.78}
                  />
                  <text x={cx(i)} y={y - 6} textAnchor="middle" className="dg-text-2" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
                    {Math.round(r.ms)}
                  </text>
                </g>
              );
            })}
            {xAxis((i) => (ROWS[i].speed === 1 ? "1×" : `${ROWS[i].speed}×`))}
          </svg>
        </div>
      </div>

      <p className="meta mt-3 border-t border-rule pt-3 text-ink-2" aria-live="polite">
        {describe(active)}
      </p>

      <div className="sr-only">
      <table>
        <caption>DDIM steps against forecast RMSE and latency</caption>
        <thead>
          <tr><th>Steps</th><th>RMSE</th><th>95% CI</th><th>Latency (ms)</th><th>Speedup</th></tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.steps}>
              <td>{r.steps}</td><td>{r.rmse}</td><td>{r.ci[0]}–{r.ci[1]}</td><td>{r.ms}</td><td>{r.speed}×</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}

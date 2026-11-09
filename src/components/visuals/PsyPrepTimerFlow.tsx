const ROWS = [
  { from: "Browser", to: "API", msg: "Start attempt", effect: "API writes startedAt and deadline = startedAt + duration to MongoDB.", tone: "neutral" },
  { from: "API", to: "Browser", msg: "Load attempt", effect: "API returns remaining seconds = deadline − server time. The browser only draws the countdown.", tone: "neutral" },
  { from: "Browser", to: "API", msg: "Save answer, before deadline", effect: "Accepted and stored; autosave is debounced in the background.", tone: "ok" },
  { from: "Browser", to: "API", msg: "Save answer, after deadline", effect: "Rejected. The attempt is locked, auto-submitted and graded on the spot.", tone: "stop" },
  { from: "Vercel Cron", to: "API", msg: "finalize-expired + CRON_SECRET", effect: "Sweeps in-progress attempts whose deadline has passed and grades them.", tone: "neutral" },
] as const;

/** Sequence view of who owns time in PsyPrep's server mode. */
export function PsyPrepTimerFlow() {
  return (
    <div className="rounded-md border border-rule bg-surface p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[0.9375rem] font-[600] [font-stretch:108%]">Who owns the clock</p>
        <p className="meta">server mode, enforced in attemptRoutes.js</p>
      </div>
      <ol className="divide-y divide-rule border-y border-rule">
        {ROWS.map((r, i) => (
          <li key={r.msg} className="grid grid-cols-1 gap-2 py-3.5 md:grid-cols-[2.25rem_13rem_1fr] md:gap-4">
            <span className="meta tabular">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex flex-col">
              <span className="font-mono text-[0.8125rem] text-ink-2">
                {r.from} <span aria-label="to">→</span> {r.to}
              </span>
              <span className="text-[0.9375rem] font-[600] text-ink">{r.msg}</span>
            </span>
            <span className="flex items-start gap-2.5 text-[0.9375rem] text-ink-2">
              {r.tone === "stop" ? (
                <span className="mt-0.5 shrink-0 rounded-[3px] border border-missed px-1.5 font-mono text-[0.6875rem] text-missed">blocked</span>
              ) : r.tone === "ok" ? (
                <span className="mt-0.5 shrink-0 rounded-[3px] border border-met px-1.5 font-mono text-[0.6875rem] text-met">accepted</span>
              ) : null}
              <span>{r.effect}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

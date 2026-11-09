import { RotateCcw } from "lucide-react";

const TOOLS_A = ["returns", "allocation"];
const TOOLS_R = ["beta", "HHI", "dividends", "tax", "rebalance"];

function Node({ title, sub, tools, accent }: { title: string; sub: string; tools?: string[]; accent?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1.5 rounded-[5px] px-3 py-3 ${accent ? "border border-ink bg-paper" : "border border-rule-strong bg-paper"}`}>
      <span className="text-[0.9375rem] font-[620] leading-tight [font-stretch:106%]">{title}</span>
      <span className="font-mono text-[0.75rem] leading-snug text-ink-3">{sub}</span>
      {tools ? (
        <span className="mt-1 flex flex-wrap gap-1">
          {tools.map((t) => (
            <span key={t} className="rounded-[3px] bg-sunken px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-2">
              {t}
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}

/** The LangGraph pipeline, with the evaluator's conditional edge drawn as a loop. */
export function PhaFlow() {
  return (
    <div className="drafting-grid rounded-md border border-rule bg-surface p-4 sm:p-5" role="img" aria-label="Analyst agent, then risk agent, then advisor agent, then evaluator agent. If the score is below 70 and fewer than three retries were used, the report goes back to the advisor; otherwise it is shown and the Q&A agent streams follow-up answers.">
      <div aria-hidden className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Node title="Analyst" sub="facts, no advice" tools={TOOLS_A} />
        <Node title="Risk" sub="exposure and tax" tools={TOOLS_R} />
        <div className="relative flex flex-[2] flex-col gap-2 rounded-[6px] border border-dashed border-cobalt p-2 sm:flex-row">
          <Node title="Advisor" sub="plain-English report" accent />
          <Node title="Evaluator" sub="scores 0–100" accent />
          <span className="absolute -top-3 left-3 inline-flex items-center gap-1.5 bg-surface px-1.5 font-mono text-[0.6875rem] text-cobalt">
            <RotateCcw size={11} strokeWidth={2} />
            below 70, up to 3 retries
          </span>
        </div>
      </div>
      <div aria-hidden className="mt-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-rule-strong" />
        <span className="font-mono text-[0.75rem] text-ink-2">score ≥ 70: report, then Q&amp;A streamed over SSE</span>
      </div>
    </div>
  );
}

import type { Step } from "@/data/portfolio";

/**
 * Architecture as an ordered flow down a rail: each stage hands its output to
 * the next. A vertical layout keeps every description readable at any width.
 */
export function FlowDiagram({ steps, label }: { steps: Step[]; label: string }) {
  return (
    <div className="drafting-grid rounded-md border border-rule bg-surface px-4 py-5 sm:px-6 sm:py-6">
      <ol aria-label={label} className="relative">
        {steps.map((s, i) => (
          <li key={s.title} className="relative grid grid-cols-[2.25rem_1fr] gap-x-3 pb-6 last:pb-0 sm:grid-cols-[2.5rem_13rem_1fr] sm:gap-x-5">
            {i < steps.length - 1 ? <span aria-hidden className="absolute bottom-0 left-[1.0625rem] top-9 w-px bg-rule-strong sm:left-[1.1875rem]" /> : null}
            <span className="relative z-[1] grid size-9 place-items-center rounded-full border border-ink bg-paper font-mono text-[0.75rem] tabular sm:size-[2.375rem]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="pt-1.5 text-[1rem] font-[630] leading-snug [font-stretch:106%]">{s.title}</p>
            <p className="col-start-2 mt-1 text-[0.9375rem] leading-relaxed text-ink-2 text-pretty sm:col-start-3 sm:mt-0 sm:pt-1.5">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

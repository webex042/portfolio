"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Search, X } from "lucide-react";
import { BrandIcon } from "./BrandIcon";

export type IndexEntry = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  result: string;
  categories: string[];
  stack: string[];
  status: string;
  ownership: string;
  repo: string;
  live?: string;
};

/** Searchable, filterable list of every project. Each row leads to its case study. */
export function ProjectIndex({ entries, categories }: { entries: IndexEntry[]; categories: string[] }) {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, entries.filter((e) => e.categories.includes(c)).length])), [entries, categories]);

  const shown = entries.filter((e) => {
    if (cat !== "All" && !e.categories.includes(cat)) return false;
    if (!q.trim()) return true;
    const hay = `${e.title} ${e.subtitle} ${e.summary} ${e.stack.join(" ")} ${e.categories.join(" ")}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
  });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by area" className="flex flex-wrap gap-1.5">
          {["All", ...categories].map((c) => {
            const on = cat === c;
            const n = c === "All" ? entries.length : counts[c];
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3.5 text-[0.9375rem] transition-colors ${
                  on ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink-2 hover:border-ink hover:text-ink"
                }`}
              >
                {c}
                <span className={`font-mono text-[0.75rem] tabular ${on ? "text-paper/70" : "text-ink-3"}`}>{n}</span>
              </button>
            );
          })}
        </div>
        <label className="relative flex items-center lg:w-72">
          <span className="sr-only">Search projects</span>
          <Search size={16} className="pointer-events-none absolute left-3 text-ink-3" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or technology"
            className="h-10 w-full rounded-md border border-rule-strong bg-surface pl-9 pr-9 text-[0.9375rem] text-ink placeholder:text-ink-3 focus:border-cobalt focus:outline-none"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} className="absolute right-2 grid size-7 place-items-center rounded text-ink-3 hover:text-ink" aria-label="Clear search">
              <X size={15} aria-hidden />
            </button>
          ) : null}
        </label>
      </div>
      <p className="meta mt-3" aria-live="polite">
        Showing {shown.length} of {entries.length}
      </p>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-rule-strong p-8 text-center">
          <p className="text-ink">No project matches that combination.</p>
          <button type="button" className="link mt-2" onClick={() => { setQ(""); setCat("All"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <ol className="mt-4 border-t border-rule">
          {shown.map((e) => (
            <li key={e.slug} className="group relative grid grid-cols-1 gap-4 border-b border-rule py-7 md:grid-cols-12 md:gap-6">
              <span className="meta tabular md:col-span-1 md:pt-1.5">{e.number}</span>
              <div className="md:col-span-7">
                <p className="meta">{e.categories.join(", ")}</p>
                <h2 className="heading mt-1 text-[clamp(1.5rem,1.25rem+0.9vw,2rem)]">
                  <Link href={`/projects/${e.slug}`} className="after:absolute after:inset-0 group-hover:text-cobalt">
                    {e.title}
                  </Link>
                </h2>
                <p className="mt-1 text-ink-2">{e.subtitle}</p>
                <p className="mt-3 text-[0.96875rem] text-ink text-pretty">{e.summary}</p>
                <p className="mt-3 border-l-2 border-cobalt pl-3 text-[0.9375rem] text-ink-2">{e.result}</p>
              </div>
              <div className="flex flex-col gap-3 md:col-span-4">
                <dl className="grid grid-cols-2 gap-3 text-[0.875rem]">
                  <div>
                    <dt className="meta !text-[0.75rem]">Status</dt>
                    <dd className="text-ink">{e.status}</dd>
                  </div>
                  <div>
                    <dt className="meta !text-[0.75rem]">Ownership</dt>
                    <dd className="text-ink">{e.ownership}</dd>
                  </div>
                </dl>
                <ul className="flex flex-wrap gap-1.5">
                  {e.stack.slice(0, 6).map((s) => (
                    <li key={s} className="tag !text-[0.75rem]">
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="relative z-10 mt-1 flex flex-wrap gap-2">
                  <Link href={`/projects/${e.slug}`} className="btn btn-ink btn-sm">
                    Case study
                  </Link>
                  <a href={e.repo} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm" aria-label={`${e.title} on GitHub`}>
                    <BrandIcon name="github" size={14} />
                    GitHub
                  </a>
                  {e.live ? (
                    <a href={e.live} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm" aria-label={`${e.title} live demo`}>
                      <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
                      Live
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

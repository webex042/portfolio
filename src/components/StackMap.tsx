"use client";

import { useMemo, useState } from "react";
import { projects, stackMap } from "@/data/portfolio";

const SHORT: Record<string, string> = {
  tessera: "Tessera",
  epm: "EPM",
  psyprep: "PsyPrep",
  "deep-forge": "DEEP FORGE",
  "coffee-line": "Coffee Line",
  "portfolio-health-advisor": "Health Advisor",
  "ai-study-lab": "AI Study Lab",
};

/* Technology order chosen so related tools sit together; projects are then
   placed at the barycentre of their tools, which keeps edge crossings low. */
const TECH_ORDER = ["Rust", "TypeScript", "React", "Node.js", "MongoDB", "JavaScript", "Security", "SQLite", "LLMs", "FastAPI", "Python", "PyTorch", "scikit-learn"];

const W = 1200;
const PY = 58;
const TY = 196;
const PAD = 70;

type Focus = { kind: "project"; id: string } | { kind: "tech"; id: string } | null;

export function StackMap({ linkBase }: { linkBase?: string }) {
  const hrefFor = (slug: string) => (linkBase ? `${linkBase}${slug}` : `#project-${slug}`);
  const [focus, setFocus] = useState<Focus>(null);

  const layout = useMemo(() => {
    const tech = TECH_ORDER.filter((t) => stackMap.tech.includes(t));
    const tx = (i: number) => PAD + (i * (W - PAD * 2)) / (tech.length - 1);
    const ordered = [...projects].sort((a, b) => {
      const bc = (slug: string) => {
        const idx = stackMap.uses[slug].map((t) => tech.indexOf(t));
        return idx.reduce((s, v) => s + v, 0) / idx.length;
      };
      return bc(a.slug) - bc(b.slug);
    });
    const px = (i: number) => 110 + (i * (W - 220)) / (ordered.length - 1);
    const pNodes = ordered.map((p, i) => ({ slug: p.slug, name: SHORT[p.slug] ?? p.name, subtitle: p.subtitle, x: px(i) }));
    const tNodes = tech.map((t, i) => ({ id: t, x: tx(i), i }));
    const edges = pNodes.flatMap((p) =>
      stackMap.uses[p.slug].map((t) => {
        const tn = tNodes.find((n) => n.id === t)!;
        return { p: p.slug, t, d: `M ${p.x} ${PY + 6} C ${p.x} ${PY + 80}, ${tn.x} ${TY - 80}, ${tn.x} ${TY - 6}` };
      }),
    );
    return { pNodes, tNodes, edges };
  }, []);

  const lit = (p: string, t: string) =>
    !focus || (focus.kind === "project" && focus.id === p) || (focus.kind === "tech" && focus.id === t);
  const projectLit = (slug: string) =>
    !focus || (focus.kind === "project" ? focus.id === slug : stackMap.uses[slug].includes(focus.id));
  const techLit = (t: string) =>
    !focus || (focus.kind === "tech" ? focus.id === t : stackMap.uses[focus.id].includes(t));

  let caption = "Hover or focus a project to trace its stack; select it to open the case study.";
  if (focus?.kind === "project") {
    const p = layout.pNodes.find((n) => n.slug === focus.id)!;
    caption = `${p.name}: ${p.subtitle}. Built with ${stackMap.uses[p.slug].join(", ")}.`;
  } else if (focus?.kind === "tech") {
    const users = layout.pNodes.filter((n) => stackMap.uses[n.slug].includes(focus.id)).map((n) => n.name);
    caption = `${focus.id} appears in ${users.length} project${users.length === 1 ? "" : "s"}: ${users.join(", ")}.`;
  }

  return (
    <div className="border-t border-rule pt-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <h2 className="heading text-[1.25rem]">Seven projects, and what they&rsquo;re built with</h2>
        <p className="meta hidden md:block">Read from each repository&rsquo;s dependency files</p>
      </div>

      {/* Desktop and tablet: the interactive map. */}
      <div className="mt-6 hidden md:block">
        <svg viewBox={`0 0 ${W} 250`} className="block h-auto w-full" role="group" aria-label="Map linking each project to the technologies it uses" onMouseLeave={() => setFocus(null)}>
          <g fill="none" strokeWidth={1.25}>
            {layout.edges.map((e, i) => (
              <path
                key={`${e.p}-${e.t}`}
                d={e.d}
                pathLength={1}
                className="edge-draw"
                style={{
                  animationDelay: `${380 + i * 16}ms`,
                  stroke: focus && lit(e.p, e.t) ? "var(--cobalt)" : "var(--rule-strong)",
                  strokeWidth: focus && lit(e.p, e.t) ? 1.75 : 1.1,
                  opacity: lit(e.p, e.t) ? 1 : 0.22,
                  transition: "stroke 160ms ease, opacity 160ms ease",
                }}
              />
            ))}
          </g>

          {layout.pNodes.map((p) => (
            <a
              key={p.slug}
              href={hrefFor(p.slug)}
              aria-label={`${p.name}, ${p.subtitle}. Open the case study`}
              onMouseEnter={() => setFocus({ kind: "project", id: p.slug })}
              onFocus={() => setFocus({ kind: "project", id: p.slug })}
              onBlur={() => setFocus(null)}
              className="outline-none [&:focus-visible_rect.hit]:stroke-cobalt"
              style={{ opacity: projectLit(p.slug) ? 1 : 0.3, transition: "opacity 160ms ease" }}
            >
              <rect className="hit" x={p.x - 78} y={6} width={156} height={66} rx={6} fill="transparent" stroke="transparent" strokeWidth={1.5} />
              <text x={p.x} y={36} textAnchor="middle" className="dg-text" style={{ fontSize: 19, fontWeight: 620, fontStretch: "112%" }}>
                {p.name}
              </text>
              <rect x={p.x - 5} y={PY - 5} width={10} height={10} rx={1.5} className={focus?.kind === "project" && focus.id === p.slug ? "dg-fill-cobalt" : "dg-fill-paper"} stroke="var(--ink)" strokeWidth={1.5} />
            </a>
          ))}

          {layout.tNodes.map((t) => (
            <g
              key={t.id}
              onMouseEnter={() => setFocus({ kind: "tech", id: t.id })}
              style={{ opacity: techLit(t.id) ? 1 : 0.3, transition: "opacity 160ms ease", cursor: "default" }}
            >
              <rect x={t.x - 46} y={TY - 14} width={92} height={60} fill="transparent" />
              <circle cx={t.x} cy={TY} r={4.5} className={focus && techLit(t.id) ? "dg-fill-cobalt" : "dg-fill-paper"} stroke="var(--ink)" strokeWidth={1.5} />
              <text x={t.x} y={TY + (t.i % 2 === 0 ? 24 : 42)} textAnchor="middle" className="dg-text-2" style={{ fontSize: 14, fontFamily: "var(--font-mono)" }}>
                {t.id}
              </text>
            </g>
          ))}
        </svg>
        <p className="meta mt-3 min-h-[1.5em] text-ink-2" aria-live="polite">
          {caption}
        </p>
      </div>

      {/* Phones: the same information as a readable list. */}
      <ul className="mt-5 divide-y divide-rule border-y border-rule md:hidden">
        {layout.pNodes.map((p) => (
          <li key={p.slug}>
            <a href={hrefFor(p.slug)} className="flex flex-col gap-2 py-3.5">
              <span className="text-[1.0625rem] font-[600] [font-stretch:110%]">{p.name}</span>
              <span className="flex flex-wrap gap-1.5">
                {stackMap.uses[p.slug].map((t) => (
                  <span key={t} className="tag !py-0 !text-[0.75rem]">
                    {t}
                  </span>
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

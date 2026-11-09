"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { EDGES, GOAL, LANDMARKS, NODES, OPTIMAL, START, greedyBestFirst, heuristic, type Heuristic, type NodeId } from "@/lib/gbfs";

const KINDS: { id: Heuristic; label: string; note: string }[] = [
  { id: "landmark", label: "Landmark guess", note: "max over landmarks A and D of |d(L,t) − d(L,v)|" },
  { id: "straight", label: "Straight line", note: "drawn distance ÷ 40, ignores which roads exist" },
  { id: "zero", label: "No guess", note: "h = 0, ties broken alphabetically" },
];

export function GbfsDemo() {
  const [kind, setKind] = useState<Heuristic>("landmark");
  const run = useMemo(() => greedyBestFirst(kind), [kind]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const last = run.steps.length - 1;
  const step = run.steps[Math.min(i, last)];

  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [kind]);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setI((v) => {
        if (v >= last) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 900);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, last]);

  const frontier = new Set(step.frontier.map((f) => f.id));
  const explored = new Set(step.explored);
  const onPath = new Set(step.done ? run.path : []);
  const pathEdge = (u: NodeId, v: NodeId) => {
    if (!step.done) return false;
    const k = run.path.findIndex((n) => n === u);
    return (k >= 0 && run.path[k + 1] === v) || (run.path.findIndex((n) => n === v) >= 0 && run.path[run.path.indexOf(v) + 1] === u);
  };

  const nodeStyle = (n: NodeId) => {
    if (n === step.current && !step.done) return { fill: "var(--cobalt)", stroke: "var(--cobalt)", dash: undefined, text: "var(--on-cobalt)" };
    if (onPath.has(n)) return { fill: "var(--cobalt-wash)", stroke: "var(--cobalt)", dash: undefined, text: "var(--ink)" };
    if (explored.has(n)) return { fill: "var(--ink-3)", stroke: "var(--ink-3)", dash: undefined, text: "var(--paper)" };
    if (frontier.has(n)) return { fill: "var(--paper)", stroke: "var(--cobalt)", dash: "3 2.5", text: "var(--ink)" };
    return { fill: "var(--paper)", stroke: "var(--rule-strong)", dash: undefined, text: "var(--ink-3)" };
  };

  const statusLine = step.done
    ? `Reached ${GOAL}. Route ${run.path.join(" → ")}, cost ${run.cost}. Dijkstra's optimum is ${OPTIMAL.cost} via ${OPTIMAL.path.join(" → ")}.`
    : `Step ${i + 1}: taking ${step.current} off the frontier (h = ${heuristic(kind, step.current)}), adding its unseen neighbours.`;

  return (
    <div className="rounded-md border border-rule bg-surface">
      <div className="flex flex-col gap-3 border-b border-rule p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-[0.9375rem] font-[600] [font-stretch:108%]">Step through Greedy Best-First Search</p>
          <p className="meta">A small re-implementation running in this page, from {START} to {GOAL}.</p>
        </div>
        <div role="radiogroup" aria-label="Heuristic" className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={kind === k.id}
              onClick={() => setKind(k.id)}
              className={`min-h-9 rounded-md border px-3 text-[0.875rem] ${kind === k.id ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink-2 hover:border-ink"}`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_17rem]">
        <div className="drafting-grid p-2 sm:p-4">
          <svg viewBox="0 -14 620 344" className="block h-auto w-full" role="img" aria-label={statusLine}>
            {EDGES.map(([u, v, w]) => {
              const a = NODES[u], b = NODES[v];
              const hot = pathEdge(u, v);
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
              return (
                <g key={`${u}${v}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot ? "var(--cobalt)" : "var(--rule-strong)"} strokeWidth={hot ? 3.5 : 1.5} strokeLinecap="round" />
                  <rect x={mx - 11} y={my - 9} width={22} height={18} rx={3} fill="var(--surface)" stroke={u === "E" && v === "I" ? "var(--missed)" : "var(--rule)"} />
                  <text x={mx} y={my + 4} textAnchor="middle" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }} fill={u === "E" && v === "I" ? "var(--missed)" : "var(--ink-2)"}>
                    {w}
                  </text>
                </g>
              );
            })}
            {(Object.keys(NODES) as NodeId[]).map((n) => {
              const p = NODES[n];
              const s = nodeStyle(n);
              const isL = LANDMARKS.includes(n);
              return (
                <g key={n}>
                  {isL ? <rect x={p.x - 21} y={p.y - 21} width={42} height={42} transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="var(--ink-3)" strokeDasharray="2 3" /> : null}
                  <circle cx={p.x} cy={p.y} r={16} fill={s.fill} stroke={s.stroke} strokeWidth={2} strokeDasharray={s.dash} />
                  <text x={p.x} y={p.y + 5} textAnchor="middle" style={{ fontSize: 14, fontWeight: 650 }} fill={s.text}>
                    {n}
                  </text>
                  <text x={p.x} y={p.y + (p.y > 200 ? (isL ? 40 : 34) : isL ? -30 : -24)} textAnchor="middle" style={{ fontSize: 10.5, fontFamily: "var(--font-mono)" }} fill="var(--ink-3)">
                    {n === START ? "start" : n === GOAL ? "goal" : `h ${heuristic(kind, n)}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col gap-4 border-t border-rule p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div>
            <p className="meta">Step {Math.min(i, last) + 1} of {last + 1}</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink" aria-live="polite">
              {statusLine}
            </p>
          </div>
          <div>
            <p className="meta">Frontier, lowest h first</p>
            <p className="mt-1 font-mono text-[0.8125rem] text-ink-2">
              {step.frontier.length ? step.frontier.map((f) => `${f.id} ${f.h}`).join(", ") : "empty"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className="btn btn-line btn-sm" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous step">
              <SkipBack size={14} aria-hidden />
            </button>
            <button type="button" className="btn btn-ink btn-sm" onClick={() => (i >= last ? (setI(0), setPlaying(true)) : setPlaying((p) => !p))}>
              {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
              {playing ? "Pause" : i >= last ? "Replay" : "Play"}
            </button>
            <button type="button" className="btn btn-line btn-sm" onClick={() => setI((v) => Math.min(last, v + 1))} disabled={i >= last} aria-label="Next step">
              <SkipForward size={14} aria-hidden />
            </button>
            <button type="button" className="btn btn-line btn-sm" onClick={() => { setPlaying(false); setI(0); }} aria-label="Reset">
              <RotateCcw size={14} aria-hidden />
            </button>
          </div>
          <p className="meta">{KINDS.find((k) => k.id === kind)!.note}</p>
          <ul className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 text-[0.8125rem] text-ink-2">
            <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-cobalt" aria-hidden />checking now</li>
            <li className="flex items-center gap-2"><span className="size-3 rounded-full border-2 border-dashed border-cobalt" aria-hidden />frontier</li>
            <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-ink-3" aria-hidden />explored</li>
            <li className="flex items-center gap-2"><span className="size-3 rounded-full border-2 border-cobalt bg-cobalt-wash" aria-hidden />final route</li>
            <li className="col-span-2 flex items-center gap-2"><span className="h-3 w-5 rounded-[2px] border border-missed" aria-hidden />E–I: short on screen, slow (20) in reality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

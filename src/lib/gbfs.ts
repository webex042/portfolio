/*
 * A small, self-contained re-implementation of Greedy Best-First Search with
 * landmark heuristics, written for this site's DEEP FORGE case study. It
 * mirrors the ideas in the team's repository (Dijkstra preprocessing, a binary
 * min-heap, f(n) = h(n), stop when the goal is taken off the frontier) on a
 * graph small enough to read.
 */

export type NodeId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
export type Heuristic = "zero" | "straight" | "landmark";

export const NODES: Record<NodeId, { x: number; y: number }> = {
  A: { x: 60, y: 160 },
  B: { x: 170, y: 70 },
  C: { x: 170, y: 250 },
  D: { x: 300, y: 40 },
  E: { x: 290, y: 160 },
  F: { x: 300, y: 280 },
  G: { x: 430, y: 90 },
  H: { x: 430, y: 230 },
  I: { x: 560, y: 160 },
};

/* Road lengths are travel costs, deliberately not proportional to drawn
   distance: E–I is a short but jammed bridge. */
export const EDGES: [NodeId, NodeId, number][] = [
  ["A", "B", 4], ["A", "C", 5], ["B", "D", 4], ["B", "E", 3], ["C", "E", 3], ["C", "F", 4],
  ["D", "G", 4], ["E", "G", 7], ["E", "H", 7], ["E", "I", 20], ["F", "H", 4], ["G", "I", 5], ["H", "I", 6],
];

export const START: NodeId = "A";
export const GOAL: NodeId = "I";
export const LANDMARKS: NodeId[] = ["A", "D"];

const ids = Object.keys(NODES) as NodeId[];
const adj = new Map<NodeId, [NodeId, number][]>(ids.map((n) => [n, []]));
for (const [u, v, w] of EDGES) {
  adj.get(u)!.push([v, w]);
  adj.get(v)!.push([u, w]);
}

/** Binary min-heap keyed by (priority, label) for deterministic ties. */
class MinHeap<T extends { p: number; id: string }> {
  private a: T[] = [];
  get size() { return this.a.length; }
  private less(i: number, j: number) {
    const x = this.a[i], y = this.a[j];
    return x.p < y.p || (x.p === y.p && x.id < y.id);
  }
  push(v: T) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.less(i, p)) break;
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
      i = p;
    }
  }
  pop(): T | undefined {
    if (!this.a.length) return undefined;
    const top = this.a[0];
    const last = this.a.pop()!;
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < this.a.length && this.less(l, m)) m = l;
        if (r < this.a.length && this.less(r, m)) m = r;
        if (m === i) break;
        [this.a[i], this.a[m]] = [this.a[m], this.a[i]];
        i = m;
      }
    }
    return top;
  }
  items() { return [...this.a].sort((x, y) => x.p - y.p || (x.id < y.id ? -1 : 1)); }
}

export function dijkstra(src: NodeId) {
  const dist = new Map<NodeId, number>(ids.map((n) => [n, Infinity]));
  const prev = new Map<NodeId, NodeId | null>(ids.map((n) => [n, null]));
  dist.set(src, 0);
  const h = new MinHeap<{ p: number; id: NodeId }>();
  h.push({ p: 0, id: src });
  while (h.size) {
    const { p, id } = h.pop()!;
    if (p > dist.get(id)!) continue;
    for (const [v, w] of adj.get(id)!) {
      const nd = p + w;
      if (nd < dist.get(v)!) {
        dist.set(v, nd);
        prev.set(v, id);
        h.push({ p: nd, id: v });
      }
    }
  }
  return { dist, prev };
}

const landmarkTables = LANDMARKS.map((L) => dijkstra(L).dist);

export function heuristic(kind: Heuristic, v: NodeId, t: NodeId = GOAL): number {
  if (kind === "zero") return 0;
  if (kind === "straight") {
    const a = NODES[v], b = NODES[t];
    return Math.round((Math.hypot(a.x - b.x, a.y - b.y) / 40) * 10) / 10;
  }
  let best = 0;
  for (const d of landmarkTables) {
    const dv = d.get(v)!, dt = d.get(t)!;
    if (!Number.isFinite(dv) || !Number.isFinite(dt)) continue; /* unreachable landmark: no bound */
    best = Math.max(best, Math.abs(dt - dv));
  }
  return best;
}

export type SearchStep = {
  current: NodeId;
  frontier: { id: NodeId; h: number }[];
  explored: NodeId[];
  parents: Partial<Record<NodeId, NodeId>>;
  done: boolean;
};

export function greedyBestFirst(kind: Heuristic) {
  const steps: SearchStep[] = [];
  const parents: Partial<Record<NodeId, NodeId>> = {};
  const explored = new Set<NodeId>();
  const seen = new Set<NodeId>([START]);
  const heap = new MinHeap<{ p: number; id: NodeId }>();
  heap.push({ p: heuristic(kind, START), id: START });

  while (heap.size) {
    const { id } = heap.pop()!;
    explored.add(id);
    if (id === GOAL) {
      steps.push({ current: id, frontier: heap.items().map((x) => ({ id: x.id, h: x.p })), explored: [...explored], parents: { ...parents }, done: true });
      break;
    }
    for (const [v] of adj.get(id)!) {
      if (seen.has(v)) continue;
      seen.add(v);
      parents[v] = id;
      heap.push({ p: heuristic(kind, v), id: v });
    }
    steps.push({ current: id, frontier: heap.items().map((x) => ({ id: x.id, h: x.p })), explored: [...explored], parents: { ...parents }, done: false });
  }

  const path: NodeId[] = [];
  let cur: NodeId | undefined = GOAL;
  while (cur) {
    path.unshift(cur);
    cur = parents[cur];
  }
  const cost = path.slice(1).reduce((s, v, i) => s + EDGES.find(([a, b]) => (a === path[i] && b === v) || (b === path[i] && a === v))![2], 0);
  return { steps, path, cost };
}

export const OPTIMAL = (() => {
  const { dist, prev } = dijkstra(START);
  const path: NodeId[] = [];
  let cur: NodeId | null = GOAL;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }
  return { cost: dist.get(GOAL)!, path };
})();

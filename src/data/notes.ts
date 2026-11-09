/*
 * Engineering log. Each note separates what the repository documents (with a
 * link to the file) from analysis written for this site. No dates are shown
 * because none of these were published before; they're working notes.
 */

export type NoteSection = {
  heading: string;
  kind: "documented" | "analysis";
  body: string[];
  code?: { lang: string; text: string; caption: string };
};

export type EngineeringNote = {
  slug: string;
  title: string;
  summary: string;
  project: string;
  topics: string[];
  sources: { label: string; href: string }[];
  sections: NoteSection[];
};

const gh = (repo: string, path: string) => `https://github.com/webex042/${repo}/blob/main/${path}`;

export const notes: EngineeringNote[] = [
  {
    slug: "server-authoritative-exam-timers",
    title: "Why the exam clock lives on the server",
    summary: "How PsyPrep enforces a deadline the browser can't move, and why it takes two layers.",
    project: "psyprep",
    topics: ["Full stack", "Security"],
    sources: [
      { label: "server/src/routes/attemptRoutes.js", href: gh("PsyPrep", "server/src/routes/attemptRoutes.js") },
      { label: "vercel.json", href: gh("PsyPrep", "vercel.json") },
      { label: "README", href: gh("PsyPrep", "README.md") },
    ],
    sections: [
      {
        heading: "What the code does",
        kind: "documented",
        body: [
          "When an attempt starts, the API stores startedAt and a deadline equal to startedAt plus the quiz duration. When the client loads an attempt it receives the remaining seconds, computed on the server from that deadline, and uses them only to draw a countdown.",
          "Every read and every answer write compares the current server time with the stored deadline. If the deadline has passed, the attempt is finalised as auto-submitted and graded, and a late answer is rejected. Separately, vercel.json registers a cron job that calls /api/attempts/finalize-expired, guarded by a shared CRON_SECRET, to sweep attempts nobody came back to. A second concurrent attempt returns 409 Conflict.",
        ],
        code: {
          lang: "js",
          caption: "Finalise-on-access in the attempt read route",
          text: "if (attempt.status === 'in-progress' && now > attempt.deadline) {\n  await finalizeAttempt(attempt, 'auto-submitted');\n}",
        },
      },
      {
        heading: "Why a client timer can't be the authority",
        kind: "analysis",
        body: [
          "Everything in the browser belongs to the person sitting the test: the JavaScript, the system clock, the network timing. A countdown that decides when the test ends can be paused in dev tools, wound back by changing the clock, or ignored by sending a request directly. So the only thing the client contributes is a display. The decision is made where the student can't reach it, against a timestamp written once at start.",
          "The display can drift by a second or two and it doesn't matter, because it isn't enforcing anything.",
        ],
      },
      {
        heading: "Why two layers",
        kind: "analysis",
        body: [
          "Finalise-on-access is the real enforcement: any attempt that is touched after its deadline is closed at that moment. But an attempt that is abandoned is never touched, so it would sit 'in progress' forever and skew analytics. The cron sweep exists for those. On the Vercel plan the cron runs once a day, which is acceptable precisely because it isn't the layer that stops late answers.",
          "The trade-off is in the open-access practice mode on the live site: there, attempts and deadlines are stored in the browser so anyone can practise without an account. That's fine for practice, and it's the reason the authenticated server mode exists for anything that counts.",
        ],
      },
    ],
  },
  {
    slug: "ten-diffusion-steps-instead-of-a-hundred",
    title: "Ten diffusion steps instead of a hundred",
    summary: "Reading EPM's reduced-step DDIM result, including the part where it breaks.",
    project: "epm",
    topics: ["Machine learning", "Evaluation"],
    sources: [
      { label: "docs/stage13_research_report.md", href: gh("effective-prediction-model", "docs/stage13_research_report.md") },
      { label: "README", href: gh("effective-prediction-model", "README.md") },
    ],
    sections: [
      {
        heading: "The experiment as documented",
        kind: "documented",
        body: [
          "Dataset: synthetic industrial telemetry, 1,600 steps at 10-minute intervals. Windows of 24 steps forecast 12 ahead, split chronologically into 1,095 training, 235 validation and 235 test windows, with the standardiser fitted on training windows only. The diffusion model uses a cosine schedule with T = 100, 16 Monte Carlo samples and η = 0.3; seeds 0 and 1; config fingerprint 552a2214.",
          "The same trained weights were sampled at 100, 50, 20, 10 and 5 DDIM steps. RMSE: 2.823, 2.753, 2.879, 2.998 and 5.198. Latency per window: 192.1, 103.3, 45.0, 23.1 and 13.8 ms. Everything down to 10 steps falls inside the 100-step 95% confidence interval [2.494, 3.153]; 5 steps does not. The best deterministic baseline, linear AR, scored 4.531.",
        ],
      },
      {
        heading: "Why 8.3× and not 10×",
        kind: "analysis",
        body: [
          "Cutting from 100 to 10 steps is a 10× reduction in network evaluations, but latency fell 8.3×. Each step costs roughly 1.9 ms at 100 steps and 2.3 ms at 10, which points to a fixed per-window overhead (data preparation and the Monte Carlo aggregation) that doesn't shrink with the step count. The faster the sampler gets, the more that overhead dominates; it's also why 5 steps is only 13.9× faster rather than 20×.",
        ],
      },
      {
        heading: "What changes besides RMSE",
        kind: "analysis",
        body: [
          "The report's uncertainty columns tell a second story. Coverage of the 90% prediction interval rises from 0.807 at 100 steps to 0.932 at 10, while the mean interval width grows from 9.96 to 16.5. Fewer steps make the forecaster less sharp but better calibrated on this data: its intervals are wider and contain the truth more often. Whether that's a win depends on whether the application prefers tight intervals or reliable ones.",
          "The limitation is stated in the report and worth repeating: two seeds, CPU timing, one synthetic dataset and one architecture family. The claim is that H1 holds down to about 10 steps here, not in general.",
        ],
      },
    ],
  },
  {
    slug: "landmark-heuristics-and-greedy-search",
    title: "An admissible guess that greedy search still misuses",
    summary: "Why DEEP FORGE's landmark bound is always a lower bound, and why that isn't enough.",
    project: "deep-forge",
    topics: ["Algorithms"],
    sources: [
      { label: "src/lib/heuristics.ts", href: gh("landmark-route-visualizer", "src/lib/heuristics.ts") },
      { label: "src/lib/searchEngine.ts", href: gh("landmark-route-visualizer", "src/lib/searchEngine.ts") },
      { label: "README", href: gh("landmark-route-visualizer", "README.md") },
    ],
    sections: [
      {
        heading: "What the team implemented",
        kind: "documented",
        body: [
          "Distances d(L, ·) from each landmark are precomputed exactly with Dijkstra. For a node v and target t, one landmark gives h_L(v,t) = |d(L,t) − d(L,v)|, and several landmarks are combined by taking the maximum. A landmark that can't reach v or t is skipped. The search ranks its frontier by f(n) = h(n) on a binary min-heap, tracking g(n) without using it.",
          "On the built-in City Roads map the landmark guess finds the optimal cost-90 route while straight-line distance takes a cost-136 detour. On the Greedy Trap map the heuristic is exact and the search still returns a route costing 11 when one costing 3 exists.",
        ],
      },
      {
        heading: "Why the bound holds",
        kind: "analysis",
        body: [
          "On an undirected graph with non-negative weights, shortest-path distance obeys the triangle inequality. Going from L to t can't be longer than going from L to v and then on to t, so d(L,t) − d(L,v) ≤ d(v,t). Swapping roles gives d(L,v) − d(L,t) ≤ d(v,t). Together, |d(L,t) − d(L,v)| ≤ d(v,t): never an overestimate. The maximum of several lower bounds is still a lower bound, and the tightest one available.",
          "Landmarks on the edge of the map tend to help most, because for nodes lying roughly between the landmark and the target the bound becomes nearly exact.",
        ],
      },
      {
        heading: "Why admissible isn't optimal here",
        kind: "analysis",
        body: [
          "Admissibility guarantees optimal routes for A*, which ranks by g(n) + h(n). Greedy Best-First ranks by h(n) alone, so it commits to whatever looks closest to the goal and never weighs what it already paid to get there. The Greedy Trap shows the extreme case: even a perfect h doesn't save it.",
          "The case study for DEEP FORGE on this site includes a small re-implementation you can step through, where the landmark guess avoids a jammed bridge that straight-line distance falls into, and still misses the optimum by two.",
        ],
      },
    ],
  },
  {
    slug: "measuring-a-prompt-injection-guard",
    title: "Tuned half, held-out half: measuring a prompt-injection guard",
    summary: "What Tessera's 152-case injection corpus says, and what 140 of 152 does and doesn't mean.",
    project: "tessera",
    topics: ["AI security", "Evaluation"],
    sources: [
      { label: "docs/stage7/verification.md", href: gh("Tessera", "docs/stage7/verification.md") },
      { label: "SECURITY.md", href: gh("Tessera", "SECURITY.md") },
      { label: "Thesis, chapter 6", href: gh("Tessera", "thesis/src/06_results.md") },
    ],
    sections: [
      {
        heading: "The corpus and the runs",
        kind: "documented",
        body: [
          "152 cases across 38 categories: hidden text, fake system prompts, schema-override attempts, store poisoning, delayed triggers, multilingual and transliterated attacks, attacks in recognised text and window titles, and five genuine controls that must not be blocked. Seventy-eight were written before the defence was ever run against them, and the corpus was split into two halves.",
          "Against a simulated compromised model, one that obeys every injection, the guard stopped 126 of 152 before the Stage 7 fixes. The fixes were tuned on the odd half only. Afterwards: 140 of 152 overall, 39 of 39 on the tuned half, 27 of 39 on the held-out half. With the real 4B model, about 62% of held-out attacks were stopped. The held-out failures were deliberately left unfixed.",
        ],
      },
      {
        heading: "Why simulate a compromised model",
        kind: "analysis",
        body: [
          "A real model resists some injections on its own, which makes a guard look better than it is. A model that always complies is the worst case: every pass is the guard's doing. That makes 140 of 152 a statement about the deterministic code, not about the model's manners.",
        ],
      },
      {
        heading: "Reading the headline number",
        kind: "analysis",
        body: [
          "140 of 152 includes the half the rules were tuned on, where a perfect score is expected and proves little. The held-out 27 of 39, about 69%, is the honest estimate of how the guard generalises to attack styles it hasn't seen. Leaving those failures unfixed keeps it honest; fixing them would turn the held-out half into a second tuned half.",
          "The stronger result is the one that doesn't depend on the guard at all. In every one of the 152 cases no injected instruction caused an action, no secret appeared in clear text, no unexpected table was written, and the delimited data block couldn't be closed from inside, because the model has no tools and its output is schema-constrained. The guard reduces misleading entries; the architecture bounds the damage.",
        ],
      },
    ],
  },
  {
    slug: "json-schema-key-order",
    title: "Key order in a JSON schema changed what the model wrote",
    summary: "A serialisation default in Tessera that silently hurt a grammar-constrained model.",
    project: "tessera",
    topics: ["LLM engineering"],
    sources: [
      { label: "ADR-0010", href: gh("Tessera", "docs/adr/0010-schema-key-order.md") },
      { label: "Thesis, chapter 6", href: gh("Tessera", "thesis/src/06_results.md") },
    ],
    sections: [
      {
        heading: "What happened",
        kind: "documented",
        body: [
          "llama-server turns the response schema into a grammar that makes the model write keys in the order it receives them. The workspace built serde_json without preserve_order, so every schema was parsed into a sorted map and sent alphabetically. In Ask, the model was forced to write \"insufficient\" before any sentences, wrote false, and then produced an empty list: 48 of 60 questions in one full run.",
          "The fix enabled serde_json's preserve_order for the whole workspace, with a unit test that fails if a schema is reordered. Held-out extraction re-ran in about 50 minutes instead of nearly six hours; F1 rose from 0.507 to 0.533 as all 15 invalid-JSON failures disappeared, while precision fell because the model now produced more low-value notes.",
        ],
        code: {
          lang: "toml",
          caption: "Cargo.toml, workspace dependencies",
          text: 'serde_json = { version = "1.0.154", features = ["preserve_order"] }',
        },
      },
      {
        heading: "The general lesson",
        kind: "analysis",
        body: [
          "Under a grammar, key order is generation order. Putting a verdict field before the evidence asks the model to decide before it has written its reasoning, and a summary or confidence field placed first gets filled with a guess. The schema files were correct all along; the bytes sent to the model weren't. Testing the serialised schema, not just the source file, is what caught it.",
        ],
      },
    ],
  },
];

export const getNote = (slug: string) => notes.find((n) => n.slug === slug);

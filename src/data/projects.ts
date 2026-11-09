/*
 * Project case studies. Every claim here was checked against the repository
 * (README, docs, source, tests) or the live deployment on 9 Nov 2026. Where a
 * README and a later machine-generated report disagree, the report wins and
 * the difference is stated in the case study.
 */

export const categories = ["AI & ML", "AI Security", "LLM Engineering", "Full Stack", "Systems", "Algorithms"] as const;
export type Category = (typeof categories)[number];

export type Fact = { value: string; label: string };
export type Step = { title: string; text: string };
export type Feature = { title: string; what: string; how: string; why: string };
export type Note = { title: string; text: string };
export type Challenge = { challenge: string; solution: string };
export type StackRow = { layer: string; tech: string; purpose: string };
export type Figure = { src: string; width: number; height: number; alt: string; caption: string; real: "screenshot" | "figure" };
export type ResultRow = { label: string; value: string; target?: string; outcome: "met" | "missed" | "info" };
export type SourceLink = { label: string; href: string };

export type Project = {
  slug: string;
  number: string;
  name: string;
  title: string;
  subtitle: string;
  categories: Category[];
  kind: string;
  status: string;
  ownership: { type: "Individual" | "Lead" | "Team" | "Hackathon"; label: string; note: string };
  summary: string;
  result: string;
  highlights: string[];
  stack: string[];
  repo: string;
  live?: { href: string; label: string; verified: string };
  visual: "tessera" | "epm" | "psyprep" | "deepforge" | "coffee" | "pha" | "studylab";
  featured: boolean;
  facts: Fact[];
  disclaimer?: string;
  overview: { what: string; whoBenefits: string; whyBuilt: string };
  problem: string[];
  architecture: { intro: string; steps: Step[]; note?: string };
  stackTable: StackRow[];
  features: Feature[];
  decisions: Note[];
  security: Note[];
  testing: string[];
  challenges: Challenge[];
  results: { intro: string; rows: ResultRow[]; caveats: string[] };
  learnings: string[];
  improvements: string[];
  myRole: string;
  gallery: Figure[];
  sources: SourceLink[];
};

const gh = (repo: string, path = "") => `https://github.com/webex042/${repo}${path ? `/blob/main/${path}` : ""}`;

export const projects: Project[] = [
  /* ── 01 Tessera ──────────────────────────────────────────────────── */
  {
    slug: "tessera",
    number: "01",
    name: "Tessera",
    title: "Tessera",
    subtitle: "Local-first AI memory and secure inference for Windows",
    categories: ["AI Security", "LLM Engineering", "Systems"],
    kind: "Windows desktop research prototype in Rust",
    status: "Active research, MVP stages 0–7 in progress",
    ownership: { type: "Lead", label: "Primary maintainer", note: "I'm the primary maintainer of the repository, which documents the design, implementation and evaluation in full." },
    summary:
      "A local-first AI memory system that turns on-screen context into encrypted, searchable memory, with isolated on-device inference and deterministic prompt-injection defences.",
    result: "355/355 seeded secrets redacted at 0.41% false positives; output guard stopped 140 of 152 injection cases against a simulated compromised model.",
    highlights: [
      "Inference runs in an isolated llama.cpp worker inside a Windows Job Object, reached only over PID-authenticated loopback.",
      "Secrets are scrubbed by checksum-validated detectors before anything is stored, embedded or shown to the model.",
      "The model has no tools; its output is grammar-constrained JSON checked by deterministic Rust code.",
    ],
    stack: ["Rust", "Tauri 2", "React", "TypeScript", "SQLCipher", "llama.cpp", "ONNX Runtime"],
    repo: gh("Tessera"),
    visual: "tessera",
    featured: true,
    facts: [
      { value: "10", label: "Rust crates in one Cargo workspace" },
      { value: "6", label: "trust boundaries, each with its own control" },
      { value: "355/355", label: "seeded secrets redacted" },
      { value: "140/152", label: "injection cases stopped (simulated model)" },
    ],
    overview: {
      what: "Tessera reads the text visible across applications on a Windows PC, removes passwords, identity numbers and keys, stores what remains in an encrypted database on the machine, and answers questions with a 4B vision-language model running on the PC's own GPU. Every answer cites the captured text it came from.",
      whoBenefits: "Anyone who wants a searchable memory of their work without sending their screen to a server, and engineers who need a pattern for running local models safely on heterogeneous hardware.",
      whyBuilt: "The repository frames it as a research question: can local inference be made portable across GPU vendors, and can a screen-reading assistant be built so its privacy and safety guarantees hold even when the model misbehaves?",
    },
    problem: [
      "GPU vendors ship incompatible runtimes (CUDA, ROCm, SYCL, Vulkan, Metal). Apps either bundle one and break elsewhere, or ship multi-gigabyte bundles that fail on a minor driver mismatch.",
      "A model running inside the app takes the whole interface down when the driver resets or VRAM runs out, and can corrupt the database mid-write.",
      "Screen text is hostile input. It contains card numbers and passwords, and any web page can carry instructions written for the model: indirect prompt injection.",
    ],
    architecture: {
      intro: "Text moves through seven stages. Nothing downstream of redaction ever sees a raw secret, and the model lives in its own process.",
      steps: [
        { title: "Screen context", text: "WinEvent hooks notice focus and title changes. A gatekeeper pauses capture on lock, fullscreen, battery or a manual pause." },
        { title: "Capture ladder", text: "UI Automation first, under a 285 ms deadline; Windows Graphics Capture with WinRT OCR next; a VLM crop last. No screenshot is written to disk." },
        { title: "PII redaction", text: "Blocklists plus checksum-validated detectors (Luhn for cards, Verhoeff for Aadhaar) swap secrets for typed placeholders such as [CARD] and [API_KEY]." },
        { title: "Encrypted storage", text: "SQLCipher (AES-256) with a DPAPI-wrapped key, an FTS5 index, and an encrypted vector store built only from masked text." },
        { title: "Local retrieval", text: "multilingual-e5-small embeddings on a pinned ONNX Runtime; BM25 and vector results fused with reciprocal rank fusion." },
        { title: "Isolated LLM", text: "llama-server runs Qwen3-VL-4B (Q4_K_M) inside a Job Object, fed by a priority scheduler so questions preempt background work." },
        { title: "Validated answer", text: "Grammar-constrained JSON, evidence spans matched against the source, and citations verified before anything is shown." },
      ],
      note: "Six trust boundaries, each with a control: UI to Rust host (typed, content-free IPC); host to inference worker (loopback with a PID ownership check); application to storage (SQLCipher, DPAPI key); application to network (one approved crate); screen text to prompt (escaped data blocks); text to embeddings (mandatory PII masking).",
    },
    stackTable: [
      { layer: "Core runtime", tech: "Rust 2024, Cargo workspace (10 crates)", purpose: "Capture, guardrails, storage, scheduling and inference orchestration" },
      { layer: "Desktop shell", tech: "Tauri 2", purpose: "Native window, tray, hotkeys and a typed IPC bridge" },
      { layer: "Interface", tech: "React 19, TypeScript, Vite, Tailwind CSS", purpose: "The floating notch UI: Today, Open Loops, Search, Timeline, Ask, Diagnostics" },
      { layer: "Inference", tech: "llama.cpp (llama-server b11900), Qwen3-VL-4B Q4_K_M", purpose: "Out-of-process vision-language model on the local GPU or CPU" },
      { layer: "Embeddings", tech: "ONNX Runtime 1.31, fastembed, multilingual-e5-small", purpose: "Local vectors for semantic search, no network" },
      { layer: "Storage", tech: "SQLCipher 4 (AES-256), SQLite FTS5, Windows DPAPI", purpose: "Encrypted facts and full-text index with an OS-protected key" },
      { layer: "OS integration", tech: "UI Automation, Windows Graphics Capture, WinRT OCR, Job Objects", purpose: "Text acquisition and process containment" },
      { layer: "Supply chain", tech: "cargo-deny, check_network_deps.py", purpose: "Licence, ban and advisory checks; proof that only tsr-net can reach the network" },
      { layer: "Evaluation", tech: "Python 3.11, GitHub Actions", purpose: "Eval harnesses, corpora and nightly evaluation runs" },
    ],
    features: [
      {
        title: "Hardware-aware backend selection",
        what: "Picks the best working GPU backend on whatever machine it runs on.",
        how: "Enumerates adapters through DXGI (Windows) or sysfs (Linux), probes each pinned llama.cpp build with --list-devices in a clean environment, ranks candidates by vendor and falls back to the CPU last.",
        why: "No vendor library is compiled into the app, so one binary works across NVIDIA, AMD and Intel. Verified on real AMD Radeon graphics over Vulkan and on the CPU path; other vendors are covered by a simulated probe matrix.",
      },
      {
        title: "Crash-contained inference worker",
        what: "Keeps a model crash from taking the app or the database with it.",
        how: "The worker starts suspended inside a Job Object set to kill on close. A supervisor moves it through Stopped, Starting, Ready, Backoff and Failed with restart budgets, and re-queues in-flight jobs.",
        why: "Driver resets and out-of-memory errors are routine on consumer GPUs; the interface stays up and reports a degraded state instead.",
      },
      {
        title: "Preemptive, power-aware scheduler",
        what: "Answers questions immediately even while background extraction is running.",
        how: "Three priorities (P0 interactive, P1 extraction, P2 summaries). A running background job is preempted by dropping its HTTP stream and re-queued in place; preemption is bounded, starved jobs get promoted, and job keys are idempotent.",
        why: "One model instance serves everything. Written as a pure state machine that takes time as an argument, the same code runs in a discrete-event simulation for reproducible testing.",
      },
      {
        title: "Ask with sources",
        what: "Answers questions about what you saw, with citations.",
        how: "Hybrid BM25 and vector retrieval over masked text feeds the model; every claim must map to a stored evidence span and capture time.",
        why: "An unverifiable answer from a 4B model isn't useful. In the evaluation, 100% of citations verified and none were fabricated.",
      },
      {
        title: "Floating notch interface",
        what: "A small panel pinned to the top of the screen that never steals focus.",
        how: "A fixed transparent window that changes its region instead of resizing, with display affinity set so it is excluded from screen capture, and read back to confirm.",
        why: "Measured at 60 fps and 64 ms p95 input-to-visual latency, and absent from both screen-capture paths, so it never leaks into a screen share.",
      },
    ],
    decisions: [
      { title: "Out-of-process inference over an embedded runtime", text: "Running llama-server as a sidecar costs a loopback hop but buys crash isolation, vendor independence and a hard kill switch through the Job Object." },
      { title: "Data is not authority", text: "Screen text is escaped into delimited blocks and the model has no tools. A successful injection can influence what text is proposed and nothing else; a code guard then tries to stop even that." },
      { title: "No HTTP crates on the hot path", text: "The loopback client is a minimal HTTP/1.1 implementation over std::net, and GetExtendedTcpTable confirms the PID that owns the port, so another process can't impersonate the worker." },
      { title: "Network access lives in one crate", text: "Only tsr-net can open outbound connections, and only with a user approval token for a model download. CI walks cargo metadata to prove no other crate links a network-capable dependency." },
      { title: "Content-free logging", text: "The logger admits allowlisted fields and drops any value that isn't numeric, boolean or a short identifier, so a careless log line produces nothing instead of a leak." },
    ],
    security: [
      { title: "Threat model", text: "Six trust boundaries with a named control at each, documented in SECURITY.md and the thesis." },
      { title: "Encryption at rest", text: "SQLCipher with AES-256 and a DPAPI-wrapped key; a disk canary scan found no recoverable plaintext." },
      { title: "Prompt-injection defence", text: "Delimited data blocks, a zero-tool model contract, strict schemas, and a guard that holds facts that look injected, quoted or ungrounded." },
      { title: "Supply chain", text: "Exact pins for crypto, network and runtime-loading crates; cargo-deny for licences, bans and advisories; the auto-updater compiled out because a transitive compression library has unpatched advisories." },
      { title: "Disclosed open issue", text: "The Microsoft WebView2 runtime makes one outbound HTTPS request per run that the app can't suppress, so 'nothing leaves your PC' is not claimed for the interface process (ADR-0002)." },
    ],
    testing: [
      "380+ Rust test functions across the crates, run in CI with cargo test, cargo-deny and the network-dependency checker; a separate nightly workflow runs evaluations.",
      "A 355-case secrets corpus (cards, Aadhaar and VIDs, PAN, passports, voter IDs, bank details, UPI, OTPs, JWTs, private keys) plus a clean control corpus for false positives.",
      "A 152-case injection corpus across 38 categories, split in half: one half tuned the guard, the other was never looked at during tuning.",
      "End-to-end evaluations against the real 4B model on an AMD integrated GPU, with release criteria fixed before implementation began.",
    ],
    challenges: [
      { challenge: "The redaction corpus was extended from 290 to 355 cases, and on first run 48 of the 65 new cases leaked because no detector existed for those formats.", solution: "Detectors were added for Aadhaar virtual IDs, passports and voter IDs and the redaction version was bumped. The lesson recorded: a redaction engine is only as good as the corpus it's tested against." },
      { challenge: "Extraction lost 15 of 58 items to invalid JSON and a full evaluation took 5 h 48 min.", solution: "The schema was being serialised with alphabetically sorted keys, forcing the grammar-constrained model to commit to fields before their content. Restoring declared order removed every invalid-JSON failure and cut the run to about 50 minutes." },
      { challenge: "A guard tested only on the attacks it was built from always looks perfect.", solution: "The injection corpus was split, and the held-out failures were deliberately left unfixed so the held-out score keeps meaning something." },
    ],
    results: {
      intro: "Every criterion enforced by deterministic code was met. The criteria that depend on a 4B model running on integrated graphics were not, and the repository says so.",
      rows: [
        { label: "Seeded secrets redacted", value: "355 / 355", target: "100%", outcome: "met" },
        { label: "Redaction false positives", value: "0.41%", target: "≤ 2%", outcome: "met" },
        { label: "Stored facts with evidence missing from source", value: "0%", target: "≤ 3%", outcome: "met" },
        { label: "Citations verified in Ask", value: "100%", target: "≥ 90%", outcome: "met" },
        { label: "Output guard vs simulated compromised model", value: "140 / 152", outcome: "info" },
        { label: "Held-out injection cases blocked, real model", value: "≈ 62%", outcome: "info" },
        { label: "Extraction F1, real model", value: "0.533", target: "≥ 0.70", outcome: "missed" },
        { label: "Answer correctness, real model", value: "66.7%", target: "≥ 80%", outcome: "missed" },
      ],
      caveats: [
        "In all 152 injection cases no injected instruction caused an action or revealed a secret; the failures are misleading entries in the task list, bounded by the architecture.",
        "Interactive latency on integrated graphics is roughly ten times the target; a dedicated GPU is needed for interactive speeds.",
        "The resume and README quote 0.43% false positives (1 of 235 clean documents) from an earlier run; the later Stage 7 report gives 0.41% (1 of 242), shown here.",
      ],
    },
    learnings: [
      "Guarantees should come from architecture, not from the model: the zero-tool contract bounded every injection failure.",
      "Evaluation splits matter as much as the defence. The tuned half scored near-perfect; the held-out half was the real measurement.",
      "Serialisation defaults can silently change model behaviour under grammar constraints.",
    ],
    improvements: [
      "Resolve or isolate the WebView2 outbound connection, possibly with a native interface for the always-on panel.",
      "Raise extraction F1 past the 0.70 gate, starting with low-value 'note' facts that drag precision down.",
      "Validate CUDA, ROCm, SYCL and Metal paths on real hardware rather than the simulated matrix.",
    ],
    myRole: "Primary maintainer: the architecture, the Rust crates, the guardrails, the evaluation harnesses and the documentation in the repository.",
    gallery: [
      { src: "/images/projects/tessera-architecture.webp", width: 2000, height: 908, alt: "Process diagram: the WebView2 interface process, the host process with gatekeeper, capture, guard, store, pipeline, draft, retrieval, infer and net crates, and a separate llama-server worker process connected over 127.0.0.1 to CUDA, Vulkan, SYCL, Metal and CPU backends", caption: "Process architecture, figure 4.1 of the Tessera thesis.", real: "figure" },
      { src: "/images/projects/tessera-extraction.webp", width: 1600, height: 800, alt: "Bar chart of extraction precision, recall and F1 by fact kind against a 0.70 F1 gate: actions near 0.68, decisions 0.40, events 0.65, notes 0.26, questions 0.50", caption: "Extraction quality by fact kind on the real model; only task extraction approaches the 0.70 gate.", real: "figure" },
    ],
    sources: [
      { label: "README", href: gh("Tessera", "README.md") },
      { label: "SECURITY.md", href: gh("Tessera", "SECURITY.md") },
      { label: "Stage 7 verification", href: gh("Tessera", "docs/stage7/verification.md") },
      { label: "Thesis (PDF)", href: gh("Tessera", "thesis/Tessera_Thesis.pdf") },
    ],
  },

  /* ── 02 EPM ──────────────────────────────────────────────────────── */
  {
    slug: "epm",
    number: "02",
    name: "EPM",
    title: "EPM",
    subtitle: "Efficient Predictive Multimodal Generative Model",
    categories: ["AI & ML"],
    kind: "ML research codebase in Python and PyTorch",
    status: "Stages 0–13 complete",
    ownership: { type: "Individual", label: "Individual project", note: "A research and learning codebase I built stage by stage." },
    summary:
      "A staged ML research codebase, from scratch implementations to diffusion and flow matching, that tests whether a generative forecaster can stay accurate with a tenth of the sampling steps.",
    result: "10-step DDIM stayed inside the 100-step RMSE confidence interval while running 8.3× faster.",
    highlights: [
      "14 stages, each implemented from scratch, tested and benchmarked before the next one starts.",
      "Same trained diffusion weights sampled at 100 down to 5 DDIM steps, so only inference cost changes.",
      "A leakage-free benchmark runner over 44 algorithms and a 20-dataset registry.",
    ],
    stack: ["Python", "PyTorch", "NumPy", "scikit-learn", "XGBoost", "pandas", "pytest"],
    repo: gh("effective-prediction-model"),
    visual: "epm",
    featured: true,
    facts: [
      { value: "14", label: "stages, maths to research experiment" },
      { value: "44", label: "benchmarkable algorithms" },
      { value: "20", label: "datasets with source and licence" },
      { value: "500+", label: "tests, CI on three Python versions" },
    ],
    overview: {
      what: "EPM is a progression: mathematics, classical ML, neural networks by hand, NLP, time series, multimodal fusion, generative models, diffusion, flow matching, efficiency and compression. Stage 13 turns those pieces into one controlled, reproducible study.",
      whoBenefits: "Anyone weighing generative forecasters for real-time prediction, and learners who want every algorithm implemented, tested and compared on equal terms.",
      whyBuilt: "To answer one question with my own implementations rather than quoted results: can predictive performance be kept while cutting inference time, memory and computational complexity?",
    },
    problem: [
      "Diffusion models produce forecasts with honest uncertainty, but each forecast costs many network evaluations. If accuracy collapses as soon as sampling steps are cut, they are too slow to use for prediction.",
      "Comparisons are easy to rig by accident: shuffled splits leak the future, scalers fitted on all data leak test statistics, and 'baselines' are sometimes just ground truth plus noise.",
    ],
    architecture: {
      intro: "The codebase is a sequence: each stage was implemented, tested, benchmarked and documented before the next began, and Stage 13 reuses them all.",
      steps: [
        { title: "Foundations, stages 0–3", text: "Reproducible config and seeding, linear algebra and optimisation, classical ML from scratch, forward and backward propagation by hand." },
        { title: "Sequences and modalities, 4–6", text: "Tokenisation, embeddings and attention; LSTM, GRU and Transformer forecasters; sensor and text fusion." },
        { title: "Generative models, 7–10", text: "Autoencoders, VAEs, GAN concepts, DDPM and DDIM, diffusion for trajectories, and flow matching." },
        { title: "Efficiency, 11–12", text: "Efficient attention with complexity analysis; distillation, quantisation and pruning." },
        { title: "Research, 13", text: "The H1 study: one trained diffusion model sampled at NFE 100, 50, 20, 10 and 5 against trained baselines." },
        { title: "Registry and report", text: "Every run written to an experiment registry under a config fingerprint; the Markdown report is generated from it." },
      ],
    },
    stackTable: [
      { layer: "Modelling", tech: "PyTorch, NumPy", purpose: "Neural networks, diffusion and flow-matching models, scratch implementations" },
      { layer: "Classical ML", tech: "scikit-learn, XGBoost", purpose: "Baselines and benchmarkable algorithms" },
      { layer: "Data", tech: "pandas, dataset registry", purpose: "20 datasets from scikit-learn, UCI, OpenML, Numenta NAB and synthetic generators" },
      { layer: "Experiments", tech: "Experiment registry, config fingerprints", purpose: "Reproducible runs and generated reports" },
      { layer: "Interfaces", tech: "Static web dashboard, Python serverless API, EPM Chat", purpose: "Run and inspect experiments without writing code" },
      { layer: "Quality", tech: "pytest, GitHub Actions, black, isort", purpose: "500+ tests on Python 3.10–3.12; formatting checks" },
    ],
    features: [
      {
        title: "Fair benchmark runner",
        what: "Compares models on equal terms.",
        how: "One split and seed for every model, CV or rolling-origin validation, latency and size metrics, task-specific scores and a Pareto summary.",
        why: "A model only looks better than another when the comparison is actually fair.",
      },
      {
        title: "Dataset registry",
        what: "20 datasets, each with its source and licence documented.",
        how: "Imputers, scalers and encoders are fitted on training rows only; time series split chronologically; a verify command downloads and schema-checks every entry.",
        why: "Leakage-free preprocessing is built in rather than remembered.",
      },
      {
        title: "EPM Chat",
        what: "Run experiments by describing them in plain English.",
        how: "An intent parser and state machine map 'forecast air quality 12 steps ahead with lstm' to a task, dataset and algorithms and run the same benchmark pipeline. No LLM, no network.",
        why: "The results are measured, not generated, and the tool works offline.",
      },
      {
        title: "Embeddable prediction service",
        what: "Serves saved models to a web page.",
        how: "A separate service validates inputs, returns probabilities or intervals with an explanation, and can be embedded only on allowlisted origins.",
        why: "Predictions can be shared without exposing the training environment.",
      },
    ],
    decisions: [
      { title: "Only one variable changes in H1", text: "The same trained weights are sampled at decreasing DDIM step counts, so any change in accuracy is caused by sampling, not by a different model." },
      { title: "Real baselines", text: "Linear AR, LSTM and Transformer are genuinely trained on the same windows; none is ground truth plus noise." },
      { title: "Intervals, not single runs", text: "Two seeds with 95% bootstrap confidence intervals, so 'within the interval' is a defined test rather than a judgement." },
      { title: "Generated reports", text: "A config fingerprint (552a2214 for the reported run) pins dataset, splits, seeds and sampler settings, and the report is produced from the registry." },
    ],
    security: [
      { title: "Bounded prediction service", text: "Only registered models run, inputs are validated before inference, and embedding is limited to allowlisted origins." },
      { title: "Deployment headers", text: "X-Content-Type-Options, X-Frame-Options and X-XSS-Protection set on every route in vercel.json." },
      { title: "Reproducibility as reliability", text: "Fingerprinted configs and registry records mean any reported number can be re-run." },
    ],
    testing: [
      "500+ tests (502 per the README), run in GitHub Actions on Python 3.10, 3.11 and 3.12.",
      "21 unit tests for the Stage 13 research pipeline and 95 for the chatbot's intents, state machine and guardrails.",
      "Results reported as mean ± standard deviation with 95% bootstrap intervals.",
    ],
    challenges: [
      { challenge: "Deciding what 'competitive accuracy' means before seeing the numbers.", solution: "Defined it as falling inside the full-step 95% confidence interval, so the 5-step failure shows up as a clear 'no'." },
      { challenge: "Time-series evaluation leaks the future easily.", solution: "Chronological split (train 1,095, validation 235, test 235 windows) with the standardiser fitted on training windows only." },
    ],
    results: {
      intro: "Synthetic industrial telemetry, 24-step window, 12-step horizon, chronological split, seeds 0–1, CPU timing. RMSE in physical units; lower is better.",
      rows: [
        { label: "DDIM 100 steps (reference)", value: "RMSE 2.823, 192 ms", outcome: "info" },
        { label: "DDIM 50 steps", value: "RMSE 2.753, 1.86× faster", target: "within CI", outcome: "met" },
        { label: "DDIM 20 steps", value: "RMSE 2.879, 4.27× faster", target: "within CI", outcome: "met" },
        { label: "DDIM 10 steps", value: "RMSE 2.998, 8.3× faster", target: "within CI", outcome: "met" },
        { label: "DDIM 5 steps", value: "RMSE 5.198, 13.9× faster", target: "within CI", outcome: "missed" },
        { label: "Best deterministic baseline (linear AR)", value: "RMSE 4.531", outcome: "info" },
      ],
      caveats: [
        "H1 holds down to about 10 steps on this dataset and breaks at 5, where RMSE rises 84%.",
        "The data is synthetic telemetry, timing is CPU-only, and only two seeds and one architecture family were tested.",
        "The resume and README round the 10-step speedup to 8.4×; the generated Stage 13 report gives 8.3× (192.1 ms against 23.1 ms), shown here.",
      ],
    },
    learnings: [
      "Reduced-step sampling has a cliff, not a slope: accuracy held to 10 steps and collapsed at 5.",
      "Building each algorithm first made the final comparison trustworthy, because every component was already tested on its own.",
    ],
    improvements: [
      "Repeat H1 on a real sensor archive and on GPU timing.",
      "Add more seeds and a second architecture family to tighten the intervals.",
    ],
    myRole: "Built the whole codebase: every stage, the benchmark runner, the registry, the chat interface and the tests.",
    gallery: [
      { src: "/images/projects/epm-nfe-sweep.webp", width: 1785, height: 660, alt: "Two charts: forecast RMSE against DDIM sampling steps, flat from 100 to 10 steps then rising sharply at 5; and inference latency rising linearly from about 14 ms at 5 steps to 192 ms at 100", caption: "RMSE and latency against sampling steps, generated by the Stage 13 experiment.", real: "figure" },
      { src: "/images/projects/epm-pareto.webp", width: 1105, height: 735, alt: "Scatter plot of forecast accuracy against latency for each model and step count, showing the accuracy–latency Pareto front", caption: "Accuracy–latency Pareto view from the same run.", real: "figure" },
    ],
    sources: [
      { label: "README", href: gh("effective-prediction-model", "README.md") },
      { label: "Stage 13 research report", href: gh("effective-prediction-model", "docs/stage13_research_report.md") },
      { label: "Datasets and benchmarking", href: gh("effective-prediction-model", "docs/15_datasets_and_benchmarking.md") },
    ],
  },

  /* ── 03 PsyPrep ──────────────────────────────────────────────────── */
  {
    slug: "psyprep",
    number: "03",
    name: "PsyPrep",
    title: "PsyPrep",
    subtitle: "Online mock test and examination platform",
    categories: ["Full Stack"],
    kind: "Full-stack web app on the MERN stack",
    status: "Live",
    ownership: { type: "Individual", label: "Individual project", note: "Built end to end by me." },
    summary:
      "A MERN computer-based testing platform with a server-authoritative exam timer, JWT access and refresh tokens, a five-state CBT palette, autosave and analytics.",
    result: "Live with 50 mock sets drawn from a 140-question bank; deadlines enforced on the server at every read and write.",
    highlights: [
      "The deadline lives in MongoDB; any read or write after it finalises and grades the attempt.",
      "JWT access tokens with rotating httpOnly refresh cookies, bcrypt hashing, zod validation and helmet headers.",
      "Student and teacher roles, with item analysis for teachers.",
    ],
    stack: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Recharts"],
    repo: gh("PsyPrep"),
    live: { href: "https://psyprep-rust.vercel.app/", label: "Live demo", verified: "Checked 9 Nov 2026: loads, starts a test and runs the palette." },
    visual: "psyprep",
    featured: true,
    facts: [
      { value: "140", label: "curated questions across 13 topics" },
      { value: "50", label: "mock sets of 50 questions, 60 minutes" },
      { value: "5", label: "palette states, as on a real CBT" },
      { value: "2", label: "layers that enforce the deadline" },
    ],
    overview: {
      what: "PsyPrep is a mock examination platform set up for the NPTEL Psychology of Learning course. Students sit timed tests in an interface modelled on real computer-based exams; teachers manage questions and see where a class loses marks.",
      whoBenefits: "Students preparing for a CBT-format exam who need the real interface and an exact clock, and teachers who want item-level feedback.",
      whyBuilt: "Online tests have one rule that's easy to break, the time limit, and I wanted a platform where it can't be broken from the browser.",
    },
    problem: [
      "If the countdown lives in the browser, a student can pause the script, change the system clock or keep a tab open and answer after time is up.",
      "A page reload or dropped connection mid-exam must not lose answers or reset the clock.",
      "Correct answers must never be inspectable in network responses before submission.",
    ],
    architecture: {
      intro: "One repository deploys as a React SPA and a serverless Express API on the same Vercel origin.",
      steps: [
        { title: "React client", text: "Vite, Tailwind CSS and Recharts: the exam runner, palette, review screens and dashboards." },
        { title: "Express API", text: "Mounted as a single Vercel function, with routes for auth, quizzes, attempts, questions and analytics." },
        { title: "Validation and auth", text: "zod schemas on request bodies; access tokens as bearer headers and refresh tokens in httpOnly cookies." },
        { title: "MongoDB", text: "Users, quizzes, questions and attempts, with startedAt and the deadline stored on the attempt." },
        { title: "Scheduled sweep", text: "A Vercel Cron call to /api/attempts/finalize-expired auto-submits abandoned attempts." },
      ],
      note: "The public deployment runs the open-access mode so anyone can practise without an account: there, the attempt and its deadline are kept in the browser, which is why a refresh resumes with the right time left. The authenticated, server-timed engine is in server/ and api/.",
    },
    stackTable: [
      { layer: "Frontend", tech: "React, React Router, Vite", purpose: "Exam runner, palette, dashboards" },
      { layer: "Styling and charts", tech: "Tailwind CSS, Recharts", purpose: "CBT design system; trend, mastery and distribution charts" },
      { layer: "Backend", tech: "Node.js, Express.js", purpose: "REST API, served as one Vercel serverless function" },
      { layer: "Database", tech: "MongoDB with Mongoose", purpose: "Users, quizzes, questions, attempts and deadlines" },
      { layer: "Auth", tech: "jsonwebtoken, bcryptjs, cookie-parser", purpose: "Access and refresh tokens, password hashing" },
      { layer: "Hardening", tech: "zod, helmet", purpose: "Request validation and security headers" },
      { layer: "Testing", tech: "Vitest, Supertest, mongodb-memory-server, Testing Library", purpose: "API integration and component tests" },
      { layer: "Deployment", tech: "Vercel functions and cron", purpose: "Hosting and the expired-attempt sweep" },
    ],
    features: [
      {
        title: "Server-authoritative timer",
        what: "The exam ends when the server says it ends.",
        how: "Starting an attempt stores startedAt and deadline = startedAt + duration. The client receives the remaining seconds and only counts down for display. Any GET or answer PATCH after the deadline locks and grades the attempt.",
        why: "Changing the laptop clock changes the number on screen, not the deadline in the database.",
      },
      {
        title: "CBT question palette",
        what: "Navigation that matches the real exam.",
        how: "Five states: answered, marked for review, answered and marked, visited, not visited; any question is one click away.",
        why: "Practising in the real interface removes surprises on exam day.",
      },
      {
        title: "Autosave and resume",
        what: "No answer is lost to a reload.",
        how: "Debounced background PATCH requests save answers and review flags; reopening the attempt rehydrates them with the remaining time.",
        why: "Network drops and accidental refreshes are normal on student devices.",
      },
      {
        title: "Results and analytics",
        what: "Instant grading and feedback.",
        how: "Server-side scoring with no negative marking, question-by-question review, best versus latest attempt, improvement trend and topic mastery charts.",
        why: "Retakes are only useful if students can see what changed.",
      },
      {
        title: "Teacher dashboard",
        what: "Item analysis and question management.",
        how: "Score histograms, most-missed questions, single-question authoring and bulk JSON or CSV import.",
        why: "Most-missed questions point straight at teaching gaps.",
      },
    ],
    decisions: [
      { title: "Two layers for the deadline", text: "Finalise-on-access catches every attempt that is touched after time is up; the cron sweep catches the ones nobody comes back to. On Vercel's plan the cron runs daily, which is fine because the first layer is the real enforcement." },
      { title: "One active attempt", text: "Opening a second concurrent attempt returns 409 Conflict, so two tabs can't be used to split time." },
      { title: "Answers withheld until submission", text: "Pre-submission responses omit the correct option and rationale; they're only included once the attempt is finalised." },
      { title: "Short-lived access, rotating refresh", text: "Access tokens last 15 minutes by default; refresh tokens last 7 days in httpOnly, secure, SameSite cookies, and each refresh issues a new pair." },
    ],
    security: [
      { title: "Authentication", text: "bcrypt password hashing; JWT access and refresh tokens; refresh cookie never readable from JavaScript." },
      { title: "Authorisation", text: "Protected routes check the user's role, so teacher analytics and question management are teacher-only." },
      { title: "Input validation", text: "zod validation middleware rejects malformed request bodies before they reach handlers." },
      { title: "Exam integrity", text: "Server-held deadlines, finalise-on-access, one active attempt and answers withheld until submission." },
      { title: "Cron endpoint", text: "The sweep endpoint requires a shared CRON_SECRET." },
    ],
    testing: [
      "Backend integration tests with Vitest, Supertest and an in-memory MongoDB covering auth, the quiz lifecycle, the test engine and the serverless auto-submit.",
      "Frontend tests with Vitest and Testing Library for the palette, modal and mock-test service.",
      "A production bundle build as part of the check; the live site was exercised end to end for this portfolio.",
    ],
    challenges: [
      { challenge: "Untrusted browser clocks.", solution: "Store the deadline server-side and compare on every read and write, rather than trusting a client timer." },
      { challenge: "Abandoned attempts that are never reopened.", solution: "A secret-protected cron endpoint sweeps expired in-progress attempts and grades them." },
      { challenge: "Letting anyone practise without accounts.", solution: "An open-access mode stores attempts in the browser with the same deadline semantics, while the authenticated server engine stays available." },
    ],
    results: {
      intro: "What the deployed platform offers today.",
      rows: [
        { label: "Question bank", value: "140 MCQs", outcome: "info" },
        { label: "Mock sets", value: "50 × 50 questions, 60 min", outcome: "info" },
        { label: "Full mock", value: "140 questions, 180 min", outcome: "info" },
        { label: "Live deployment", value: "Working", outcome: "met" },
      ],
      caveats: ["The repository README still mentions 130 questions; the question bank and the live site contain 140."],
    },
    learnings: [
      "A timer is a display; the authority is a timestamp the client can't edit.",
      "Serverless constraints (cron frequency) shape design: the enforcement has to work without background jobs.",
    ],
    improvements: [
      "Use express-rate-limit, already a dependency, on the auth routes.",
      "Keep the access token in memory rather than localStorage to reduce XSS exposure.",
    ],
    myRole: "Designed and built the client, API, data model, tests and deployment.",
    gallery: [
      { src: "/images/projects/psyprep-exam.webp", width: 1800, height: 1125, alt: "PsyPrep exam screen: question 13 of 50 with four options and option D selected, a 59:53 countdown, and a navigation palette showing answered, marked and visited questions", caption: "The exam runner mid-test. Captured from a local build of the repository.", real: "screenshot" },
      { src: "/images/projects/psyprep-dashboard.webp", width: 1800, height: 1125, alt: "PsyPrep dashboard listing 50 mock test sets, the full 140-question mock and the question bank", caption: "The mock test dashboard.", real: "screenshot" },
    ],
    sources: [
      { label: "README", href: gh("PsyPrep", "README.md") },
      { label: "Attempt routes", href: gh("PsyPrep", "server/src/routes/attemptRoutes.js") },
      { label: "Token utilities", href: gh("PsyPrep", "server/src/utils/token.js") },
    ],
  },

  /* ── 04 DEEP FORGE ───────────────────────────────────────────────── */
  {
    slug: "deep-forge",
    number: "04",
    name: "DEEP FORGE",
    title: "DEEP FORGE Navigation Lab",
    subtitle: "Best-First Search route finding with landmark heuristic visualisation",
    categories: ["Algorithms"],
    kind: "Interactive web app in React and TypeScript",
    status: "Live",
    ownership: { type: "Team", label: "Team project, 4 members", note: "Built by Team DEEP FORGE at BIT Mesra: Prince Kumar (lead), Shubham Kumar, Mohit Raj and me. The work described here is the team's." },
    summary:
      "An interactive informed-search lab: Greedy Best-First Search over weighted graphs with Dijkstra-precomputed landmark bounds, step-by-step state snapshots and an optimal-path reference.",
    result: "On the City Roads map the landmark guess finds the optimal cost-90 route where straight-line distance takes a cost-136 detour.",
    highlights: [
      "Landmark heuristic h_L(v,t) = |d(L,t) − d(L,v)|, combined as the maximum over valid landmarks.",
      "The algorithm core has no React or DOM: it returns a full trace and the interface moves a cursor through it.",
      "Shows that greedy search isn't optimal: on the Greedy Trap map it returns cost 11 when 3 exists.",
    ],
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS", "Zustand", "Recharts"],
    repo: gh("landmark-route-visualizer"),
    live: { href: "https://landmark-route-visualizer.vercel.app/", label: "Explore the visualiser", verified: "Checked 9 Nov 2026: loads and runs searches." },
    visual: "deepforge",
    featured: true,
    facts: [
      { value: "f = h", label: "evaluation function; g(n) is tracked, never used to choose" },
      { value: "3", label: "built-in maps plus a random generator" },
      { value: "2", label: "algorithms: Breadth-First and Greedy Best-First" },
      { value: "4", label: "team members" },
    ],
    overview: {
      what: "Navigation Lab lets you pick a start and destination on a weighted road network and watch the search step by step: frontier, visited set, every heuristic estimate, and a plain-language sentence for each move. Every number on screen is computed from the graph currently displayed.",
      whoBenefits: "Students learning informed search, and anyone who wants to see why a heuristic helps and when it misleads.",
      whyBuilt: "Informed search is usually taught with a formula and a static diagram, so students learn that a heuristic 'guides' search without seeing what that means. The team built it for the AI course at BIT Mesra.",
    },
    problem: [
      "Students rarely see where heuristic values come from, or why a perfect-looking estimate can still lead greedy search to a poor route.",
      "Animations that pretend to compute make step-back impossible to trust; the tool needed real algorithm state at every step.",
    ],
    architecture: {
      intro: "The algorithm core is independent of rendering: it takes a graph and returns a trace.",
      steps: [
        { title: "Graph model", text: "Immutable weighted undirected graph with validation for duplicate edges, self-loops and isolated nodes." },
        { title: "Landmark preprocessing", text: "Dijkstra from each landmark produces an exact distance table d(L, ·)." },
        { title: "Heuristics", text: "Zero, Euclidean (straight-line distance over a cost scale) and landmark, each with its derivation shown." },
        { title: "Search engine", text: "Greedy Best-First on a binary min-heap with deterministic tie-breaking, plus Breadth-First Search for comparison." },
        { title: "Trace and replay", text: "A full snapshot per step; the UI plays, pauses and steps through it. Dijkstra's optimal route is computed separately, for comparison only." },
      ],
    },
    stackTable: [
      { layer: "Algorithm core", tech: "TypeScript (graph, priorityQueue, dijkstra, heuristics, searchEngine)", purpose: "Pure functions with no DOM, returning complete traces" },
      { layer: "Interface", tech: "React 19, Framer Motion", purpose: "Canvas, inspector, step controls and sections" },
      { layer: "State", tech: "Zustand", purpose: "Application state for maps, settings and playback" },
      { layer: "Charts and styling", tech: "Recharts, Tailwind CSS", purpose: "Comparison analytics and layout" },
      { layer: "Build", tech: "Vite, vite-plugin-singlefile, oxlint", purpose: "Production build and a single offline HTML file" },
    ],
    features: [
      {
        title: "Step-by-step search",
        what: "Watch the algorithm make each decision.",
        how: "Distinct states for start, destination, checking now, waiting, already checked and final route, with play, pause, next and previous.",
        why: "Previous Step restores a real snapshot, so what you see is the algorithm's actual state.",
      },
      {
        title: "Landmark lab",
        what: "See where every estimate comes from.",
        how: "Shows |d(L,t) − d(L,v)| for each landmark and why the maximum is taken; a landmark that can't reach v or t is skipped.",
        why: "An unreachable landmark would otherwise contribute an infinite or misleading bound.",
      },
      {
        title: "Heuristic comparison",
        what: "Run the same map with different guesses.",
        how: "No guess, straight-line distance and landmarks, compared on explored nodes, route cost and Dijkstra's optimum.",
        why: "The difference between heuristics is the lesson.",
      },
      {
        title: "Editable maps",
        what: "Build your own test cases.",
        how: "Add places and roads, change lengths, generate random connected graphs (from a spanning tree, so a route always exists) and export results as CSV or JSON.",
        why: "Students can construct the case that breaks greedy search themselves.",
      },
    ],
    decisions: [
      { title: "Greedy Best-First, not A*", text: "The frontier is ranked by f(n) = h(n). g(n) is tracked and reported so you can read a route's real cost, but it never influences the choice. A* uses f(n) = g(n) + h(n), which is what would restore optimality." },
      { title: "Why the landmark bound holds", text: "By the triangle inequality, |d(L,t) − d(L,v)| never exceeds d(v,t) on an undirected graph with non-negative weights, so each landmark is a lower bound and their maximum still is." },
      { title: "Deterministic ties", text: "The min-heap breaks ties by node label, so the same graph always produces the same trace." },
      { title: "Offline single file", text: "A second Vite config inlines all JavaScript, CSS and fonts into one HTML file that makes no network requests, for presentation machines." },
    ],
    security: [
      { title: "No network at run time", text: "The single-file build makes no requests at all." },
      { title: "Defensive graph handling", text: "Unreachable destinations report failure, and malformed graphs are rejected or handled explicitly." },
    ],
    testing: [
      "Returned routes are contiguous and start and end at the chosen nodes.",
      "Route cost never falls below Dijkstra's optimum, and landmark estimates are valid lower bounds at every node.",
      "Duplicate edges, self-loops, isolated nodes and empty landmark sets are handled; traces are deterministic.",
      "Layouts checked at 320, 390, 880 and 1440 px with no horizontal overflow.",
    ],
    challenges: [
      { challenge: "Showing that an admissible heuristic doesn't make greedy search optimal.", solution: "The Greedy Trap map: an exact heuristic, and greedy search still returns cost 11 against an optimal 3." },
      { challenge: "Trustworthy step-back.", solution: "Record a full state snapshot per step instead of reversing an animation." },
    ],
    results: {
      intro: "Measured by the app on its own built-in maps.",
      rows: [
        { label: "City Roads, landmark heuristic", value: "cost 90 (optimal)", outcome: "info" },
        { label: "City Roads, straight-line heuristic", value: "cost 136", outcome: "info" },
        { label: "Greedy Trap, exact heuristic", value: "cost 11 vs optimal 3", outcome: "info" },
      ],
      caveats: ["The campus map uses sample coordinates, not a surveyed layout."],
    },
    learnings: [
      "Separating the algorithm from rendering made every displayed number checkable.",
      "Teaching a limitation directly (the Greedy Trap) is clearer than hiding it.",
    ],
    improvements: ["Add A* to the comparison so f = g + h can be seen restoring optimality on the same maps."],
    myRole: "One of four team members. Individual contributions aren't broken down in the repository, so this case study describes the team's work.",
    gallery: [
      { src: "/images/projects/deepforge-visualizer.webp", width: 1800, height: 669, alt: "Navigation Lab visualiser after a Greedy Best-First run from Central to Terminal: the final route highlighted in green across Oldtown, Ridge, Orchard and Airport, with to-go and so-far estimates beside each node", caption: "A completed Greedy Best-First run with the landmark guess: route length 90, equal to the shortest possible. Captured from a local build.", real: "screenshot" },
      { src: "/images/projects/deepforge-landmarks.webp", width: 1800, height: 1125, alt: "The landmark section of Navigation Lab explaining how landmark distance estimates are derived", caption: "The landmark section.", real: "screenshot" },
      { src: "/images/projects/deepforge-home.webp", width: 1800, height: 1125, alt: "Navigation Lab home page with the headline 'Find the route. One ring at a time.'", caption: "The home page.", real: "screenshot" },
    ],
    sources: [
      { label: "README", href: gh("landmark-route-visualizer", "README.md") },
      { label: "Search engine", href: gh("landmark-route-visualizer", "src/lib/searchEngine.ts") },
      { label: "Heuristics", href: gh("landmark-route-visualizer", "src/lib/heuristics.ts") },
    ],
  },

  /* ── 05 Coffee Line ──────────────────────────────────────────────── */
  {
    slug: "coffee-line",
    number: "05",
    name: "Coffee Line",
    title: "Coffee Line",
    subtitle: "ML predictive maintenance on a simulated production line",
    categories: ["AI & ML"],
    kind: "End-to-end ML system in Python",
    status: "Live predictor",
    ownership: { type: "Individual", label: "Individual project", note: "Built end to end by me." },
    summary:
      "An end-to-end predictive-maintenance pipeline that forecasts 24-hour failure risk for 13 simulated machines with purged time-aware evaluation, calibrated probabilities, SHAP explanations and loss-based repair ranking.",
    result: "The live serverless predictor returns calibrated failure probability, a 0–100 health score and a recommendation.",
    highlights: [
      "Purged chronological split with a 24-hour gap, plus a shuffled-label leakage proof on every training run.",
      "Best of logistic regression, random forest and XGBoost by validation PR-AUC, then isotonic calibration and an F2 threshold.",
      "Priority = P(failure) × units per hour × downtime hours.",
    ],
    stack: ["Python", "pandas", "scikit-learn", "XGBoost", "SHAP", "Streamlit", "Plotly"],
    repo: gh("coffee-predictive-maintenance"),
    live: { href: "https://coffee-predictive-maintenance.vercel.app/", label: "Try the predictor", verified: "Checked 9 Nov 2026: the form and /api/predict return predictions." },
    visual: "coffee",
    featured: true,
    disclaimer: "Simulated environment: the machines, sensors and failures come from the project's own simulator. It is not connected to real factory equipment.",
    facts: [
      { value: "13", label: "machines across 6 types" },
      { value: "6 mo", label: "of hourly simulated sensor history" },
      { value: "24 h", label: "prediction horizon" },
      { value: "23", label: "past-only engineered features" },
    ],
    overview: {
      what: "Coffee Line simulates a coffee production line, engineers leak-free features, trains and calibrates a failure model, scores machines with health scores and recommendations, and serves it through a Streamlit control room and a web predictor.",
      whoBenefits: "Maintenance planners deciding which machine to fix first, and ML engineers looking for an honest evaluation template for rare-event prediction.",
      whyBuilt: "To build an ML system the way it would be used: evaluated on the future, calibrated, explained, and turned into a decision rather than a score.",
    },
    problem: [
      "Failures are rare, so accuracy is meaningless and a missed failure costs far more than a false alarm.",
      "A 24-hour label window leaks across neighbouring rows, so a random split scores unrealistically well.",
      "The machine most likely to fail isn't always the one whose failure costs the most output.",
    ],
    architecture: {
      intro: "A straight pipeline. Each module hands a tidy artefact to the next, so the dashboard can never score a machine differently from how the model was trained.",
      steps: [
        { title: "Sensor data", text: "Physics-flavoured simulation of temperature, vibration, pressure, rpm and motor current for 13 machines, with wear and repair cycles." },
        { title: "Feature engineering", text: "Rates of change, rolling statistics, deviation z-scores and interactions from the past only." },
        { title: "Model training", text: "Three candidates on a purged time-ordered split; the winner by validation PR-AUC." },
        { title: "Calibration", text: "Isotonic calibration on a held-out slice; an F2-optimal alert threshold." },
        { title: "Risk prediction", text: "Any dataset scored through the same feature code and saved bundle." },
        { title: "SHAP explanation", text: "TreeExplainer shows which sensors pushed each prediction." },
        { title: "Maintenance priority", text: "Machines ranked by expected units lost." },
      ],
    },
    stackTable: [
      { layer: "Simulation and features", tech: "NumPy, pandas", purpose: "Synthetic sensor history and causal features" },
      { layer: "Modelling", tech: "scikit-learn (LogisticRegression, RandomForest, CalibratedClassifierCV), XGBoost", purpose: "Candidate models, calibration, metrics" },
      { layer: "Explainability", tech: "SHAP", purpose: "Per-prediction feature contributions" },
      { layer: "Dashboard", tech: "Streamlit, Plotly", purpose: "Line overview, machine detail, priority queue" },
      { layer: "Web predictor", tech: "Static HTML/JS with Chart.js, Vercel Python function", purpose: "Single-machine predictions over /api/predict" },
      { layer: "Persistence and tests", tech: "joblib, pytest", purpose: "Model bundle; causality and leakage tests" },
    ],
    features: [
      {
        title: "Control-room dashboard",
        what: "One screen for the whole line.",
        how: "Machines drawn stage by stage and coloured by health band, a per-machine view with SHAP and a recommendation, and a priority queue.",
        why: "Operators need 'fix this first', not a probability table.",
      },
      {
        title: "Replay clock",
        what: "Rewind to any hour of the simulation.",
        how: "A slider over the history; the model and scored data are cached so moving it never re-runs the model.",
        why: "Lets you watch a machine drift into failure and see when the alert would have fired.",
      },
      {
        title: "Transparent health score",
        what: "A 0–100 score independent of the ML model.",
        how: "Penalties for sensor deviation and overdue maintenance, no ML.",
        why: "A second, explainable signal that doesn't depend on trusting the model.",
      },
      {
        title: "Web predictor",
        what: "Score one machine from a form.",
        how: "Readings posted to a Python serverless function, which reuses the saved model bundle and config.",
        why: "The model is usable without installing the training stack.",
      },
    ],
    decisions: [
      { title: "Purged chronological split", text: "The first 70% of hours train and the rest test, with a 24-hour gap removed at the boundary so no test label overlaps a training row." },
      { title: "PR-AUC to choose, F2 to threshold", text: "PR-AUC is meaningful for rare positives; F-beta with β = 2 favours recall because a missed failure is the expensive mistake." },
      { title: "Calibrated probabilities", text: "Isotonic calibration (cv='prefit') so a predicted 0.8 really means roughly 80%, which the expected-loss ranking depends on." },
      { title: "Lean deployment", text: "The serverless function needs only numpy, scipy, scikit-learn and joblib; training and dashboard dependencies stay out of the deploy." },
    ],
    security: [
      { title: "Input validation", text: "The predictor rejects incomplete readings with a 400 error that names the missing field." },
      { title: "No secrets required", text: "The deployment needs no credentials, which .env.example documents." },
      { title: "Reproducibility", text: "Pinned versions and a fixed seed rebuild the dataset and model identically." },
    ],
    testing: [
      "Unit tests prove features are causal: the label never leaks into the feature set and a z-score is zero at baseline.",
      "Leakage proofs run inside the training script: a shuffled-label run must collapse to baseline, and the random-versus-time split gap is reported.",
      "The live predictor was exercised for this portfolio and returned a valid prediction.",
    ],
    challenges: [
      { challenge: "Label leakage across the 24-hour window.", solution: "A purge gap at the train/test boundary and past-only features, both tested." },
      { challenge: "Making probabilities comparable across machines.", solution: "Calibrate the winning model before multiplying by production impact." },
    ],
    results: {
      intro: "Recall, precision and PR-AUC are stored in the trained bundle and shown in the dashboard; the live predictor was checked end to end.",
      rows: [
        { label: "Live /api/predict", value: "Returns probability, health score and advice", outcome: "met" },
        { label: "Alert threshold on the live model", value: "0.136", outcome: "info" },
      ],
      caveats: ["All data is simulated; results describe the modelling approach, not a real plant."],
    },
    learnings: [
      "The evaluation design (split, metric, threshold) decides whether a model is useful more than the model choice does.",
      "Turning a probability into a ranked decision needs calibrated numbers.",
    ],
    improvements: ["Validate on a public real-world maintenance dataset.", "Publish the stored evaluation metrics in the README alongside the method."],
    myRole: "Built the simulator, pipeline, model training, dashboard, web predictor and tests.",
    gallery: [
      { src: "/images/projects/coffee-trajectory.webp", width: 990, height: 550, alt: "Line chart of average sensor deviation in the 100 hours before failure: vibration and temperature climb from about 1 sigma to over 3, pressure rises more slowly, with the final 24 hours shaded as the label window", caption: "Average sensor trajectory into failure across all simulated failures, with the 24-hour label window shaded.", real: "figure" },
    ],
    sources: [
      { label: "README", href: gh("coffee-predictive-maintenance", "README.md") },
      { label: "Training script", href: gh("coffee-predictive-maintenance", "src/train_model.py") },
      { label: "Priority logic", href: gh("coffee-predictive-maintenance", "src/priority.py") },
    ],
  },

  /* ── 06 Portfolio Health Advisor ─────────────────────────────────── */
  {
    slug: "portfolio-health-advisor",
    number: "06",
    name: "Portfolio Health Advisor",
    title: "Portfolio Health Advisor",
    subtitle: "Multi-agent AI financial analysis",
    categories: ["LLM Engineering", "Full Stack"],
    kind: "Multi-agent web app, FastAPI and React",
    status: "Live",
    ownership: { type: "Hackathon", label: "Hackathon project", note: "Built for the ACM Student Chapter Agentic AI Hackathon." },
    summary:
      "A LangGraph multi-agent pipeline where deterministic Python tools compute portfolio metrics, LLM agents interpret them, and an evaluator agent scores and loops the advice before Q&A streams over SSE.",
    result: "Advice scoring below 70 is sent back to the advisor, up to three retries, before it reaches the user.",
    highlights: [
      "Every number comes from seven deterministic tools; the LLM interprets results, it doesn't calculate them.",
      "An evaluator scores consistency, groundedness and actionability from 0 to 100 and can route back.",
      "Follow-up answers stream token by token over Server-Sent Events.",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "Groq", "React", "Vite"],
    repo: gh("acm_new"),
    live: { href: "https://merklemindsacm.vercel.app/", label: "Live demo", verified: "Checked 9 Nov 2026: frontend loads and the API returns the sample portfolio." },
    visual: "pha",
    featured: true,
    disclaimer: "Educational project. It is not professional investment advice.",
    facts: [
      { value: "5", label: "agents in two LangGraph graphs" },
      { value: "7", label: "pure-Python calculation tools" },
      { value: "70", label: "minimum evaluator score to finish" },
      { value: "3", label: "maximum advisor retries" },
    ],
    overview: {
      what: "Upload holdings or load the sample portfolio, and a multi-agent workflow computes returns, allocation, risk and tax exposure, writes a short report with prioritised recommendations, grades its own report, then answers follow-up questions in a chat.",
      whoBenefits: "Retail investors who want a plain-English first look at their portfolio's concentration and risk, for learning purposes.",
      whyBuilt: "For the ACM Student Chapter's Agentic AI Hackathon, to show an agent workflow where the model's fluency is kept away from the arithmetic.",
    },
    problem: [
      "LLMs are fluent about money and unreliable with arithmetic. A summary that sounds right but miscalculates a weight or a tax figure is worse than no summary.",
      "Generated advice has no built-in check on whether it follows from the numbers.",
    ],
    architecture: {
      intro: "The main graph runs four nodes in order with one conditional edge; a second graph handles Q&A.",
      steps: [
        { title: "Analyst agent", text: "Calls the returns and allocation tools and reports findings, without advice." },
        { title: "Risk agent", text: "Weighted beta and volatility band, Herfindahl–Hirschman sector concentration (flags sectors above 25%), dividend yield, capital-gains tax and rebalancing amounts." },
        { title: "Advisor agent", text: "Writes a plain-English report with one to three prioritised recommendations." },
        { title: "Evaluator agent", text: "Scores the report from 0 to 100. Under 70 with retries left, it routes back to the advisor." },
        { title: "Q&A agent", text: "A separate graph for multi-turn questions with thread history, streamed over SSE." },
      ],
    },
    stackTable: [
      { layer: "Agents", tech: "LangGraph StateGraph, ToolNode, conditional edges", purpose: "Agent orchestration and the evaluator loop" },
      { layer: "LLM", tech: "Groq openai/gpt-oss-20b via ChatGroq", purpose: "Interpretation, report writing, evaluation and Q&A" },
      { layer: "Tools", tech: "Pure Python @tool functions", purpose: "Returns, allocation, beta, HHI, dividends, tax, rebalancing" },
      { layer: "Backend", tech: "FastAPI, sse-starlette", purpose: "Upload, analysis, threads and streaming chat endpoints" },
      { layer: "Frontend", tech: "React, Vite, Axios, EventSource", purpose: "Uploader, pipeline stepper, charts, report and chat drawer" },
      { layer: "Hosting", tech: "Vercel (frontend), Render (backend)", purpose: "Split deployment configured by render.yaml" },
    ],
    features: [
      {
        title: "Deterministic financial tools",
        what: "All portfolio maths in plain Python.",
        how: "Seven tools return structured JSON: returns, allocation, beta and volatility band, HHI concentration, dividend yield, short- and long-term gains tax, and rebalancing amounts.",
        why: "Numbers are reproducible and checkable; the LLM only explains them.",
      },
      {
        title: "Self-correcting report",
        what: "Advice is graded before you see it.",
        how: "The evaluator scores factual consistency, groundedness and actionability; check_evaluation reads score and retry count from graph state and returns the advisor node or END.",
        why: "A cheap, explicit quality gate instead of trusting the first draft.",
      },
      {
        title: "Streaming Q&A",
        what: "Ask follow-up questions about your portfolio.",
        how: "Thread history in a session store; responses streamed through EventSourceResponse and rendered as tokens arrive.",
        why: "Multi-turn questions feel immediate even with a remote model.",
      },
      {
        title: "Compare and export",
        what: "Two portfolios side by side, and a PDF report.",
        how: "Dedicated compare and export endpoints reuse the same analysis outputs.",
        why: "Useful for testing a rebalancing idea against the current holdings.",
      },
    ],
    decisions: [
      { title: "Tools compute, agents interpret", text: "Splitting calculation from language means a hallucinated number can only come from a tool bug, which is testable." },
      { title: "A bounded loop", text: "At most three advisor retries, so a hard case can't loop forever or run up model costs." },
      { title: "SSE over WebSockets", text: "Responses only flow server to client, so Server-Sent Events are simpler and work through standard HTTP." },
    ],
    security: [
      { title: "Keys stay server-side", text: "The Groq API key is read from the backend environment and never reaches the browser." },
      { title: "Upload validation", text: "CSVs must contain ticker, company name, sector, quantity, buy price and current price, or the upload is rejected with the missing columns named." },
      { title: "Clear scope", text: "Labelled as educational; it gives no personalised investment advice." },
    ],
    testing: [
      "The evaluator agent is the quality gate: advice that scores under 70 is rewritten before it's shown.",
      "A 10-holding sample portfolio ships with the repository as a repeatable input.",
      "The live frontend and the backend's sample endpoint were checked for this portfolio.",
    ],
    challenges: [
      { challenge: "LLM arithmetic errors.", solution: "Move every calculation into deterministic tools that return JSON." },
      { challenge: "Variable quality of generated advice.", solution: "An evaluator agent with an explicit threshold and a retry budget." },
    ],
    results: {
      intro: "Deployment status as checked.",
      rows: [
        { label: "Frontend (Vercel)", value: "Working", outcome: "met" },
        { label: "Backend sample endpoint (Render)", value: "Responding", outcome: "met" },
      ],
      caveats: ["The free Render backend can take several seconds to wake on the first request."],
    },
    learnings: ["Agent workflows are most reliable when the model's job is narrow and the checks are explicit."],
    improvements: ["Add unit tests for the seven calculation tools.", "Record evaluator scores across runs to measure how often the loop fires."],
    myRole: "Built for the hackathon; the repository is on my account.",
    gallery: [],
    sources: [
      { label: "README", href: gh("acm_new", "README.md") },
      { label: "Pipeline graph", href: gh("acm_new", "backend/pipeline/graph.py") },
      { label: "Evaluator agent", href: gh("acm_new", "backend/agents/evaluator.py") },
    ],
  },

  /* ── 07 AI Study Lab ─────────────────────────────────────────────── */
  {
    slug: "ai-study-lab",
    number: "07",
    name: "AI Study Lab",
    title: "AI Study Lab",
    subtitle: "A NotebookLM-style study workspace for lectures",
    categories: ["LLM Engineering", "Full Stack"],
    kind: "Local web app, FastAPI and Gemini",
    status: "Runs locally",
    ownership: { type: "Individual", label: "Individual project", note: "Built by me as a single-user study tool." },
    summary:
      "A source-grounded study workspace where Gemini watches lecture videos in segments, BM25 retrieval feeds a cited tutor over SSE, and ten Studio tools generate revision material.",
    result: "79 tests, including the real Gemini SDK against a local mock of the Gemini API.",
    highlights: [
      "Long videos analysed in 20-minute segments; on-screen code, slides and formulas become timestamped passages.",
      "A tutor that answers only from your sources and says so when they don't cover a question.",
      "Strict CSP, rate limits, an SSRF guard that re-checks after redirects, and keys redacted from logs.",
    ],
    stack: ["Python", "FastAPI", "Google Gemini", "SQLite", "JavaScript"],
    repo: gh("youtube-study-ai"),
    visual: "studylab",
    featured: false,
    facts: [
      { value: "10", label: "Studio tools" },
      { value: "9", label: "kinds of source, including video and handwriting" },
      { value: "79", label: "tests, no key or network needed" },
    ],
    overview: {
      what: "A three-panel workspace: sources on the left, a tutor in the middle and a Studio on the right that generates notes, flashcards, quizzes, mind maps and more from whichever sources you tick.",
      whoBenefits: "Students revising from long lecture videos, slides and handwritten notes.",
      whyBuilt: "General chatbots answer from what they already know, not from what the lecturer said, and give nothing to check the answer against.",
    },
    problem: [
      "Lecture videos are slow to revise from, and what's shown on screen (code, formulas, slides) is missing from captions.",
      "An ungrounded tutor can't be trusted for exam preparation.",
    ],
    architecture: {
      intro: "A FastAPI app with a no-build ES-module frontend and local SQLite storage.",
      steps: [
        { title: "Ingestion", text: "YouTube captions plus video understanding, audio and video files, PDF, DOCX, PPTX, images, subtitles, web pages and pasted text." },
        { title: "Passages", text: "Each source becomes passages with page numbers or timestamps, plus a generated source guide." },
        { title: "Retrieval", text: "BM25 ranking and citation mapping; large notebooks searched for the most relevant passages." },
        { title: "Tutor", text: "Streams grounded answers with live status lines and suggested follow-ups." },
        { title: "Studio", text: "Ten generators producing structured, saved outputs." },
      ],
    },
    stackTable: [
      { layer: "Backend", tech: "FastAPI, SQLite", purpose: "Notebooks, sources, passages, chat and outputs" },
      { layer: "AI", tech: "Google Gemini (google-genai), Files API, TTS; OpenAI text fallback", purpose: "Video understanding, chat, Studio generation, audio overviews" },
      { layer: "Documents", tech: "pypdf, DOCX and PPTX extraction", purpose: "Text with page and slide structure" },
      { layer: "Frontend", tech: "ES modules, marked, DOMPurify, KaTeX, highlight.js", purpose: "Three-panel workspace with safe Markdown and maths" },
      { layer: "Security", tech: "CSP middleware, rate limiter, SSRF guard, log redaction", purpose: "Defence for a local app that fetches URLs and calls an API" },
      { layer: "Testing", tech: "pytest, mock Gemini server", purpose: "End-to-end tests without a key or network" },
    ],
    features: [
      {
        title: "Video understanding",
        what: "Gemini watches the lecture, not just the captions.",
        how: "Frames and audio analysed in 20-minute segments; on-screen material becomes timestamped passages; a transcript is written when captions are missing.",
        why: "Code and formulas on slides are often the most important content.",
      },
      {
        title: "Cited tutor",
        what: "Answers with clickable evidence.",
        how: "Every claim carries a numbered citation; clicking jumps to the passage or seeks the video to the timestamp.",
        why: "Students can verify an answer in seconds.",
      },
      {
        title: "Studio",
        what: "Revision material in one click.",
        how: "Notes in six styles, reports, flashcards with progress, quizzes with per-topic scores, a mind map, audio and video overviews, slide decks, infographics and data tables.",
        why: "Different revision tasks need different formats from the same sources.",
      },
    ],
    decisions: [
      { title: "Honest failure", text: "When a source can't be processed it shows the real reason and a retry button; nothing is invented to fill the gap." },
      { title: "Quota-aware analysis", text: "On rate limits it waits, retries at lower resolution, keeps the segments that worked and lists the gaps." },
      { title: "Model fallback", text: "Unavailable models fall back automatically; an OpenAI key works as a text-only alternative." },
    ],
    security: [
      { title: "Content Security Policy", text: "A strict CSP that only allows YouTube embeds as frames." },
      { title: "SSRF protection", text: "Private and internal addresses are blocked for web sources, including after redirects." },
      { title: "Prompt hygiene", text: "Source text is treated as data, never as instructions to the model." },
      { title: "Local by default", text: "Binds to 127.0.0.1, with request-size limits, rate limits and keys redacted from logs and errors." },
    ],
    testing: [
      "79 tests covering ingestion, retrieval, citations, every Studio generator and the API end to end.",
      "The real Gemini SDK tested against a local mock of the Gemini API: request shapes, streaming, model fallback, uploads, TTS and error mapping.",
    ],
    challenges: [
      { challenge: "API quotas on long videos.", solution: "Segment, retry at lower resolution, keep partial results and report gaps." },
      { challenge: "Testing an app built around a paid external API.", solution: "A mock Gemini server so the suite runs offline." },
    ],
    results: {
      intro: "A local, single-user application.",
      rows: [{ label: "Deployment", value: "Runs on your own machine", outcome: "info" }],
      caveats: ["No hosted demo: it has no accounts or authentication by design and shouldn't be exposed to the internet as is."],
    },
    learnings: ["Grounding and citations change how much a model's answer can be trusted more than the choice of model."],
    improvements: ["Add authentication before any shared deployment."],
    myRole: "Built the backend, frontend, AI integration, security middleware and tests.",
    gallery: [],
    sources: [
      { label: "README", href: gh("youtube-study-ai", "README.md") },
      { label: "Security middleware", href: gh("youtube-study-ai", "app/security/middleware.py") },
      { label: "SSRF guard", href: gh("youtube-study-ai", "app/security/ssrf.py") },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.filter((p) => p.featured);

/* Which technologies each project uses, for the stack map on the index. */
export const stackMap = {
  tech: ["Rust", "TypeScript", "React", "Node.js", "MongoDB", "JavaScript", "Security", "SQLite", "LLMs", "FastAPI", "Python", "PyTorch", "scikit-learn"],
  uses: {
    tessera: ["Rust", "TypeScript", "React", "LLMs", "SQLite", "Security", "Python"],
    epm: ["Python", "PyTorch", "scikit-learn", "JavaScript"],
    psyprep: ["JavaScript", "React", "Node.js", "MongoDB", "Security"],
    "deep-forge": ["TypeScript", "React"],
    "coffee-line": ["Python", "scikit-learn", "JavaScript"],
    "portfolio-health-advisor": ["Python", "FastAPI", "LLMs", "React", "JavaScript"],
    "ai-study-lab": ["Python", "FastAPI", "LLMs", "SQLite", "JavaScript", "Security"],
  } as Record<string, string[]>,
};

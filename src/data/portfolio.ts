/*
 * Single source of truth for every word on the site.
 *
 * Sources, in priority order: the resume details Pranshu supplied, each
 * repository's README and docs, the source code itself, and the live
 * deployments (checked 9 Nov 2026). Where a README and a later report disagree,
 * the later, machine-generated report wins and the difference is noted inline.
 */

import type { BrandIconName } from "./icons";

export * from "./projects";
export * from "./notes";

export const site = {
  name: "Pranshu Ranjan",
  title: "Pranshu Ranjan — AI/ML, application security and full-stack engineering",
  description:
    "Computer Science undergraduate at BIT Mesra building local-first AI systems, secure LLM applications, ML research code and full-stack products.",
  locale: "en_IN",
};

export const profile = {
  name: "Pranshu Ranjan",
  initials: "PR",
  role: "Computer Science undergraduate",
  focus: ["AI / ML", "Software engineering", "Application security"],
  headline: "Building intelligent systems. Securing them. Making them useful.",
  intro:
    "I'm Pranshu, a Computer Science undergraduate at BIT Mesra. I build AI-powered applications, run machine learning experiments and engineer software with security in mind. Most of my projects start as a question I can only answer by building the system and measuring it.",
  location: "Ranchi, Jharkhand, India",
  email: "ranpranshu65@gmail.com",
  phone: "+91 8809842969",
  phoneHref: "tel:+918809842969",
  github: "https://github.com/webex042",
  githubHandle: "webex042",
  linkedin: "https://linkedin.com/in/pranshu-ranjan-05b175201",
  linkedinHandle: "pranshu-ranjan-05b175201",
  portrait: {
    src: "/images/pranshu-profile.jpg",
    width: 585,
    height: 731,
    alt: "Pranshu Ranjan, arms folded, smiling, standing at a cricket stadium with green and yellow stands behind him",
  },
  resumeFile: "Pranshu_Ranjan_Resume.pdf",
};

export const about = {
  lead:
    "I learn by building. Most of my projects start as a question I can't answer by reading about it, and end with a system, a test suite and a set of numbers, including the ones that missed the target.",
  ideas: [
    {
      title: "The builder mindset",
      text: "I understand a concept once I've implemented it. EPM started from linear algebra and gradient descent written by hand before it reached diffusion models; DEEP FORGE's team wrote its own heap, Dijkstra and search engine rather than importing them. Building the parts is slower, but it means I can explain every number the system produces.",
      evidence: ["epm", "deep-forge"],
    },
    {
      title: "Research meets engineering",
      text: "My ML work is research-shaped (hypotheses, held-out splits, confidence intervals) and my software work is product-shaped (APIs, auth, deployments). I like the projects where the two meet: a diffusion study with a dashboard and serverless API, or a predictive-maintenance model that ends in a ranked repair list rather than a score.",
      evidence: ["epm", "coffee-line"],
    },
    {
      title: "Engineering with security in mind",
      text: "An intelligent application is only useful if it holds up when its input is hostile. In Tessera that meant six trust boundaries, redaction before storage and a model with no tools; in PsyPrep, a deadline the browser can't move. I write down the open issues next to the results.",
      evidence: ["tessera", "psyprep"],
    },
  ],
  facts: [
    { label: "Studying", value: "B.Tech CSE, BIT Mesra, 2024–2028" },
    { label: "Based in", value: "Ranchi, Jharkhand, India" },
    { label: "Working on", value: "Local-first AI, LLM security, ML research" },
    { label: "Looking for", value: "SWE, AI/ML and backend internships" },
  ],
  interests: [
    "Artificial intelligence and machine learning",
    "AI application security and prompt-injection defence",
    "LLM engineering",
    "Backend and full-stack development",
    "Data structures and algorithms",
  ],
};

/* "What I work on": specialisations, each tied to the projects that show it. */
export const specialisations = [
  {
    id: "01",
    title: "AI application security",
    text: "Prompt-injection defence, threat modelling, PII and secret redaction, and AI systems designed so a misbehaving model can't act.",
    label: "Tessera, AI Study Lab",
  },
  {
    id: "02",
    title: "Machine learning engineering",
    text: "PyTorch and scikit-learn models, from scratch implementations to diffusion, evaluated with leakage-free splits and confidence intervals.",
    label: "EPM, Coffee Line",
  },
  {
    id: "03",
    title: "LLM systems",
    text: "Local inference with llama.cpp, grounded retrieval with citations, multi-agent workflows and model evaluation.",
    label: "Tessera, Health Advisor, Study Lab",
  },
  {
    id: "04",
    title: "Full-stack development",
    text: "React frontends over Node, Express and FastAPI backends, with authentication, validation and serverless deployment.",
    label: "PsyPrep, Health Advisor",
  },
  {
    id: "05",
    title: "Backend and systems engineering",
    text: "Rust services, encrypted storage, process isolation, dependency auditing with cargo-deny, and CI that runs the tests.",
    label: "Tessera",
  },
  {
    id: "06",
    title: "Algorithms and problem solving",
    text: "Graph search, heuristics and priority queues, plus 150+ LeetCode problems solved in Java.",
    label: "DEEP FORGE, LeetCode",
  },
];

/* "Currently": only things the repositories or the resume support. */
export const currently = [
  {
    label: "Building",
    text: "Tessera's Stage 7 security hardening and guardrail audit, marked in progress in the repository.",
    href: "/projects/tessera",
    linkText: "Read the case study",
  },
  { label: "Studying", text: "B.Tech in Computer Science and Engineering at BIT Mesra, 2024–2028, CGPA 7.6." },
  { label: "Practising", text: "Data structures and algorithms in Java: 150+ LeetCode problems solved." },
  { label: "Exploring", text: "AI security, LLM systems and machine learning engineering." },
  { label: "Certified", text: "Agentic AI Certified Foundations Associate, Oracle University, August 2026." },
];

/* Tools for the ticker: only technologies used in the repositories or listed on the resume. */
export const tools = [
  "Java", "Python", "JavaScript", "TypeScript", "Rust", "React", "Node.js", "Express", "FastAPI",
  "MongoDB", "SQLite", "SQLCipher", "PyTorch", "scikit-learn", "XGBoost", "pandas", "NumPy", "SHAP", "llama.cpp",
  "LangGraph", "Tauri", "Tailwind CSS", "Streamlit", "Docker", "Git", "GitHub Actions", "pytest", "Vitest", "Vercel",
];

export type Skill = { name: string; icon?: BrandIconName; note?: string };
export type SkillGroup = { title: string; summary: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    summary: "Java for problem solving, Python for ML, JavaScript for the web; Rust and TypeScript at working level in larger projects.",
    skills: [
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Rust", icon: "rust", note: "working knowledge" },
      { name: "TypeScript", icon: "typescript", note: "working knowledge" },
    ],
  },
  {
    title: "AI and machine learning",
    summary: "From scratch implementations to local LLM inference and evaluation.",
    skills: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "XGBoost" },
      { name: "pandas", icon: "pandas" },
      { name: "NumPy", icon: "numpy" },
      { name: "llama.cpp" },
      { name: "LangGraph", icon: "langchain" },
      { name: "LLM evaluation" },
    ],
  },
  {
    title: "Application security",
    summary: "Applied in Tessera, PsyPrep and AI Study Lab rather than studied in isolation.",
    skills: [
      { name: "Threat modelling" },
      { name: "Prompt-injection testing" },
      { name: "PII and secret redaction" },
      { name: "JWT authentication", icon: "jwt" },
      { name: "cargo-deny dependency scanning" },
      { name: "SQLCipher, AES-256 at rest", icon: "sqlite" },
      { name: "Content Security Policy" },
    ],
  },
  {
    title: "Backend",
    summary: "REST and streaming APIs with validation, auth and serverless deploys.",
    skills: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express.js", icon: "express" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "SQLite", icon: "sqlite" },
      { name: "Server-Sent Events" },
    ],
  },
  {
    title: "Frontend",
    summary: "React interfaces built for clarity, keyboard use and small screens.",
    skills: [
      { name: "React", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Vite", icon: "vite" },
      { name: "Tauri", icon: "tauri" },
    ],
  },
  {
    title: "Tools and infrastructure",
    summary: "Reproducible builds, CI that runs the tests, and deploys that stay boring.",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Docker", icon: "docker" },
      { name: "pytest", icon: "pytest" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
];

export const education = {
  institution: "Birla Institute of Technology, Mesra",
  degree: "B.Tech, Computer Science and Engineering",
  period: "2024 – 2028",
  cgpa: "7.6 / 10",
  coursework: [
    "Data Structures and Algorithms",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Data Mining",
  ],
};

export const achievements = [
  {
    kind: "Problem solving",
    title: "150+ LeetCode problems solved in Java",
    text: "Algorithmic problem solving in Java: data structures, graph algorithms and complexity analysis.",
    date: "Ongoing",
    icon: "leetcode" as BrandIconName,
  },
  {
    kind: "Certification",
    title: "Agentic AI Certified Foundations Associate",
    text: "Foundations-level certification in agentic AI.",
    issuer: "Oracle University",
    date: "August 2026",
  },
];


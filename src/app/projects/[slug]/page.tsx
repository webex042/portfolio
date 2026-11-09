import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { getProject, notes, projects, type Project, type ResultRow } from "@/data/portfolio";
import { BrandIcon } from "@/components/BrandIcon";
import { CaseToc } from "@/components/CaseToc";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { TesseraPipeline } from "@/components/visuals/TesseraPipeline";
import { PsyPrepTimerFlow } from "@/components/visuals/PsyPrepTimerFlow";
import { GbfsDemo } from "@/components/visuals/GbfsDemo";
import { PhaFlow } from "@/components/visuals/PhaFlow";
import { EpmChart } from "@/components/visuals/EpmChart";
import { FigurePlate } from "@/components/visuals/FigurePlate";
import { ScreenshotFrame } from "@/components/visuals/ScreenshotFrame";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const image = p.gallery[0];
  return {
    title: `${p.title}: ${p.subtitle}`,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      type: "article",
      title: `${p.title} — case study`,
      description: p.summary,
      url: `/projects/${p.slug}`,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: `${p.title} — case study`, description: p.summary },
  };
}

const SECTIONS = [
  ["overview", "02", "Overview"],
  ["problem", "03", "Problem statement"],
  ["architecture", "04", "Architecture and flow"],
  ["stack", "05", "Tech stack"],
  ["features", "06", "Core features"],
  ["decisions", "07", "Engineering decisions"],
  ["security", "08", "Security and reliability"],
  ["testing", "09", "Testing and evaluation"],
  ["challenges", "10", "Challenges and solutions"],
  ["results", "11", "Results and learnings"],
  ["links", "12", "Links"],
] as const;

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-4 border-t border-ink pt-5 text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] font-[630] leading-tight [font-stretch:112%]">
      <span className="font-mono text-[0.875rem] font-normal text-ink-3 tabular" aria-hidden>
        {n}
      </span>
      <span id={`${id}-h`}>{children}</span>
    </h2>
  );
}

function Block({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <H2 id={id} n={n}>
        {title}
      </H2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Outcome({ o }: { o: ResultRow["outcome"] }) {
  const map = { met: ["Met", "border-met text-met"], missed: ["Missed", "border-missed text-missed"], info: ["Measured", "border-rule-strong text-ink-3"] } as const;
  const [label, cls] = map[o];
  return <span className={`inline-block rounded-[3px] border px-1.5 font-mono text-[0.6875rem] ${cls}`}>{label}</span>;
}

function ArchitectureExtra({ p }: { p: Project }) {
  switch (p.visual) {
    case "tessera":
      return <TesseraPipeline size="full" />;
    case "psyprep":
      return (
        <div className="flex flex-col gap-6">
          <FlowDiagram steps={p.architecture.steps} label={`${p.name} architecture`} />
          <PsyPrepTimerFlow />
        </div>
      );
    case "deepforge":
      return (
        <div className="flex flex-col gap-6">
          <FlowDiagram steps={p.architecture.steps} label={`${p.name} architecture`} />
          <GbfsDemo />
        </div>
      );
    case "pha":
      return (
        <div className="flex flex-col gap-6">
          <PhaFlow />
          <FlowDiagram steps={p.architecture.steps} label={`${p.name} agents`} />
        </div>
      );
    default:
      return <FlowDiagram steps={p.architecture.steps} label={`${p.name} architecture`} />;
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const related = notes.filter((n) => n.project === p.slug);
  const toc = SECTIONS.map(([id, n, label]) => ({ id, n, label }));

  return (
    <article>
      {/* 01 Project header */}
      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="wrap relative pb-12 pt-8 md:pb-16 md:pt-12">
          <Link href="/projects" className="meta inline-flex items-center gap-2 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            All projects
          </Link>
          <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <li className="meta tabular !text-ink">{p.number}</li>
            <li className="meta">{p.categories.join(", ")}</li>
            <li className={`meta ${p.ownership.type === "Team" ? "!text-ink" : ""}`}>{p.ownership.label}</li>
            <li className="meta">{p.status}</li>
          </ul>
          <h1 className="display mt-4 text-[clamp(2.75rem,1.6rem+4.8vw,6rem)]">{p.title}</h1>
          <p className="mt-4 max-w-[40ch] text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-snug text-ink-2">{p.subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <p className="lead measure text-pretty !text-ink">{p.summary}</p>
              {p.disclaimer ? <p className="border-l-2 border-ink pl-3 text-[0.9375rem] text-ink-2">{p.disclaimer}</p> : null}
              <div className="flex flex-wrap gap-2.5">
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                  <BrandIcon name="github" size={16} />
                  GitHub repository
                </a>
                {p.live ? (
                  <a href={p.live.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <ExternalLink size={16} strokeWidth={1.75} aria-hidden />
                    {p.live.label}
                  </a>
                ) : null}
              </div>
              {p.live ? <p className="meta">{p.live.verified}</p> : <p className="meta">No hosted demo; the repository has setup instructions.</p>}
            </div>
            <div className="lg:col-span-5">
              <p className="meta mb-2">Technology</p>
              <ul className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid grid-cols-2 border-t border-ink">
                {p.facts.map((f) => (
                  <div key={f.label} className="border-b border-rule py-3 pr-3">
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="block text-[1.5rem] font-[640] leading-none tabular [font-stretch:115%]">{f.value}</span>
                      <span className="mt-1.5 block text-[0.8125rem] leading-snug text-ink-3">{f.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      {p.visual !== "tessera" && p.visual !== "pha" ? (
        <div className="wrap pt-12">
          <ProjectVisual project={p} size="full" />
        </div>
      ) : null}

      <div className="wrap grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:gap-8 md:py-20">
        <aside className="hidden lg:col-span-3 lg:block">
          <CaseToc items={toc} />
        </aside>

        <div className="flex min-w-0 flex-col gap-20 lg:col-span-9">
          <Block id="overview" n="02" title="Overview">
            <dl className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                ["What it does", p.overview.what],
                ["Who it helps", p.overview.whoBenefits],
                ["Why it was built", p.overview.whyBuilt],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.9375rem] font-[620]">{k}</dt>
                  <dd className="mt-2 text-[0.96875rem] leading-relaxed text-ink-2 text-pretty">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-md border border-rule bg-surface p-4">
              <p className="meta">My role</p>
              <p className="mt-1 text-ink">{p.myRole}</p>
              <p className="mt-1 text-[0.9375rem] text-ink-3">{p.ownership.note}</p>
            </div>
          </Block>

          <Block id="problem" n="03" title="Problem statement">
            <ul className="flex flex-col gap-4">
              {p.problem.map((x) => (
                <li key={x} className="measure grid grid-cols-[0.875rem_1fr] gap-3 text-pretty text-ink-2">
                  <span aria-hidden className="mt-[0.65em] h-px w-3 bg-ink" />
                  {x}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="architecture" n="04" title="Architecture and flow">
            <p className="measure mb-6 text-pretty text-ink-2">{p.architecture.intro}</p>
            <ArchitectureExtra p={p} />
            {p.visual === "tessera" ? (
              <div className="mt-6">
                <FlowDiagram steps={p.architecture.steps} label="Tessera stages in detail" />
              </div>
            ) : null}
            {p.architecture.note ? <p className="measure mt-6 border-l-2 border-cobalt pl-4 text-[0.96875rem] text-ink-2 text-pretty">{p.architecture.note}</p> : null}
          </Block>

          <Block id="stack" n="05" title="Tech stack and dependencies">
            <div className="overflow-x-auto rounded-md border border-rule">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Layer</th>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Technology</th>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {p.stackTable.map((r) => (
                    <tr key={r.layer} className="border-b border-rule last:border-b-0 align-top">
                      <th scope="row" className="px-4 py-3 font-[600] text-ink">{r.layer}</th>
                      <td className="px-4 py-3 font-mono text-[0.8125rem] text-ink-2">{r.tech}</td>
                      <td className="px-4 py-3 text-ink-2">{r.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Block id="features" n="06" title="Core features">
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {p.features.map((f) => (
                <div key={f.title} className="grid grid-cols-1 gap-4 py-6 md:grid-cols-4 md:gap-6">
                  <h3 className="text-[1.0625rem] font-[630] leading-snug [font-stretch:108%]">{f.title}</h3>
                  {[
                    ["What", f.what],
                    ["How", f.how],
                    ["Why it matters", f.why],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="meta">{k}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2 text-pretty">{v}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Block>

          <Block id="decisions" n="07" title="Engineering decisions">
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {p.decisions.map((d) => (
                <div key={d.title}>
                  <h3 className="text-[1.0625rem] font-[630] leading-snug [font-stretch:108%]">{d.title}</h3>
                  <p className="mt-2 text-[0.96875rem] leading-relaxed text-ink-2 text-pretty">{d.text}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="security" n="08" title="Security and reliability">
            <dl className="border-t border-rule">
              {p.security.map((s) => (
                <div key={s.title} className="grid grid-cols-1 gap-1.5 border-b border-rule py-4 md:grid-cols-[13rem_1fr] md:gap-6">
                  <dt className="font-[620]">{s.title}</dt>
                  <dd className="text-[0.96875rem] text-ink-2 text-pretty">{s.text}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="testing" n="09" title="Testing and evaluation">
            <ul className="flex flex-col gap-3.5">
              {p.testing.map((t) => (
                <li key={t} className="measure grid grid-cols-[0.875rem_1fr] gap-3 text-pretty text-ink-2">
                  <span aria-hidden className="mt-[0.6em] size-[7px] bg-cobalt" />
                  {t}
                </li>
              ))}
            </ul>
            {p.visual === "epm" ? (
              <div className="mt-8">
                <EpmChart />
              </div>
            ) : null}
          </Block>

          <Block id="challenges" n="10" title="Challenges and solutions">
            <ol className="flex flex-col gap-6">
              {p.challenges.map((c, i) => (
                <li key={c.challenge} className="grid grid-cols-1 gap-3 rounded-md border border-rule p-5 md:grid-cols-2 md:gap-8">
                  <div>
                    <p className="meta">Challenge {i + 1}</p>
                    <p className="mt-1 text-ink text-pretty">{c.challenge}</p>
                  </div>
                  <div>
                    <p className="meta">{p.ownership.type === "Team" ? "How the team solved it" : "What I did"}</p>
                    <p className="mt-1 text-ink-2 text-pretty">{c.solution}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="results" n="11" title="Results and learnings">
            <p className="measure text-pretty text-ink-2">{p.results.intro}</p>
            <div className="mt-6 overflow-x-auto rounded-md border border-rule">
              <table className="w-full min-w-[30rem] border-collapse text-left text-[0.9375rem]">
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Measure</th>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Result</th>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Target</th>
                    <th scope="col" className="meta border-b border-rule px-4 py-2.5 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {p.results.rows.map((r) => (
                    <tr key={r.label} className="border-b border-rule last:border-b-0">
                      <th scope="row" className="px-4 py-3 font-normal text-ink">{r.label}</th>
                      <td className="px-4 py-3 font-mono text-[0.8125rem] text-ink tabular">{r.value}</td>
                      <td className="px-4 py-3 font-mono text-[0.8125rem] text-ink-3">{r.target ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Outcome o={r.outcome} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-6 flex flex-col gap-2.5">
              {p.results.caveats.map((c) => (
                <li key={c} className="measure text-[0.9375rem] text-ink-3 text-pretty">
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-[1.0625rem] font-[630]">What I learned</h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {p.learnings.map((l) => (
                    <li key={l} className="text-[0.96875rem] text-ink-2 text-pretty">{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[1.0625rem] font-[630]">What I&rsquo;d improve next</h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {p.improvements.map((l) => (
                    <li key={l} className="text-[0.96875rem] text-ink-2 text-pretty">{l}</li>
                  ))}
                </ul>
              </div>
            </div>

            {p.gallery.length > (p.visual === "psyprep" || p.visual === "deepforge" || p.visual === "coffee" ? 1 : 0) ? (
              <div className="mt-12">
                <h3 className="text-[1.0625rem] font-[630]">Screenshots and figures</h3>
                <div className="mt-5 grid grid-cols-1 gap-8">
                  {p.gallery
                    .slice(p.visual === "psyprep" || p.visual === "deepforge" || p.visual === "coffee" ? 1 : 0)
                    .map((g) =>
                      g.real === "screenshot" ? (
                        <figure key={g.src}>
                          <ScreenshotFrame {...g} url={p.live ? new URL(p.live.href).host : "local build"} dark={p.visual === "deepforge"} sizes="(min-width: 1024px) 70vw, 100vw" />
                          <figcaption className="meta mt-2.5">{g.caption}</figcaption>
                        </figure>
                      ) : (
                        <FigurePlate key={g.src} {...g} sizes="(min-width: 1024px) 70vw, 100vw" />
                      ),
                    )}
                </div>
              </div>
            ) : null}
          </Block>

          <Block id="links" n="12" title="Links">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li>
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md border border-rule-strong px-4 py-3 hover:border-ink">
                  <BrandIcon name="github" size={17} />
                  <span>GitHub repository</span>
                </a>
              </li>
              {p.live ? (
                <li>
                  <a href={p.live.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md border border-rule-strong px-4 py-3 hover:border-ink">
                    <ExternalLink size={17} strokeWidth={1.75} aria-hidden />
                    <span>{p.live.label}</span>
                  </a>
                </li>
              ) : null}
              {p.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md border border-rule px-4 py-3 text-ink-2 hover:border-ink hover:text-ink">
                    <FileText size={17} strokeWidth={1.75} aria-hidden />
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {related.length ? (
              <div className="mt-8">
                <p className="meta">From the engineering log</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {related.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/notes/${n.slug}`} className="link">
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Block>
        </div>
      </div>

      <nav aria-label="More projects" className="border-t border-ink bg-surface">
        <div className="wrap grid grid-cols-1 md:grid-cols-2">
          {[
            ["Previous", prev],
            ["Next", next],
          ].map(([label, q]) => {
            const proj = q as Project;
            return (
              <Link key={label as string} href={`/projects/${proj.slug}`} className={`group flex flex-col gap-2 py-10 ${label === "Next" ? "md:items-end md:border-l md:border-rule md:pl-8 md:text-right" : "md:pr-8"}`}>
                <span className="meta">
                  {label as string} project, {proj.number}
                </span>
                <span className="heading text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] group-hover:text-cobalt">{proj.title}</span>
                <span className="text-ink-2">{proj.subtitle}</span>
              </Link>
            );
          })}
        </div>
        <div className="wrap border-t border-rule py-6">
          <Link href="/projects" className="link">
            Back to the full project index
          </Link>
        </div>
      </nav>
    </article>
  );
}

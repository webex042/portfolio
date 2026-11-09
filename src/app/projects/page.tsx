import type { Metadata } from "next";
import { categories, projects } from "@/data/portfolio";
import { ProjectIndex, type IndexEntry } from "@/components/ProjectIndex";
import { StackMap } from "@/components/StackMap";

export const metadata: Metadata = {
  title: "Project index",
  description: "All seven public projects by Pranshu Ranjan: local-first AI security, ML research, full-stack platforms, algorithms and multi-agent systems, each with a case study.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const entries: IndexEntry[] = projects.map((p) => ({
    slug: p.slug,
    number: p.number,
    title: p.title,
    subtitle: p.subtitle,
    summary: p.summary,
    result: p.result,
    categories: p.categories,
    stack: p.stack,
    status: p.status,
    ownership: p.ownership.label,
    repo: p.repo,
    live: p.live?.href,
  }));
  const used = categories.filter((c) => projects.some((p) => p.categories.includes(c)));

  return (
    <>
      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="wrap relative grid grid-cols-1 gap-8 pb-12 pt-12 md:pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="display text-[clamp(3rem,1.8rem+5vw,6.5rem)]">Project index</h1>
            <p className="lead mt-6 max-w-[52ch]">
              Every public repository on github.com/webex042, with what it does, the strongest verified result and a full case study. Filter by area or search by technology.
            </p>
          </div>
          <dl className="grid grid-cols-3 self-end border-t border-ink lg:col-span-5">
            {used.map((c) => (
              <div key={c} className="border-b border-rule py-3 pr-2">
                <dt className="text-[0.8125rem] leading-snug text-ink-3">{c}</dt>
                <dd className="text-[1.375rem] font-[640] tabular [font-stretch:115%]">{projects.filter((p) => p.categories.includes(c)).length}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="wrap py-14 md:py-16" aria-label="All projects">
        <ProjectIndex entries={entries} categories={used} />
      </section>

      <section className="wrap pb-20 md:pb-28" aria-label="Projects and technologies">
        <StackMap linkBase="/projects/" />
      </section>
    </>
  );
}

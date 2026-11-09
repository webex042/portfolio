import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { getNote, getProject, notes } from "@/data/portfolio";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.summary,
    alternates: { canonical: `/notes/${n.slug}` },
    openGraph: { type: "article", title: n.title, description: n.summary, url: `/notes/${n.slug}` },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) notFound();
  const p = getProject(n.project);
  const i = notes.findIndex((x) => x.slug === n.slug);
  const next = notes[(i + 1) % notes.length];

  return (
    <article>
      <header className="border-b border-rule">
        <div className="wrap pb-12 pt-8 md:pt-12">
          <Link href="/notes" className="meta inline-flex items-center gap-2 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            Engineering log
          </Link>
          <p className="meta mt-8">
            {p ? (
              <Link href={`/projects/${p.slug}`} className="link">
                {p.name}
              </Link>
            ) : null}
            {p ? ", " : ""}
            {n.topics.join(", ")}
          </p>
          <h1 className="heading mt-3 max-w-[22ch] text-[clamp(2.25rem,1.5rem+3vw,4rem)] text-balance">{n.title}</h1>
          <p className="lead mt-5 max-w-[52ch]">{n.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-4">
            <li className="meta inline-flex items-center gap-2">
              <span aria-hidden className="h-3.5 w-[3px] bg-ink" />
              Documented: what the repository says
            </li>
            <li className="meta inline-flex items-center gap-2">
              <span aria-hidden className="h-3.5 w-[3px] bg-cobalt" />
              Analysis: written for this site
            </li>
          </ul>
        </div>
      </header>

      <div className="wrap grid grid-cols-1 gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-12 lg:col-span-8">
          {n.sections.map((s, si) => (
            <section key={s.heading} aria-labelledby={`sec-${si}-h`} className={`border-l-[3px] pl-5 sm:pl-7 ${s.kind === "documented" ? "border-ink" : "border-cobalt"}`}>
              <p className={`meta ${s.kind === "analysis" ? "!text-cobalt" : ""}`}>{s.kind === "documented" ? "Documented" : "Analysis"}</p>
              <h2 id={`sec-${si}-h`} className="mt-1 text-[1.5rem] font-[630] leading-tight [font-stretch:110%]">
                {s.heading}
              </h2>
              {s.body.map((para) => (
                <p key={para.slice(0, 40)} className="measure mt-4 text-pretty text-ink-2">
                  {para}
                </p>
              ))}
              {s.code ? (
                <figure className="mt-5">
                  <pre className="overflow-x-auto rounded-md border border-rule bg-sunken p-4 font-mono text-[0.8125rem] leading-relaxed text-ink">
                    <code>{s.code.text}</code>
                  </pre>
                  <figcaption className="meta mt-2">{s.code.caption}</figcaption>
                </figure>
              ) : null}
            </section>
          ))}
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="lg:sticky lg:top-24">
            <p className="meta">Sources in the repository</p>
            <ul className="mt-3 flex flex-col gap-2">
              {n.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-[0.9375rem] text-ink-2 hover:text-ink">
                    <FileText size={15} strokeWidth={1.75} className="mt-1 shrink-0" aria-hidden />
                    <span className="break-all underline decoration-rule-strong underline-offset-4">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {p ? (
              <Link href={`/projects/${p.slug}`} className="btn btn-line btn-sm mt-6">
                {p.name} case study
              </Link>
            ) : null}
          </div>
        </aside>
      </div>

      <nav aria-label="Next note" className="border-t border-ink bg-surface">
        <Link href={`/notes/${next.slug}`} className="wrap group flex flex-col gap-2 py-10">
          <span className="meta">Next note</span>
          <span className="heading text-[clamp(1.375rem,1.15rem+0.8vw,1.875rem)] group-hover:text-cobalt">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}

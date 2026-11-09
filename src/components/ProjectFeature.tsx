import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { ProjectVisual } from "./visuals/ProjectVisual";

export type Variant = "wide" | "split-left" | "split-right" | "pair" | "compact";

function Meta({ p }: { p: Project }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <li className="meta tabular !text-ink">{p.number}</li>
      <li className="meta">{p.categories.join(", ")}</li>
      <li className={`meta ${p.ownership.type === "Team" ? "!text-ink" : ""}`}>{p.ownership.label}</li>
      {p.live ? (
        <li className="meta inline-flex items-center gap-1.5 !text-ink-2">
          <span aria-hidden className="size-1.5 rounded-full bg-met" />
          live
        </li>
      ) : null}
    </ul>
  );
}

export function Actions({ p, compact = false }: { p: Project; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Link href={`/projects/${p.slug}`} className={`btn btn-ink ${compact ? "btn-sm" : ""}`} aria-label={`Read the ${p.name} case study`}>
        Read the case study
      </Link>
      {p.live ? (
        <a href={p.live.href} target="_blank" rel="noopener noreferrer" className={`btn btn-line ${compact ? "btn-sm" : ""}`} aria-label={`${p.live.label} for ${p.name} (opens in a new tab)`}>
          <ExternalLink size={15} strokeWidth={1.75} aria-hidden />
          {p.live.label}
        </a>
      ) : null}
      <a href={p.repo} target="_blank" rel="noopener noreferrer" className={`btn btn-line ${compact ? "btn-sm" : ""}`} aria-label={`${p.name} source code on GitHub (opens in a new tab)`}>
        <BrandIcon name="github" size={15} />
        Source code
      </a>
    </div>
  );
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((h) => (
        <li key={h} className="grid grid-cols-[0.875rem_1fr] gap-2.5 text-[0.96875rem] leading-relaxed text-ink-2">
          <span aria-hidden className="mt-[0.6em] size-[7px] bg-cobalt" />
          <span className="text-pretty">{h}</span>
        </li>
      ))}
    </ul>
  );
}

function Result({ p }: { p: Project }) {
  return (
    <p className="border-l-2 border-cobalt pl-3 text-[0.9375rem] leading-relaxed text-ink">
      <span className="meta mr-2 !text-cobalt">Result</span>
      {p.result}
    </p>
  );
}

function Facts({ p }: { p: Project }) {
  return (
    <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-4">
      {p.facts.slice(0, 4).map((f) => (
        <div key={f.label} className="border-b border-rule py-3 pr-3 sm:border-b-0">
          <dt className="sr-only">{f.label}</dt>
          <dd>
            <span className="block text-[1.5rem] font-[640] leading-none tabular [font-stretch:115%]">{f.value}</span>
            <span className="mt-1.5 block text-[0.8125rem] leading-snug text-ink-3">{f.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((s) => (
        <li key={s} className="tag">
          {s}
        </li>
      ))}
    </ul>
  );
}

function Title({ p, size = "lg" }: { p: Project; size?: "lg" | "md" }) {
  const id = `project-${p.slug}-title`;
  return (
    <div>
      <h3 id={id} className={`heading ${size === "lg" ? "text-[clamp(2rem,1.5rem+1.8vw,3rem)]" : "text-[clamp(1.5rem,1.3rem+0.8vw,1.875rem)]"}`}>
        <Link href={`/projects/${p.slug}`} className="hover:text-cobalt">
          {p.title}
        </Link>
      </h3>
      <p className={`mt-2 text-ink-2 ${size === "lg" ? "text-[1.1875rem]" : "text-[1.0625rem]"}`}>{p.subtitle}</p>
    </div>
  );
}

export function ProjectFeature({ p, variant }: { p: Project; variant: Variant }) {
  const common = { id: `project-${p.slug}`, "aria-labelledby": `project-${p.slug}-title` };

  if (variant === "wide") {
    return (
      <article {...common} className="reveal scroll-mt-24 py-14 md:py-16">
        <ProjectVisual project={p} />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <Meta p={p} />
            <Title p={p} />
            <p className="measure text-pretty text-ink">{p.summary}</p>
            <Result p={p} />
            <Actions p={p} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-6 lg:pl-6">
            <Highlights items={p.highlights} />
            <Facts p={p} />
            <Tags items={p.stack} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "split-left" || variant === "split-right") {
    const visualFirst = variant === "split-left";
    return (
      <article {...common} className="reveal scroll-mt-24 py-14 md:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={`lg:sticky lg:top-24 lg:col-span-7 ${visualFirst ? "" : "lg:order-2"}`}>
            <ProjectVisual project={p} />
          </div>
          <div className={`flex flex-col gap-6 lg:col-span-5 ${visualFirst ? "" : "lg:order-1"}`}>
            <Meta p={p} />
            <Title p={p} />
            <p className="text-pretty text-ink">{p.summary}</p>
            <Result p={p} />
            <Highlights items={p.highlights} />
            <Facts p={p} />
            <Tags items={p.stack} />
            <Actions p={p} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "pair") {
    return (
      <article {...common} className="reveal flex scroll-mt-24 flex-col gap-6">
        <ProjectVisual project={p} />
        <Meta p={p} />
        <Title p={p} size="md" />
        <p className="text-pretty text-ink">{p.summary}</p>
        <Result p={p} />
        {p.disclaimer ? <p className="border-l-2 border-ink pl-3 text-[0.875rem] leading-relaxed text-ink-2">{p.disclaimer}</p> : null}
        <Highlights items={p.highlights} />
        <Tags items={p.stack} />
        <div className="mt-auto pt-2">
          <Actions p={p} compact />
        </div>
      </article>
    );
  }

  return (
    <article {...common} className="reveal scroll-mt-24 py-12">
      <div className="grid grid-cols-1 items-start gap-8 rounded-md border border-rule p-5 sm:p-7 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Meta p={p} />
          <Title p={p} size="md" />
          <p className="text-pretty text-ink">{p.summary}</p>
          <Result p={p} />
          <Highlights items={p.highlights} />
          <Tags items={p.stack} />
          <Actions p={p} compact />
        </div>
        <div className="lg:col-span-5">
          <ProjectVisual project={p} />
        </div>
      </div>
    </article>
  );
}

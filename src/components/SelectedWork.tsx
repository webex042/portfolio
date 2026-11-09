import Link from "next/link";
import { featuredProjects, projects } from "@/data/portfolio";
import { ProjectFeature, type Variant } from "./ProjectFeature";

const VARIANTS: Record<string, Variant> = {
  tessera: "wide",
  epm: "split-left",
  psyprep: "split-right",
  "deep-forge": "split-left",
};

/** The homepage centrepiece: six projects in deliberately different compositions. */
export function SelectedWork() {
  const large = featuredProjects.filter((p) => VARIANTS[p.slug]);
  const pair = featuredProjects.filter((p) => !VARIANTS[p.slug]);

  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-rule pt-20 md:pt-28">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 id="work-title" className="display text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)] lg:col-span-7">
            Selected work
          </h2>
          <div className="flex flex-col justify-end gap-4 lg:col-span-5">
            <p className="text-pretty text-ink-2">
              Six of the seven projects on my GitHub, each read end to end for this site: README, source, tests and, where there is one, the live deployment. Every number below comes from the repository.
            </p>
            <Link href="/projects" className="link self-start text-[0.96875rem]">
              See all {projects.length} projects in the index
            </Link>
          </div>
        </div>

        <div className="mt-10 divide-y divide-rule border-t border-ink">
          {large.map((p) => (
            <ProjectFeature key={p.slug} p={p} variant={VARIANTS[p.slug]} />
          ))}
          <div className="grid grid-cols-1 gap-16 py-14 md:py-16 lg:grid-cols-2 lg:gap-12">
            {pair.map((p) => (
              <ProjectFeature key={p.slug} p={p} variant="pair" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

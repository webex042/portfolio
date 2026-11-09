import type { Metadata } from "next";
import Link from "next/link";
import { getProject, notes } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Engineering log",
  description: "Working notes on the engineering behind Pranshu Ranjan's projects, each separating what the repository documents from analysis.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="wrap relative pb-14 pt-12 md:pt-16">
          <h1 className="display text-[clamp(3rem,1.8rem+5vw,6.5rem)]">Engineering log</h1>
          <p className="lead mt-6 max-w-[56ch]">
            Working notes on decisions inside my projects. Each one separates what the repository documents, with links to the files, from my analysis of it. They&rsquo;re undated because they were written for this site, not published before it.
          </p>
        </div>
      </header>
      <section className="wrap py-14 md:py-20" aria-label="Notes">
        <ol className="border-t border-ink">
          {notes.map((n) => {
            const p = getProject(n.project);
            return (
              <li key={n.slug} className="group relative grid grid-cols-1 gap-3 border-b border-rule py-8 md:grid-cols-12 md:gap-6">
                <p className="meta md:col-span-3 md:pt-1.5">
                  {p ? p.name : ""}
                  <span className="block">{n.topics.join(", ")}</span>
                </p>
                <div className="md:col-span-9">
                  <h2 className="heading text-[clamp(1.375rem,1.15rem+0.8vw,1.875rem)]">
                    <Link href={`/notes/${n.slug}`} className="after:absolute after:inset-0 group-hover:text-cobalt">
                      {n.title}
                    </Link>
                  </h2>
                  <p className="mt-2 max-w-[60ch] text-ink-2">{n.summary}</p>
                  <p className="meta mt-3">
                    {n.sections.filter((s) => s.kind === "documented").length} documented,{" "}
                    {n.sections.filter((s) => s.kind === "analysis").length} analysis sections
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

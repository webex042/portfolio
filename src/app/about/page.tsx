import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award } from "lucide-react";
import { about, achievements, education, getProject, profile } from "@/data/portfolio";
import { BrandIcon } from "@/components/BrandIcon";
import { EducationTimeline } from "@/components/EducationAchievements";
import { ResumeButton } from "@/components/ResumeButton";
import { resumeHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "How Pranshu Ranjan approaches engineering: building to understand, research that ships, and security from the start. Education, coursework, certification and interests.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const resume = resumeHref();
  return (
    <>
      <header className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="wrap relative grid grid-cols-1 gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="display text-[clamp(3rem,1.8rem+5vw,6.5rem)]">About</h1>
            <p className="mt-8 max-w-[34ch] text-[clamp(1.375rem,1.15rem+0.9vw,2rem)] font-[560] leading-snug [font-stretch:108%] text-pretty">{about.lead}</p>
          </div>
          <div className="plate relative mx-auto w-full max-w-[16rem] self-end bg-surface p-2 ring-1 ring-rule lg:col-span-3 lg:col-start-10 lg:mx-0">
            <Image src={profile.portrait.src} width={profile.portrait.width} height={profile.portrait.height} alt={profile.portrait.alt} sizes="16rem" className="block h-auto w-full" />
          </div>
        </div>
      </header>

      <section aria-label="How I work" className="wrap py-16 md:py-24">
        <ol className="grid grid-cols-1 border-t border-ink lg:grid-cols-3">
          {about.ideas.map((idea, i) => (
            <li key={idea.title} className={`reveal flex flex-col gap-4 border-b border-rule py-8 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i < 2 ? "lg:pr-8" : ""}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="meta tabular">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="heading text-[1.625rem]">{idea.title}</h2>
              <p className="text-ink-2 text-pretty">{idea.text}</p>
              <p className="meta mt-auto pt-2">
                See{" "}
                {idea.evidence.map((slug, j) => {
                  const pr = getProject(slug)!;
                  return (
                    <span key={slug}>
                      {j > 0 ? " and " : ""}
                      <Link href={`/projects/${slug}`} className="link">
                        {pr.name}
                      </Link>
                    </span>
                  );
                })}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="edu-h" className="border-t border-rule py-16 md:py-24">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 id="edu-h" className="heading text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">Education</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:col-span-9">
            <div>
              <p className="text-[1.25rem] font-[620] [font-stretch:108%]">{education.institution}</p>
              <p className="mt-1 text-ink-2">{education.degree}</p>
              <p className="meta mt-3">
                {education.period}, CGPA {education.cgpa}
              </p>
              <h3 className="mt-8 text-[0.9375rem] font-[600]">Relevant coursework</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <li key={c} className="tag">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="sr-only">Timeline</h3>
              <EducationTimeline />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-h" className="border-t border-rule py-16 md:py-24">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2 id="more-h" className="heading text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">Beyond the projects</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:col-span-9">
            <div>
              <h3 className="text-[0.9375rem] font-[600]">Technical interests</h3>
              <ul className="mt-4 flex flex-col border-t border-rule">
                {about.interests.map((x) => (
                  <li key={x} className="border-b border-rule py-2.5 text-ink-2">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-[600]">Certification and practice</h3>
              <ul className="mt-4 flex flex-col gap-5 border-t border-rule pt-4">
                {achievements.map((a) => (
                  <li key={a.title} className="flex gap-3.5">
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md border border-rule-strong text-ink-2">
                      {a.icon ? <BrandIcon name={a.icon} size={16} /> : <Award size={16} strokeWidth={1.75} />}
                    </span>
                    <div>
                      <p className="font-[600] leading-snug">{a.title}</p>
                      <p className="meta mt-0.5">
                        {"issuer" in a && a.issuer ? `${a.issuer}, ` : ""}
                        {a.date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-2.5">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                  <BrandIcon name="github" size={16} />
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                  <BrandIcon name="linkedin" size={15} />
                  LinkedIn
                </a>
                <ResumeButton href={resume} variant="ink" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

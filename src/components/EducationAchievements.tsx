import { Award } from "lucide-react";
import { achievements, education } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { Section } from "./Section";

export const timeline = [
  { when: "2024", title: "Started B.Tech in Computer Science and Engineering", where: "Birla Institute of Technology, Mesra" },
  { when: "Aug 2026", title: "Agentic AI Certified Foundations Associate", where: "Oracle University" },
  { when: "2028", title: "Expected graduation", where: "Birla Institute of Technology, Mesra" },
];

export function EducationTimeline() {
  return (
    <ol className="relative ml-1.5 border-l border-rule-strong">
      {timeline.map((t) => (
        <li key={t.title} className="relative pb-7 pl-6 last:pb-0">
          <span aria-hidden className="absolute -left-[5px] top-[0.45rem] size-[9px] rounded-full border border-ink bg-paper" />
          <p className="meta tabular">{t.when}</p>
          <p className="mt-1 font-[580] leading-snug text-ink">{t.title}</p>
          <p className="text-[0.9375rem] text-ink-3">{t.where}</p>
        </li>
      ))}
    </ol>
  );
}

export function EducationAchievements() {
  return (
    <Section id="education" title="Education" note="Degree, coursework, certification and problem-solving practice.">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-9 md:gap-8">
        <div className="reveal md:col-span-5">
          <div className="border-t border-ink pt-5">
            <h3 className="heading text-[1.5rem]">{education.institution}</h3>
            <p className="mt-1.5 text-ink-2">{education.degree}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <dt className="meta">Period</dt>
                <dd className="mt-0.5 text-[1.125rem] font-[600] tabular">{education.period}</dd>
              </div>
              <div>
                <dt className="meta">CGPA</dt>
                <dd className="mt-0.5 text-[1.125rem] font-[600] tabular">{education.cgpa}</dd>
              </div>
            </dl>
            <h4 className="mt-7 text-[0.9375rem] font-[600]">Relevant coursework</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <li key={c} className="tag">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="reveal md:col-span-4" style={{ transitionDelay: "80ms" }}>
          <h3 className="sr-only">Timeline</h3>
          <EducationTimeline />
        </div>
      </div>

      <div id="achievements" className="mt-16 scroll-mt-28">
        <h3 className="heading text-[1.5rem]">Achievements and certification</h3>
        <ul className="mt-5 grid grid-cols-1 border-t border-ink md:grid-cols-2">
          {achievements.map((a, i) => (
            <li key={a.title} className={`reveal flex gap-4 border-b border-rule py-6 ${i === 1 ? "md:border-l md:pl-6" : "md:pr-6"}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <span aria-hidden className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-md border border-rule-strong text-ink-2">
                {a.icon ? <BrandIcon name={a.icon} size={18} /> : <Award size={18} strokeWidth={1.75} />}
              </span>
              <div>
                <p className="meta">
                  {a.kind}, {a.date}
                </p>
                <p className="mt-1 text-[1.0625rem] font-[620] leading-snug [font-stretch:106%]">{a.title}</p>
                {"issuer" in a && a.issuer ? <p className="text-[0.9375rem] text-ink-2">{a.issuer}</p> : null}
                <p className="mt-1.5 text-[0.9375rem] text-ink-3">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

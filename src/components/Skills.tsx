import { skillGroups, tools } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { Section } from "./Section";
import { ToolsTicker } from "./ToolsTicker";

export function Skills() {
  return (
    <Section id="skills" title="Tools I build with" note="Only tools used in my repositories or listed on my resume. No percentages: the projects are the evidence.">
      <ToolsTicker tools={tools} />
      <h3 className="mt-14 text-[0.9375rem] font-[600]">Skills by area</h3>
      <div className="mt-4 border-t border-ink">
        {skillGroups.map((g) => (
          <div key={g.title} className="grid grid-cols-1 gap-4 border-b border-rule py-6 md:grid-cols-9 md:gap-8">
            <div className="md:col-span-3">
              <h4 className="text-[1.0625rem] font-[620] [font-stretch:108%]">{g.title}</h4>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-3 text-pretty">{g.summary}</p>
            </div>
            <ul className="flex flex-wrap content-start gap-x-2 gap-y-2.5 md:col-span-6">
              {g.skills.map((s) => (
                <li
                  key={s.name}
                  className="inline-flex items-center gap-2 rounded-md border border-rule bg-surface px-3 py-2 text-[0.9375rem] leading-none text-ink"
                >
                  {s.icon ? (
                    <BrandIcon name={s.icon} size={15} className="text-ink-2" />
                  ) : (
                    <span aria-hidden className="size-[6px] rounded-full border border-ink-3" />
                  )}
                  {s.name}
                  {s.note ? <span className="meta !text-[0.75rem]">{s.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

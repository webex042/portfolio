import { specialisations } from "@/data/portfolio";
import { Section } from "./Section";

export function Specialisations() {
  return (
    <Section id="focus" title="What I work on" note="Six areas, each backed by projects you can open below.">
      <ol className="grid grid-cols-1 border-t border-ink sm:grid-cols-2 xl:grid-cols-3">
        {specialisations.map((s, i) => (
          <li
            key={s.id}
            className="reveal group relative flex flex-col border-b border-rule py-7 transition-colors sm:px-6 sm:[&:nth-child(2n+1)]:pl-0 xl:[&:nth-child(2n+1)]:pl-6 xl:[&:nth-child(3n+1)]:pl-0 sm:[&:nth-child(2n)]:border-l xl:[&:nth-child(2n)]:border-l-0 xl:[&:not(:nth-child(3n+1))]:border-l"
            style={{ transitionDelay: `${(i % 3) * 70}ms` }}
          >
            <span className="meta tabular transition-colors group-hover:text-cobalt">{s.id}</span>
            <h3 className="mt-3 text-[1.25rem] font-[630] leading-tight [font-stretch:112%]">{s.title}</h3>
            <p className="mt-2.5 text-[0.96875rem] leading-relaxed text-ink-2 text-pretty">{s.text}</p>
            <p className="meta mt-auto pt-5">
              <span className="text-ink-3">Seen in </span>
              <span className="text-ink-2">{s.label}</span>
            </p>
            <span aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-cobalt transition-transform duration-300 group-hover:scale-x-100" />
          </li>
        ))}
      </ol>
    </Section>
  );
}

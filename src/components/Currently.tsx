import Link from "next/link";
import { currently } from "@/data/portfolio";
import { Section } from "./Section";

export function Currently() {
  return (
    <Section id="currently" title="Currently" note="Only what the repositories and my resume support.">
      <dl className="border-t border-ink">
        {currently.map((c) => (
          <div key={c.label} className="reveal grid grid-cols-1 gap-1.5 border-b border-rule py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
            <dt className="text-[0.9375rem] font-[620] [font-stretch:110%]">{c.label}</dt>
            <dd className="text-pretty text-ink-2">
              {c.text}
              {c.href ? (
                <>
                  {" "}
                  <Link href={c.href} className="link whitespace-nowrap">
                    {c.linkText}
                  </Link>
                </>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

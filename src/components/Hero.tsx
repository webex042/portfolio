import Image from "next/image";
import { Mail } from "lucide-react";
import { profile } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { ResumeButton } from "./ResumeButton";

export function Hero({ resumeHref }: { resumeHref: string | null }) {
  return (
    <section id="top" aria-labelledby="hero-name" className="relative overflow-hidden">
      <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />

      <div className="wrap relative grid grid-cols-1 gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-7 lg:pr-6">
          <p className="hero-in text-[1rem] text-ink-2 [animation-delay:40ms] md:text-[1.0625rem]">
            Computer Science undergraduate at BIT Mesra. AI/ML, software engineering and application security.
          </p>

          <h1
            id="hero-name"
            className="hero-in display mt-5 text-[clamp(3.25rem,1.6rem+7.4vw,7.75rem)] [animation-delay:90ms]"
          >
            Pranshu
            <br />
            Ranjan
          </h1>

          <p className="hero-in heading mt-8 max-w-[22ch] text-[clamp(1.5rem,1.15rem+1.4vw,2.25rem)] text-ink [animation-delay:160ms]">
            {profile.headline}
          </p>

          <p className="hero-in lead measure mt-6 text-pretty [animation-delay:220ms]">{profile.intro}</p>

          <div className="hero-in mt-9 flex flex-wrap gap-3 [animation-delay:280ms]">
            <a href="/#work" className="btn btn-primary">
              Explore my work
            </a>
            <ResumeButton href={resumeHref} variant="ink" />
            <a href="/#contact" className="btn btn-line">
              <Mail size={16} strokeWidth={1.75} aria-hidden />
              Get in touch
            </a>
          </div>

          <ul className="hero-in mt-8 flex flex-wrap gap-x-6 gap-y-3 [animation-delay:320ms]" aria-label="Profiles">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 text-ink-2 transition-colors hover:text-ink">
                <BrandIcon name="github" size={18} />
                <span className="meta !text-inherit underline decoration-rule-strong underline-offset-4 group-hover:decoration-ink">github.com/{profile.githubHandle}</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 text-ink-2 transition-colors hover:text-ink">
                <BrandIcon name="linkedin" size={17} />
                <span className="meta !text-inherit underline decoration-rule-strong underline-offset-4 group-hover:decoration-ink">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        <figure className="hero-in relative mx-auto w-full max-w-[24rem] [animation-delay:200ms] lg:col-span-5 lg:mx-0 lg:ml-auto lg:mt-2 lg:max-w-[26rem]">
          <div className="plate relative bg-surface p-2.5 ring-1 ring-rule">
            <Image
              src={profile.portrait.src}
              width={profile.portrait.width}
              height={profile.portrait.height}
              alt={profile.portrait.alt}
              priority
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 92vw"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-5">
            <dl className="grid grid-cols-2 border-t border-ink text-[0.875rem]">
              {[
                ["Study", "B.Tech CSE, 2024–28"],
                ["Institute", "BIT Mesra"],
                ["CGPA", "7.6 / 10"],
                ["Based in", "Ranchi, India"],
                ["Focus", "AI security, LLM systems, ML"],
                ["Index", "7 public projects"],
              ].map(([k, v], i) => (
                <div key={k} className={`border-b border-rule py-2.5 ${i % 2 === 0 ? "pr-3" : "border-l pl-3"}`}>
                  <dt className="meta !text-[0.75rem]">{k}</dt>
                  <dd className="mt-0.5 leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </figcaption>
        </figure>
      </div>

    </section>
  );
}

import { Phone } from "lucide-react";
import { profile } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { ContactForm } from "./ContactForm";
import { CopyButton } from "./CopyButton";
import { ResumeButton } from "./ResumeButton";

export function Contact({ resumeHref }: { resumeHref: string | null }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-ink bg-surface py-20 md:py-28">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="display max-w-[12ch] text-[clamp(2.5rem,1.7rem+3.2vw,4.5rem)] text-balance">
            Have an interesting problem to solve?
          </h2>
          <p className="lead mt-6 max-w-[40ch]">
            I&rsquo;m looking for software engineering, AI/ML and backend internships, and I&rsquo;m always happy to talk about local AI, LLM security or a gnarly evaluation question.
          </p>

          <ul className="mt-10 border-t border-rule">
            <li className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
              <div className="min-w-0">
                <p className="meta">Email</p>
                <a href={`mailto:${profile.email}`} className="link break-all text-[1.0625rem]">
                  {profile.email}
                </a>
              </div>
              <CopyButton value={profile.email} label="Copy email address" />
            </li>
            <li className="border-b border-rule py-4">
              <p className="meta">Phone</p>
              <a href={profile.phoneHref} className="link inline-flex items-center gap-2 text-[1.0625rem]">
                <Phone size={15} strokeWidth={1.75} aria-hidden />
                {profile.phone}
              </a>
            </li>
            <li className="grid grid-cols-2 border-b border-rule">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 py-4 text-ink-2 hover:text-ink">
                <BrandIcon name="linkedin" size={17} />
                <span className="underline decoration-rule-strong underline-offset-4 group-hover:decoration-ink">LinkedIn</span>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 border-l border-rule py-4 pl-4 text-ink-2 hover:text-ink">
                <BrandIcon name="github" size={17} />
                <span className="underline decoration-rule-strong underline-offset-4 group-hover:decoration-ink">GitHub</span>
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <ResumeButton href={resumeHref} variant="ink" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="heading text-[1.375rem]">Write to me</h3>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

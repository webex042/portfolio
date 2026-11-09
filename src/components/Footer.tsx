import Link from "next/link";
import { profile } from "@/data/portfolio";
import { BrandIcon } from "./BrandIcon";
import { Year } from "./Year";

const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/notes", label: "Engineering log" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap grid grid-cols-1 gap-10 py-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-[1.25rem] font-[640] [font-stretch:118%]">{profile.name}</p>
          <p className="mt-2 max-w-[38ch] text-[0.9375rem] text-ink-2">{profile.headline}</p>
          <div className="mt-5 flex gap-2">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="grid size-10 place-items-center rounded-md border border-rule-strong text-ink-2 hover:border-ink hover:text-ink">
              <BrandIcon name="github" size={17} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="grid size-10 place-items-center rounded-md border border-rule-strong text-ink-2 hover:border-ink hover:text-ink">
              <BrandIcon name="linkedin" size={16} />
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-[0.9375rem] text-ink-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3 md:text-right">
          <p className="meta">
            © <Year /> {profile.name}
          </p>
          <p className="meta mt-1">Built with Next.js. Content checked against each repository.</p>
        </div>
      </div>
    </footer>
  );
}

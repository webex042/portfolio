import type { PaletteItem } from "@/components/CommandPalette";
import { notes, profile, projects } from "@/data/portfolio";

export function paletteItems(resumeHref: string | null): PaletteItem[] {
  return [
    ...projects.map((p) => ({
      id: `p-${p.slug}`,
      group: "Projects" as const,
      label: p.title,
      hint: p.subtitle,
      href: `/projects/${p.slug}`,
      keywords: `${p.categories.join(" ")} ${p.stack.join(" ")}`,
    })),
    { id: "pg-home", group: "Pages", label: "Home", href: "/" },
    { id: "pg-projects", group: "Pages", label: "Project index", hint: "All projects with filters", href: "/projects", keywords: "work portfolio" },
    { id: "pg-about", group: "Pages", label: "About", hint: "Story, education timeline, interests", href: "/about" },
    { id: "pg-notes", group: "Pages", label: "Engineering log", hint: "Notes written from repository evidence", href: "/notes", keywords: "blog dev log writing" },
    { id: "s-skills", group: "Sections", label: "Tools and skills", href: "/#skills", keywords: "stack technologies" },
    { id: "s-education", group: "Sections", label: "Education", href: "/#education", keywords: "bit mesra cgpa coursework" },
    { id: "s-achievements", group: "Sections", label: "Achievements and certification", href: "/#achievements", keywords: "leetcode oracle" },
    { id: "s-currently", group: "Sections", label: "Currently", href: "/#currently" },
    { id: "s-contact", group: "Sections", label: "Contact", href: "/#contact", keywords: "email hire" },
    ...notes.map((n) => ({
      id: `n-${n.slug}`,
      group: "Engineering log" as const,
      label: n.title,
      hint: n.summary,
      href: `/notes/${n.slug}`,
      keywords: n.topics.join(" "),
    })),
    { id: "l-email", group: "Links", label: `Email ${profile.email}`, href: `mailto:${profile.email}`, keywords: "contact mail" },
    resumeHref
      ? { id: "l-resume", group: "Links", label: "Download resume (PDF)", href: resumeHref, external: true, keywords: "cv" }
      : { id: "l-resume", group: "Links", label: "Request resume by email", href: `mailto:${profile.email}?subject=${encodeURIComponent("Resume request")}`, keywords: "cv" },
    { id: "l-github", group: "Links", label: "GitHub: webex042", href: profile.github, external: true, keywords: "code repositories" },
    { id: "l-linkedin", group: "Links", label: "LinkedIn", href: profile.linkedin, external: true },
  ];
}

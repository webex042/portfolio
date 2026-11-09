import { Hero } from "@/components/Hero";
import { Specialisations } from "@/components/Specialisations";
import { SelectedWork } from "@/components/SelectedWork";
import { Skills } from "@/components/Skills";
import { Currently } from "@/components/Currently";
import { EducationAchievements } from "@/components/EducationAchievements";
import { Contact } from "@/components/Contact";
import { education, profile } from "@/data/portfolio";
import { resumeHref, siteUrl } from "@/lib/site";

export default function HomePage() {
  const resume = resumeHref();
  const url = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url,
    image: `${url}${profile.portrait.src}`,
    email: `mailto:${profile.email}`,
    jobTitle: "Computer Science undergraduate",
    address: { "@type": "PostalAddress", addressLocality: "Ranchi", addressRegion: "Jharkhand", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: ["Machine learning", "LLM security", "Prompt injection", "Rust", "Python", "React", "Full-stack development"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero resumeHref={resume} />
      <Specialisations />
      <SelectedWork />
      <Skills />
      <Currently />
      <EducationAchievements />
      <Contact resumeHref={resume} />
    </>
  );
}

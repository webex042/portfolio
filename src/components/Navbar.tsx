"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";
import { ResumeButton } from "./ResumeButton";

export const navItems = [
  { href: "/projects", label: "Projects", match: "/projects" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/#skills", label: "Skills", section: "skills" },
  { href: "/#education", label: "Education", section: "education" },
  { href: "/#achievements", label: "Achievements", section: "achievements" },
  { href: "/notes", label: "Notes", match: "/notes" },
  { href: "/#contact", label: "Contact", section: "contact" },
] as { href: string; label: string; match?: string; section?: string }[];

export function Navbar({ resumeHref }: { resumeHref: string | null }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* On the home page, highlight the section crossing the upper third of the viewport. */
  useEffect(() => {
    if (!onHome) return;
    const ids = ["top", "focus", "work", "skills", "currently", "education", "achievements", "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) menuButton.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  useEffect(() => close(), [pathname, close]);

  const isActive = (item: (typeof navItems)[number]) =>
    item.match ? pathname.startsWith(item.match) : onHome && item.section === active;
  const openPalette = () => {
    setOpen(false);
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  };

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open ? "border-rule bg-paper/92 backdrop-blur-md" : "border-transparent bg-paper"
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="group flex items-center gap-3 rounded-sm" aria-label="Pranshu Ranjan, home">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-[5px] border border-ink text-[0.8125rem] font-[680] tracking-[0.02em] transition-colors [font-stretch:125%] group-hover:bg-ink group-hover:text-paper"
          >
            PR
          </span>
          <span className="hidden text-[0.96875rem] font-[580] [font-stretch:108%] sm:inline">Pranshu Ranjan</span>
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item) ? (item.match ? "page" : "true") : undefined}
                className={`relative rounded-md px-2.5 py-2 text-[0.9375rem] transition-colors ${
                  isActive(item) ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-2.5 -bottom-px h-px bg-cobalt transition-transform duration-200 origin-left ${
                    isActive(item) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 text-ink-2 transition-colors hover:bg-surface hover:text-ink"
            aria-label="Search the site (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <Search size={17} strokeWidth={1.75} aria-hidden />
            <kbd className="meta hidden rounded border border-rule px-1.5 !text-[0.6875rem] md:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <ResumeButton href={resumeHref} variant="ink" size="sm" className="hidden sm:inline-flex" />
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.75} aria-hidden /> : <Menu size={22} strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </nav>

    </header>
      {open ? (
          <div
            id="mobile-menu"
            className="menu-in fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-rule bg-paper xl:hidden"
          >
            <ul className="wrap flex flex-col py-4">
              {[{ href: "/", label: "Home" } as (typeof navItems)[number], ...navItems].map((item) => (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    onClick={() => close()}
                    aria-current={item.href !== "/" && isActive(item) ? "true" : undefined}
                    className={`flex items-center justify-between py-4 text-[1.375rem] font-[600] [font-stretch:115%] ${
                      item.href !== "/" && isActive(item) ? "text-cobalt" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-6">
                <ResumeButton href={resumeHref} variant="ink" className="w-full" onClick={() => close()} />
              </li>
            </ul>
          </div>
        ) : null}
    </>
  );
}

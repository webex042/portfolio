"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage can be unavailable; the choice still applies for this visit */
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface hover:text-ink"
    >
      {/* Render both and let CSS pick, so the server markup matches either theme. */}
      <Sun size={18} strokeWidth={1.75} className="hidden dark:block" aria-hidden />
      <Moon size={18} strokeWidth={1.75} className="block dark:hidden" aria-hidden />
    </button>
  );
}

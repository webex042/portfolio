"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";

/**
 * A slow marquee of real tools. It pauses on hover and on keyboard focus, has
 * an explicit pause control (moving content needs one), and becomes a static
 * wrapped list for visitors who prefer reduced motion.
 */
export function ToolsTicker({ tools }: { tools: string[] }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul className="ticker-row flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {tools.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-5 text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] font-[560] text-ink [font-stretch:115%]">{t}</span>
          <span aria-hidden className="size-1.5 rotate-45 bg-rule-strong" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative">
      <div
        className="ticker group/ticker relative overflow-hidden border-y border-rule py-5 focus-visible:outline-offset-[-2px]"
        data-paused={paused || undefined}
        tabIndex={0}
        role="region"
        aria-label="Tools I build with, scrolling list. Hover or focus to pause."
      >
        <div className="ticker-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        className="ticker-toggle meta mt-3 inline-flex items-center gap-2 rounded-sm text-ink-2 hover:text-ink"
      >
        {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
        {paused ? "Resume scrolling" : "Pause scrolling"}
      </button>
    </div>
  );
}

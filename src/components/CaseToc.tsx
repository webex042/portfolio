"use client";

import { useEffect, useState } from "react";

export function CaseToc({ items }: { items: { id: string; n: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="meta mb-3">On this page</p>
      <ol className="flex flex-col border-l border-rule">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={`-ml-px flex gap-3 border-l py-1.5 pl-3.5 text-[0.875rem] transition-colors ${
                active === i.id ? "border-cobalt text-ink" : "border-transparent text-ink-3 hover:text-ink"
              }`}
            >
              <span className="font-mono text-[0.75rem] tabular leading-[1.55rem]">{i.n}</span>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

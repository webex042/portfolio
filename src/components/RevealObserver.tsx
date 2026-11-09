"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds .is-in to .reveal elements as they enter the viewport, once each. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    els.forEach((el) => io.observe(el));
    /* Anything already above the fold (e.g. after an anchor jump) shows at once. */
    const raf = requestAnimationFrame(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in");
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}

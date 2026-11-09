"use client";

import { useEffect, useState } from "react";

/** The copyright year, computed in the visitor's browser so it never goes stale. */
export function Year() {
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span suppressHydrationWarning>{year}</span>;
}

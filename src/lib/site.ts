import "server-only";
import fs from "node:fs";
import path from "node:path";
import { profile } from "@/data/portfolio";

/** Canonical origin: explicit env var, then Vercel's production domain, then localhost. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/**
 * The resume button only links to the PDF when the file actually ships in
 * /public. Checked at build time, so adding the file and redeploying is enough.
 */
export function resumeHref(): string | null {
  const file = path.join(process.cwd(), "public", profile.resumeFile);
  return fs.existsSync(file) ? `/${profile.resumeFile}` : null;
}

# Pranshu Ranjan — portfolio

Personal portfolio and project case studies. Next.js 16 (App Router), React 19,
TypeScript and Tailwind CSS 4, statically generated and ready for Vercel.

Every project claim on the site was checked against its GitHub repository
(README, docs, source, tests) and, where there is one, the live deployment.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # serves the built site on http://localhost:3000
npm run typecheck  # optional, after a dev run or build has generated next-env.d.ts
```

## Add your resume

Put the PDF at `public/Pranshu_Ranjan_Resume.pdf` and rebuild (or redeploy).
The site checks for the file at build time: while it's missing, every resume
button reads "Request resume" and opens an email to you instead of linking to a
file that doesn't exist.

## Deploy to Vercel

The project needs no `vercel.json`; Vercel detects Next.js automatically.

1. Push this folder to a GitHub repository (or run `npx vercel` from this folder).
2. In Vercel, **Add New → Project**, import the repository, keep the defaults
   (Framework: Next.js, Build: `npm run build`), and deploy.
3. Optional: if you use a custom domain, set `NEXT_PUBLIC_SITE_URL` (see
   `.env.example`) so canonical links, the sitemap and social previews use it.
   Without it the site uses Vercel's production domain automatically.

Security headers (including a Content-Security-Policy) are set in `next.config.ts`.

## Edit the content

All text lives in typed data files; components only render it.

| File | What it holds |
|---|---|
| `src/data/portfolio.ts` | Profile, About story, specialisations, Currently, skills, tools, education, achievements |
| `src/data/projects.ts` | The seven case studies: summary, architecture, stack table, features, decisions, security, testing, challenges, results, learnings, links |
| `src/data/notes.ts` | Engineering log entries, each split into "documented" and "analysis" sections |
| `src/data/icons.ts` | Brand glyph paths (from simple-icons, CC0) |

Adding a project: add an entry to `projects` in `src/data/projects.ts` (and to
`stackMap.uses` for the stack map). Its case study page, index row, command
palette entry and sitemap entry are generated from that.

## Structure

```
src/
  app/                 routes: /, /projects, /projects/[slug], /about, /notes, /notes/[slug]
                       plus sitemap.ts, robots.ts, icon.svg, apple-icon.png, not-found.tsx
  components/          sections, navigation, command palette (Ctrl/Cmd+K), contact form
  components/visuals/  project diagrams, the EPM chart (real data), the search demo
  data/                all site content
  lib/                 site URL and resume detection, palette items, search demo engine
  fonts/               Archivo (variable) and Fragment Mono, self-hosted
public/
  images/              portrait and project screenshots/figures
  og.png               social preview image
```

## Notes

- Screenshots of PsyPrep and DEEP FORGE were captured from local builds of
  their repositories; charts and figures for EPM, Coffee Line and Tessera are
  the ones generated in those repositories. The EPM chart is drawn from the
  numbers in the Stage 13 report.
- The contact form has no backend: it validates input, then opens the visitor's
  email app with the message addressed to you.
- Motion is CSS-only and respects reduced-motion settings.

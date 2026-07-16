@AGENTS.md

# CityPulse — working guide for Claude Code

CityPulse is a map-first neighborhood companion for Chicago. The **what and why** live in [SPEC.md](SPEC.md) (source of truth); the **when and in-what-order** in [PLAN.md](PLAN.md); feasibility findings and verified source/data facts in [NOTES.md](NOTES.md). Read SPEC.md before making product decisions — if a build choice contradicts it, the build choice is wrong or SPEC needs a deliberate edit.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, `src/` dir, import alias `@/*`.
- **Tailwind CSS v4** (config-less; `@tailwindcss/postcss`).
- **Map:** MapLibre GL + free OSM-based tiles. No Mapbox/Google billing. (Added in Phase 1.)
- **Runtime LLM:** Google Gemini free tier, with a fallback free provider TBD. Deliberately a different model family than the tool building this.
- **Pipeline:** nightly GitHub Action (free for public repos) → scrape → extract/normalize with Gemini → generate briefs/facts → **commit JSON to the repo**.
- **Hosting:** Vercel free tier (static + a single rate-limited serverless function for the on-demand research action).
- **Evals:** promptfoo (Phase 4).

⚠️ **This is not the Next.js in your training data** (see [AGENTS.md](AGENTS.md)). Before writing app code, read the relevant guide under `node_modules/next/dist/docs/` (`01-app` for App Router) and heed deprecation notices.

## Folder structure

```
src/app/          Next.js App Router (layout.tsx, page.tsx, globals.css)
src/components/    React components (e.g. the map + side panel)
src/lib/           Shared helpers + config (e.g. curated neighborhood list)
data/             Pipeline-built JSON imported at build (servings, briefs, facts — added Phase 2)
public/           Static assets, incl. static geodata served to the client
                  (public/data/neighborhoods.geojson → fetched at /data/neighborhoods.geojson)
prompts/          Versioned LLM prompts + notes on why each revision changed (portfolio evidence)
SPEC.md PLAN.md NOTES.md   Product spec, build plan, feasibility notes
.env.example      Env var template; copy to .env (gitignored) for local runs
```

Pipeline/scraper code and the evals suite get their own top-level folders when Phase 2/4 introduce them (keep each source's scraper small and isolated so one breaking never takes down the pipeline).

## Ground rules

1. **No hardcoded keys or secrets, ever.** Read from environment variables (`process.env.GEMINI_API_KEY`, etc.). Real values live only in: GitHub Actions secrets (CI), a local gitignored `.env` (dev), and the Vercel dashboard (runtime). `.env*` is gitignored except `.env.example`. See [NOTES.md](NOTES.md) for what's set up.
2. **The app reads pre-built JSON from `data/`.** No database, no paid server, no live scraping at request time. The nightly pipeline produces the JSON and commits it; the app is a static reader. The one exception is the rate-limited on-demand "research this for me" serverless function.
3. **Respect source terms.** Consume Block Club via its RSS feed only (their robots.txt blocks AI crawlers); prefer Choose Chicago's public events API and the City of Chicago open-data API over scraping; Do312 needs a browser-like UA and polite pacing. **Do not use Time Out or Secret Chicago** — their terms forbid AI/aggregation use. Rationale and ranking in [NOTES.md §1](NOTES.md).
4. **Facts must be grounded.** Did-you-know and briefs cite real sources; never generated from model memory alone.
5. **Zero dollars is a hard constraint.** Free tiers only; never enter a credit card. If a free tier pinches, pre-generate more and do less live — never enable billing (enabling billing on the Gemini project deletes its free tier).
6. **Session rhythm:** start by reading PLAN.md, pick the next unchecked box, end with a commit and a deployed change. Small sessions beat marathons.

## Commands

```
npm run dev      # local dev server
npm run build    # production build (run before assuming a change is safe)
npm run lint     # eslint
```

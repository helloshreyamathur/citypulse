# CityPulse — Build Plan (v1)

Status: draft for review
Companion to: SPEC.md (the what and why; this file is the when and in-what-order)
Timeline: 10–12 days, flexible
Builder profile: product designer, first build, directing at feature level with Claude Code

How to read this: each phase ends with something you can see and react to. Nothing in a later phase blocks you from stopping, showing, or shipping what exists at the end of an earlier one. Checkboxes get ticked as we go; this file is allowed to change.

---

## Phase 0 — Foundations and feasibility (Day 1)

The goal is an empty but real product, plus reality-checking the assumptions everything else sits on.

Feasibility spike (do this first, ~half a day):

- [ ] Check each of the six sources for scrapeability: robots.txt, terms, page structure. Rank friendliest to hardest; find an alternate for any that says no.
- [ ] Verify Reddit access on a free tier for reading/searching threads; if it's blocked or too limited, decide the fallback for the chatter feature now, not in Phase 3
- [ ] Confirm current Gemini free-tier limits and pick the fallback provider
- [ ] Download the Chicago neighborhood boundaries GeoJSON and confirm all 15 curated neighborhoods exist with sane borders
- [ ] Write findings as a short NOTES.md in the repo (also portfolio evidence: this is what real technical diligence looks like)

Setup:

- [ ] Create public GitHub repo (`citypulse`)
- [ ] Install and set up Claude Code locally
- [ ] Scaffold the app (Next.js) and push the first commit
- [ ] Connect Vercel; empty app live at a real URL
- [ ] Write CLAUDE.md v1: stack, folder structure, ground rules (no hardcoded keys, all app data reads from `/data` JSON, reference SPEC.md)
- [ ] Create `prompts/` folder with a README stub

You'll see: a live URL with a placeholder page. Feels like nothing; it's the hardest 20% of first-time setup done.

What you learn: repo, commit, deploy loop. Every later phase reuses this loop.

## Phase 1 — The map spine (Days 2–3)

The goal is the product's skeleton with placeholder data, ready for your first design crit.

- [ ] Load Chicago neighborhood boundaries (GeoJSON from the Chicago Data Portal's neighborhood boundaries dataset, not the 77 community areas; the neighborhood set matches names like Wicker Park and Wrigleyville far better)
- [ ] Map renders full-bleed with MapLibre + free OSM-based tiles, taking ~2/3 of the layout
- [ ] 15 curated neighborhoods highlighted and clickable; all others visible, styled quieter, labeled "coming soon" on tap
- [ ] Side panel: neighborhood name, placeholder daily serving (hand-written fake items), placeholder did-you-know
- [ ] First-visit home neighborhood picker; choice saved in the browser; returning visits land there
- [ ] Zoom behavior: neighborhood → surrounding areas → whole city

You'll see: CityPulse with fake data. This is the design crit moment.

Your job this phase: react to the screen like a design review, and deliver the identity brief (Figma frame). At the end of the crit we freeze tokens and write the design-system skill, which governs all UI from here on.

Known risk: neighborhood boundary polygons sometimes disagree with local intuition (e.g. where Bucktown ends). We adjust polygons by hand where it matters; 30 minutes, not a rabbit hole.

## Phase 2 — The pipeline, first real data (Days 4–6)

The goal is the nightly agent that turns messy web pages into the daily serving. This is the heart of the AI story.

- [ ] Define the item schema: title, date/time, location, neighborhood, category, price, source URL, intimacy tier (big event vs small happening)
- [ ] Scrapers for the 3 friendliest sources first (likely Do312, Block Club, Choose Chicago; we verify which are scraping-friendly on day 4)
- [ ] Gemini extraction step: raw page → clean schema JSON (get a free API key; verify current free-tier limits; pick a fallback provider)
- [ ] Serving builder: per neighborhood, select up to 10 items, honest shrink on quiet days, evergreen garnish + "check out [nearby neighborhood]" nudge
- [ ] Run the whole thing manually first; when it works, schedule it as a nightly GitHub Action that commits fresh JSON
- [ ] Map and panel now read real data; fake data deleted

You'll see: real Chicago happenings on the map, refreshed nightly without anyone touching it.

Your job this phase: sanity-check the servings like an editor. Is this actually what's happening in Logan Square? Are the intimate items showing up or only the big stuff? Your judgment tunes the pipeline.

Known risk: scrapers are the most fragile part of the product. We keep each source's scraper small and isolated so one breaking never takes down the pipeline.

## Phase 3 — Intelligence (Days 7–8)

The goal is the context layer that makes CityPulse more than a listings site.

- [ ] Nightly context briefs per happening: what to expect, practical details, sourced from the event page and related coverage
- [ ] Reddit chatter: nightly summaries where relevant threads exist, with links out to the top 5–6 real threads; older threads allowed for annual events
- [ ] Did-you-know generator: fact per neighborhood, grounded in citable sources, citation or read-more link required, rotates every 2–3 days
- [ ] The live "research this for me" action: one serverless function, visibly assembles a brief on demand, rate-limited to stay inside free tiers
- [ ] Empty and quiet states written in product voice (you write or approve these)

You'll see: the tap-into-an-event moment from the Sunday scenario working end to end, including the live research beat that anchors the demo.

## Phase 4 — Evals (Days 8–9, overlapping Phase 3)

The goal is turning "the extraction mostly works" into "the extraction is measured," and producing the portfolio artifact.

- [ ] Build a labeled test set: ~50 real event pages with hand-verified correct answers (date, location, price, neighborhood)
- [ ] promptfoo config scoring the extraction prompt against the set
- [ ] Iterate the prompt until the score stops embarrassing us; keep every version in `prompts/` with a one-line note on what changed and why
- [ ] Short EVALS.md: method, scores before/after, what you learned

You'll see: a number that goes up as the prompt improves. This is also where "I've written evals" becomes literally true.

Labeling 50 pages is tedious and split-able: you label while Claude Code builds Phase 3. It's also secretly useful, since hand-reading 50 event pages makes you the domain expert on how messy the data is.

## Phase 5 — Depth and polish (Days 10–11)

The goal is coverage and craft.

- [ ] Remaining sources from the spec (Time Out, Secret Chicago, City of Chicago)
- [ ] Venue watchlists: 5–10 handpicked venue/park sources per curated neighborhood for the intimate content (you pick the venues; you know what a neighborhood's real spots are)
- [ ] Favorites (save places like Millennium Park, browser-stored)
- [ ] Design pass against the skill: spacing, type, map style tuning to the identity brief
- [ ] Not-broken-on-mobile pass
- [ ] Performance and loading states

You'll see: the product at full intended depth for all 15 neighborhoods.

## Phase 6 — The portfolio layer (Day 12)

The goal is making the work legible to a hiring manager.

- [ ] README: what CityPulse is, screenshot, live link, and the how-it-was-built story (pipeline, evals, design-system skill, CLAUDE.md workflow)
- [ ] Clean Action logs and repo tidy-up (a hiring manager will click around)
- [ ] Demo script: the three-minute path from SPEC.md, verified to work start to finish
- [ ] Portfolio page copy (you write, I edit or vice versa)

---

## Standing decisions and rhythms

Working rhythm: each session starts by reading PLAN.md, picking the next unchecked box, and ends with a commit and a deployed change you can look at. Small sessions beat marathons, especially for a first build.

Where you're the bottleneck (schedule these): identity brief and design crit (end of Phase 1), serving quality editing (Phase 2), voice copy for quiet/empty states (Phase 3), eval labeling (Phase 4), venue watchlists (Phase 5).

Slack: the plan fits 12 days with roughly a day of slack hidden across phases 5–6. If we run hot, evals (Phase 4) can shrink to 25 labeled pages without losing the story; the map, serving, and research beat never get cut.

Cost tripwires: if any free tier surprises us (Gemini limits, Vercel function limits), the fallback is pre-generating more and doing less live, never entering a credit card.

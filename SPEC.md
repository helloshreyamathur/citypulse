# CityPulse — Product Spec (v1)

Status: draft for review
Owner: Shreya
Last updated: July 12, 2026

This document is the source of truth for what CityPulse is and why. The build plan (PLAN.md) sequences the work; this file defines the product. If a build decision contradicts this file, the build decision is wrong or this file needs a deliberate edit.

---

## What CityPulse is

CityPulse is a map-first neighborhood companion for Chicago. It helps residents get to know their neighborhood better: what's happening today, what's worth knowing about the places around them, and the context behind it all that people normally piece together from Google, Reddit, and Instagram themselves.

It is not an events aggregator. Big street festivals matter, but so does a jazz set at a neighborhood bar or a movie screening in a park. The product's job is intimacy with a place, not volume of listings.

## Who it's for

Chicago residents. New arrivals and long-timers, all ages. No assumption that the user is young, extremely online, or new to the city.

Secondary audience, equally important for this project: hiring managers viewing Shreya's portfolio. The product must work as a live demo they can explore in three minutes, and the repo must show hands-on AI tooling fluency (agent pipeline, evals, prompt work, a design-system skill).

## The core scenario

It's a warm Sunday. You want to step out but don't know where. You open CityPulse and see your neighborhood on a map with today's happenings. You spot a street fair in another neighborhood. You tap in and get the context you'd otherwise hunt for across five tabs: which streets close, where to park, what vendors show up, and what people who've been before say about it ("come early, the tamale stand sells out").

## What it should make people feel

After two minutes, a user should think one of these:

- "I found something to do."
- "This neighborhood has so many cool things going on."
- "Huh, that's a great fact about that building/park/street."

The experience should be addictive in a good way: it invites exploration.

---

## The experience

### Layout

Desktop browser first. The map is the spine of the product and takes roughly two thirds of the screen. A panel alongside it holds the daily serving, event details, and neighborhood info.

### Map behavior

- Zoomed in: your home neighborhood, with today's happenings pinned.
- Zoom out: neighboring areas appear, then the whole city.
- 15 curated neighborhoods are fully alive: West Loop, River North, Wicker Park, Logan Square, Old Town, Pilsen, Northalsted/Boystown, Andersonville, Chinatown, the Loop/Downtown, Wrigleyville, Lincoln Park, Bucktown, South Loop, Uptown. All other Chicago neighborhoods render on the map labeled "coming soon" so no one feels their neighborhood was forgotten.

### Home base without accounts

No accounts, no auth. On first visit, the user picks a home neighborhood (or skips and sees the whole city). The choice, plus any favorited places (e.g. Millennium Park), is saved in the browser. Returning visitors land on their home neighborhood.

### The daily serving

Each curated neighborhood gets a daily serving of up to 10 items. When a day is quiet, the serving shrinks honestly rather than padding with filler. Quiet days get evergreen garnish and a nudge outward, e.g.: "Not much happening in Avondale today, but this weekend: [x]. Or check out River North."

After the serving ends, the product offers a jump to another neighborhood instead of more scroll.

### Content types

1. Happenings. Street fests, markets, gallery nights, and also the small intimate stuff: live music at a bar, a park screening, a pop-up. Sourced daily.
2. Context briefs. Tap into a happening and get practical context: closures, parking, what to expect, plus a short summary of what people online are saying, with an option to open the top 5–6 real threads. Most briefs are pre-generated nightly. One event per view offers a live "research this for me" action that visibly assembles a brief on demand (rate-limited).
3. Did you know. A rotating fun fact per neighborhood about a building, park, street, or bit of history. Refreshes every 2–3 days. Each fact carries a citation or "read more" link, external links are fine.
4. Neighborhood details. Tapping a neighborhood shows a short profile: character, notable spots, the did-you-know, and today's serving.

### Freshness

Daily is the heartbeat. The pipeline runs nightly; nothing in v1 depends on live minute-by-minute data. The one exception is the on-demand research action, which runs live when tapped.

---

## Data and sources

Event and news sources (scraped/aggregated nightly): Block Club Chicago, Time Out Chicago, Do312, Choose Chicago, Secret Chicago, City of Chicago.

Intimate-content sources: a handpicked watchlist of 5–10 venue and park sources per curated neighborhood (venue sites, park district pages). If the pipeline can't source something reliably, it doesn't get shown. No community submissions in v1.

Chatter: Reddit (r/chicago, r/AskChicago, neighborhood subs), summarized nightly per happening where relevant, with links out to real threads. For annual events, older threads are valid sources and should be used.

Facts: grounded in citable sources (Wikipedia, Chicago history archives, local journalism). Never generated from model memory alone.

---

## Constraints

### Zero dollars

This is a hard constraint. The whole architecture follows from it:

- Static site, hosted free (Vercel free tier), reading pre-built JSON data files. No database, no paid server.
- Nightly pipeline runs on GitHub Actions (free for public repos): scrape sources, extract and normalize happenings with a free-tier LLM API, generate briefs and summaries, rotate facts, commit JSON to the repo.
- Runtime LLM: Google Gemini free tier, with a fallback free provider. (The product's brain is deliberately a different model family than the tool that built it.)
- Map: MapLibre with free OpenStreetMap-based tiles. No Mapbox/Google billing.
- The single on-demand research action runs as a small serverless function within free-tier limits, rate-limited.

### Timeline

10–12 days of build time. The plan front-loads the map and daily serving so something demoable exists early; evals and polish run alongside, not after.

---

## The portfolio layer

The repo is part of the product. It must credibly show:

1. An agentic pipeline: the nightly scrape → extract → summarize → publish job, visible in public code and Action logs.
2. An eval suite: ~50 hand-labeled real event pages scoring the extraction prompts (date, location, price, neighborhood) using promptfoo, with results and iteration notes.
3. A design-system skill: a skill file that encodes CityPulse's colors, type, spacing, and component patterns so Claude Code builds consistent UI. Authored by a product designer, which is the point.
4. A versioned prompts/ folder with short notes on why each prompt iteration changed.
5. A well-maintained CLAUDE.md showing how the AI workflow was directed.

The README (written last) tells this story to a hiring manager, with a screenshot and the live link.

## The demo, defined

A hiring manager follows the portfolio link. In three minutes they should:

1. Land on the map and immediately get what this is.
2. Browse a neighborhood's daily serving and tap into a happening.
3. Trigger the live research action and watch a brief assemble.
4. Hit a did-you-know that makes them smirk.
5. Leave thinking "she can build cool things with AI" and click through to the repo to see how.

## Out of scope for v1

- Accounts and auth
- San Francisco or any second city
- Community submissions
- Neighborhood compatibility matching and community/social features
- Mobile-first design (must not be broken on mobile, but desktop is the design target)
- Live real-time data beyond the on-demand research action
- Monetization of any kind

## Open questions

- Visual identity: name treatment, palette, map style direction (Shreya to lead).
- Exact free-tier LLM limits to verify at wiring time; fallback provider choice.

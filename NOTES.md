# CityPulse — Feasibility Notes

Phase 0 research spike. Source/robots/terms and neighborhood findings **verified July 13, 2026** (first local session). Sections 2 (Gemini) and 3 (Reddit) are still desk research pending live keys.

## 1. Content sources

Verified against each site's live robots.txt and Terms of Use on July 13, 2026. Headline: technical access and *legal permission* diverge sharply. The two easiest sites to fetch (Time Out, Secret Chicago) are the two whose terms most clearly forbid what CityPulse does; a site that blocks Claude's crawler by name (Block Club) still offers a clean sanctioned feed.

**Ranking, friendliest → hardest for our use:**

1. **City of Chicago open data (data.cityofchicago.org) — GREEN.** Purpose-built for programmatic use. robots.txt sets `Crawl-delay: 1` and only blocks search/facet UI params; the SODA API (`/resource/{id}.json`, `.geojson`) is the intended path. Most structured source we have — clean tabular data. See §5 for the specific event/closure datasets. Use freely, politely.

2. **Choose Chicago (choosechicago.com) — GREEN.** robots.txt explicitly `Allow: /events/*` and `/event/*` with `Crawl-delay: 20`. Crucially, it exposes a **public, unauthenticated JSON events API** — The Events Calendar REST: `/wp-json/tribe/events/v1/events` (confirmed returning event JSON with dates, venue, organizer, categories). This is the easiest *structured events* win. ToS §5 has a boilerplate "no info not intentionally made available" clause, but the API is intentionally exposed. Prefer the API over scraping.

3. **Block Club Chicago (blockclubchicago.org) — GREEN via RSS only.** Official RSS feed confirmed live: `/feed/` returns valid `application/rss+xml` (~175 KB, structured items with title/link/date/categories). BUT their robots.txt explicitly blocks `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `GPTBot`, `CCBot`, `Google-Extended`, `PerplexityBot`, and every other AI crawler with `Disallow: /`, and their ToS bans "any robot, spider, scraper, or other automated or manual means to access this Website, or copy any content." **So: consume the RSS feed (the front door they built for syndication) with a normal reader UA; never scrape their HTML with the pipeline.** News articles, not event listings — good for context/"did you know," not the happenings spine.

4. **Do312 (do312.com) — YELLOW.** robots.txt (fetched with a real browser UA) only disallows `/assets/`, `/features`, `/search`, `/latest`, map view — event listing pages are allowed. Event pages are the **best-structured events of any scrape target**: full schema.org `Event` / `Place` / `Offer` / `GeoCoordinates` / `PostalAddress` microdata (25 events/page). No usable public feed, though: `/events.rss` returns 406, `/feed` returns HTML. Catch: **Cloudflare bot protection** — a plain non-browser UA gets 403/406 (that's why a naive fetch of even robots.txt failed). Needs a browser-like UA, low volume, and may still be challenged. No ToS page found (only a privacy policy).

5. **Secret Chicago (secretchicago.com) — YELLOW/RED.** robots.txt permits content pages; WordPress RSS at `/feed/` is live (confirmed, ~83 KB). BUT the site is a **Fever** property (Secret Media Network), and Fever's ToS explicitly prohibits robots/spiders/scrapers *and* "aggregating any current or previously-offered activities or other content or information from the Website … with material from other websites and publishing it" without written permission — which is precisely CityPulse's model, feed or no feed. Editorial listicles, not structured events. Treat as off-limits unless we get written permission.

6. **Time Out Chicago (timeout.com/chicago) — RED for our use, despite being the easiest to fetch.** Permissive robots.txt and a working Chicago RSS feed (`/chicago/feed.rss`, ~490 KB). But the ToS is the most hostile to exactly what we do: it forbids use of content "on any artificial intelligence (AI) or machine learning platform, tool, software or system in any way (including … retrieval-augmented generation), without our prior written approval," bans commercial use, and bans passing cached datasets to others. CityPulse is an AI/RAG pipeline. **Contractually a no-go** — drop it rather than fight it, per the SPEC's own rule.

Net for the build: happenings spine = City of Chicago datasets + Choose Chicago API + Do312 (polite, browser-UA). Context/news = Block Club RSS. Drop Time Out and Secret Chicago on terms grounds.

## 2. Runtime LLM (Gemini free tier)

Workable, with real constraints. As of mid-2026: no credit card required; free limits were cut sharply in Dec 2025; Flash-class models are the free workhorses at roughly 10–15 requests/minute and a few hundred to ~1,000 requests/day depending on model. Numbers drift, so confirm live limits in Google AI Studio when creating the key.

Design consequences:
- Pipeline throttles itself and batches multiple events per request (never one call per event).
- Retry with exponential backoff on 429 errors.
- NEVER enable billing on the Google project: enabling billing deletes the free tier entirely and makes every call billable.
- Free-tier requests may be used by Google to improve models. Acceptable: we only send public event pages, never user data.
- Fallback provider if limits pinch: Groq or OpenRouter free tiers (decide only if needed).

## 3. Reddit access

Feasible on the free tier. Reddit's Data API is free for non-commercial use at 100 queries/minute per OAuth client; CityPulse is non-commercial and our nightly volume is far below that. Unauthenticated .json endpoints were deprecated in May 2026, so OAuth is mandatory: register a free script-type app at reddit.com/prefs/apps.

Constraint to remember: free tier is non-commercial only. If CityPulse ever became a business, this feature needs a licensing rethink.

## 4. Neighborhood boundaries

Confirmed and downloaded to [`public/data/neighborhoods.geojson`](public/data/neighborhoods.geojson) — 98 polygons, `pri_neigh`/`sec_neigh` name fields, MultiPolygon geometry, ~2.1 MB. (Lives under `public/` so the client map can fetch it at `/data/neighborhoods.geojson`; pipeline-generated JSON will live in `data/`.)

Gotcha on *which* dataset serves the data: the headline "Boundaries - Neighborhoods" map (`bbvz-uum9`) is now a Socrata "visualization canvas" that **won't export GeoJSON** (returns an empty FeatureCollection). The actual geo data lives in the tabular sibling **`y6yq-dbs2` (Neighborhoods_2012b)** — pull GeoJSON from `https://data.cityofchicago.org/resource/y6yq-dbs2.geojson?$limit=500`. That's what's checked in.

**15 curated neighborhoods vs. the dataset — 12 clean, 3 need handling:**

- Exact name matches (12): West Loop, River North, Wicker Park, Logan Square, Old Town, Andersonville, Chinatown, Wrigleyville, Lincoln Park, Bucktown, Uptown, and **Boystown** (see note).
- **Northalsted/Boystown** — present, but the city's file still labels it the old name **"Boystown"** (the neighborhood officially rebranded to Northalsted in 2020). Alias it in our data.
- **the Loop/Downtown** — present as **"Loop"** ("Downtown" is not a label in the set).
- **Pilsen — MISSING by that name.** The area exists but is labeled **"Lower West Side"** (its community-area name). Rename/alias to Pilsen for display.
- **South Loop — MISSING; no matching polygon at all.** Nearest coverage is **"Near South Side"** (community area), with sub-polygons "Printers Row," "Museum Campus," and "Grant Park" in the vicinity. Needs a deliberate mapping decision — likely draw/alias a South Loop polygon from Near South Side.

Other data quirks worth knowing: "Millenium Park" is misspelled (one N) in the source; "Sauganash,Forest Glen" has a missing space. Boundaries are approximate and names unofficial, which still suits a neighborhood companion better than the rigid 77 community areas — but the three items above need hand-adjustment before the map is trustworthy.

## 5. Chicago open data — event & closure datasets (verified July 13, 2026)

Searched the portal for special events / street closures / event permits. What's actually useful:

- **CDOT permits — `pubx-yq2d` ("Transportation Department Permits"). Updated daily.** The live spine for street closures. 2.3M rows, but filter `applicationdescription = 'DOT Special Event Permit'` (≈132K records) for festivals/block parties; has street-closure flag, dates, ward, lat/lng. Big and mostly construction — must filter hard.
- **Park District — `pk66-w54g` ("Chicago Park District - Outdoor Event Permits").** ~142K rows; Event Type, Event Description, park name, reservation start/end, permit status. Good for park screenings, festivals-in-parks.
- **DCASE — `xgse-8eg7` ("Special Events").** Exactly the right *shape* — 595 geocoded rows with Venue, Event Type, Event Details (e.g. "Christkindlmarket - Chicago"), Start Time, Ward, point geometry. **Surprise/caveat: it's basically frozen** — last updated 2026-01-08, sample rows from late 2025. Treat as a seed/reference of recurring marquee events, **not** a live daily feed.
- Also noted, lower priority: `knv6-r5ad` (Public Building Commission Event Permits), `nxj5-ix6z` (Sidewalk Cafe Permits).

Takeaway: for "what street fest is happening this weekend," the reliable live path is **CDOT special-event permits + Park District event permits**, not the tempting-but-stale "Special Events" dataset.

## Open items for first local session

- [x] robots.txt + terms check for all six sources; rank friendliest-first — see §1
- [x] Check City data portal for special-event permit datasets — see §5
- [x] Download neighborhoods GeoJSON; confirm all 15 names — see §4, saved to `public/data/neighborhoods.geojson`
- [x] Create Gemini API key — done. Default key on **Free tier**, project `gen-lang-client-0349131969`; validated via `/v1beta/models`. Stored as GitHub Actions secret + local gitignored `.env` (see `.env.example`). Still to record: exact per-model free-tier RPM/RPD limits.
- [ ] Register Reddit script app — **DEFERRED (non-blocking)**. "create app" silently refreshed to the same page; most likely cause is an unverified email on the Reddit account (Reddit blocks API-app creation silently until email is verified). Reddit only powers the context-brief "chatter" layer, so it's safe to wire in later when that feature is built. Retry: verify email at reddit.com/settings/account, then reddit.com/prefs/apps → create app → type `script`, redirect uri `http://localhost:8080`.

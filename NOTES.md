# CityPulse — Feasibility Notes

Phase 0 research spike. Findings as of July 13, 2026. Items marked "verify locally" get checked in the first Claude Code session.

## 1. Content sources

Block Club Chicago — GREEN. Publishes an official RSS feed (blockclubchicago.org/feed), confirmed in their own FAQ. RSS is a front door they built on purpose; no scraping needed. Nonprofit, subscription-supported; we consume headlines/links via the feed, which is its intended use.

Do312 — YELLOW. DoStuff Media property, no official public developer API found. Public listing pages exist and are well structured. Verify locally: robots.txt and terms before scraping; scrape politely (nightly, low volume, identified user agent) if permitted.

City of Chicago — GREEN, likely the friendliest source of all. The open data portal (data.cityofchicago.org) exists to be consumed programmatically. Verify locally: check for special-event/street-closure permit datasets, which may be the most reliable structured source for street fests.

Time Out Chicago, Choose Chicago, Secret Chicago — UNCHECKED. Verify locally: robots.txt, terms, RSS availability, page structure. Any source that says no gets dropped and replaced rather than fought.

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

Confirmed: Chicago Data Portal "Boundaries - Neighborhoods" dataset (Office of Tourism). Boundaries are approximate and names unofficial, which suits a neighborhood companion better than the rigid 77 community areas (community areas don't match lived names like Wrigleyville or Wicker Park). Verify locally: all 15 curated neighborhoods present by name; hand-adjust polygons where local intuition disagrees.

## Open items for first local session

- [ ] robots.txt + terms check for all six sources; rank friendliest-first
- [ ] Check City data portal for special-event permit datasets
- [ ] Download neighborhoods GeoJSON; confirm all 15 names
- [ ] Create Gemini API key; record live free-tier limits here
- [ ] Register Reddit script app; record credentials in GitHub Actions secrets (never in code)

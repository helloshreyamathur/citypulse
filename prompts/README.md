# prompts/

Versioned LLM prompts for the CityPulse pipeline, with a short note on why each revision changed. This folder is deliberately part of the portfolio story (SPEC "portfolio layer" item 4): it shows prompt iteration as real engineering, not a one-shot guess.

## Conventions

- One file per prompt, named `<purpose>.vN.md` (e.g. `extract-event.v1.md`, `extract-event.v2.md`). Keep old versions; don't overwrite.
- Each file starts with a short header: **what it does**, **model it targets**, **inputs/outputs**, and **what changed vs. the previous version and why**.
- The eval suite (Phase 4, promptfoo) scores the extraction prompt against ~50 hand-labeled event pages; record score deltas alongside the version that produced them (see EVALS.md when it exists).

## Prompts (none yet)

First real prompt lands in Phase 2: `extract-event` — raw event page → clean schema JSON (title, date/time, location, neighborhood, category, price, source URL, intimacy tier). See [PLAN.md](../PLAN.md) Phase 2.

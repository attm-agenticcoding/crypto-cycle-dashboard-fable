---
name: fable-dashboard
description: Finish or refactor the Fable Crypto Cycle Dashboard static site. Use when working in the crypto-cycle-dashboard-fable repo on index.html, data.json, visual/dashboard polish, dashboard validation, research-only disclosure, or handoff preparation for the Fable BTC / ETH cycle model.
---

# Fable Dashboard Skill

## Workflow

1. Read `CLAUDE.md`.
2. Read `references/dashboard-contract.md` before changing dashboard behavior, copy, data rendering, or validation.
3. Run `npm test` to establish the current contract.
4. Improve the dashboard in small coherent passes.
5. Run `npm test` again before stopping.

## Editing Guidance

- Optimize for a dense research dashboard, not a marketing site.
- Keep the static architecture unless a build step is clearly worth the added maintenance.
- Treat `data.json` as canonical exported research data.
- If `index.html` embeds data, keep the embedded `DATA` exactly synchronized with `data.json`.
- Keep warnings strong, visible, and precise.
- Keep BTC and ETH comparable across the same visual language.
- Prefer compact SVG or HTML charts with stable dimensions and no layout shift.

## Validation

Use `npm test` as the minimum gate. It checks data shape, embedded-data synchronization, JavaScript syntax, and the research-only/failed-validation disclosures.

If you intentionally change the research contract, update `scripts/validate-dashboard.mjs`, `CLAUDE.md`, and `references/dashboard-contract.md` in the same pass.

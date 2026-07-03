# Fable Crypto Cycle Dashboard Memory

Read this before editing the dashboard.

## Mission

This repository publishes the independent Fable BTC / ETH cycle dashboard. It is a research-only, negative-result artifact, not the live production policy. The current site must be made polished and useful without hiding that the anti-overfit suite failed.

## Current Shape

- `index.html` is the published static page and currently embeds the full `DATA` object.
- `data.json` is the canonical exported dataset and must stay exactly synchronized with the embedded `DATA` in `index.html`.
- The source exporter lives outside this repo: `/Users/block/agentic-coding/Claude/crypto-cycle-detection-fable/scripts/export_dashboard.py`.
- GitHub Pages deploys the repository root through `.github/workflows/deploy.yml`.

## Commands

- Validate contract: `npm test`
- Same validation entry: `npm run validate`
- Local static server: `npm run serve`
- Browse locally at `http://127.0.0.1:4173/`

## Non-Negotiables

- Keep the page research-only and explicit that it is not investment advice.
- Preserve the failed validation story: `all_pass=false`, `perturb_plateau=false`, and `stress_no_ruin=false` unless the upstream research export genuinely changes.
- Do not present policy target as live-approved sizing.
- Keep forecast evidence quality separate from policy validation.
- Keep the distribution ladder result clear: the simple ladder beat the extension-score policy held out, so the score is display-only.
- Do not grade live campaigns as complete episodes.
- Do not replace `data.json` with manually invented market data.

## Fable One-Pass Build Brief

Fable should finish this as a dense, high-signal research dashboard. Prefer an operational dashboard, not a landing page. Make the first viewport immediately answer:

- What is the current BTC and ETH state?
- What is the forecast saying?
- What is the research policy target?
- Why is this not production-approved?
- What failed, and how bad was it?

The best outcome is a clean static dashboard with strong hierarchy, compact charts, obvious risk/audit cues, responsive layout, and no marketing fluff. Improve `index.html` directly unless you decide to introduce a build step and also update this memory plus the harness.

## Visual Direction

- Use a restrained, data-terminal feel with clear contrast and disciplined spacing.
- Avoid giant hero marketing sections, decorative gradients, and card-on-card layouts.
- Make tables scannable and avoid letting long text overflow on mobile.
- Preserve or improve the SVG charting. Static, dependency-free is preferred unless the improvement clearly justifies dependencies.

## Handoff Files

- `.claude/skills/fable-dashboard/SKILL.md` contains the project skill.
- `.claude/skills/fable-dashboard/references/dashboard-contract.md` contains the dashboard contract and acceptance notes.
- `FABLE_HANDOFF.md` is the one-shot prompt for the finishing pass.

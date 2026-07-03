# Dashboard Contract

## Core Story

The dashboard is an independent Fable benchmark for BTC and ETH cycle research. It should communicate three layers separately:

- Raw/calibrated bottom forecast.
- Research policy target.
- Validation status.

Forecast evidence quality is not policy approval. The policy validation currently failed and must remain prominent.

## Required Data

The page depends on:

- `assets.BTC` and `assets.ETH`
- `assets.*.live`
- `assets.*.history`
- `assets.*.backfill`
- `assets.*.ladder`
- `episodes`
- `validation.gates`
- `validation.loco`
- `validation.perturbation`
- `validation.stress`
- `distribution.loo`
- `distribution.summary`
- `disclosures`

For live accumulation campaigns, show:

- Current price and as-of date.
- Regime.
- Peak/anchor, weeks in campaign, drawdown, trough so far.
- Raw and calibrated `P(bottom already in)`.
- Calibrated bottom price/date ranges.
- Research policy target and components.
- Evidence grade and why it has that grade.
- Wrong-if conditions.
- Historical analogs.

For validation, show:

- Gate pass/fail status.
- LOCO episode results.
- Stress cases.
- Parameter perturbation.
- Disclosures and post-result decisions.

For distribution, show:

- The simple ladder as the shipped distribution-side policy.
- The extension-score policy as display-only because it lost held out.

## Safety Copy

The UI must contain clear language equivalent to:

- Research only.
- Do not use as a live deployment recommendation.
- Not investment advice.
- Policy validation failed.
- Live campaigns are incomplete and not graded.

## Design Acceptance

- First viewport answers what is happening now for BTC and ETH.
- Failed-validation status is visible without hunting.
- Risk/audit language is clear, not buried in tiny footnotes.
- Desktop layout should support fast scanning.
- Mobile layout should avoid horizontal overflow and text overlap.
- Charts should remain legible when resized.
- Tables should be compact, aligned, and readable.
- Avoid decorative elements that do not carry data or hierarchy.

## Harness Expectations

Run `npm test` before and after meaningful edits. The harness should fail if:

- `data.json` is invalid.
- Embedded `DATA` in `index.html` diverges from `data.json`.
- The inline script has syntax errors.
- BTC/ETH, history, episode, validation, or distribution data is missing.
- Research-only or failed-validation language disappears.

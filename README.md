# Fable Crypto Cycle Dashboard

A public research-only dashboard for the independent Fable BTC / ETH cycle model.

**Live:** https://attm-agenticcoding.github.io/crypto-cycle-dashboard-fable/

The site is generated from:

`/Users/block/agentic-coding/Claude/crypto-cycle-detection-fable/scripts/export_dashboard.py`

## Local validation

This repo now includes a small zero-dependency dashboard harness:

```bash
npm test
```

The harness checks that `data.json` is valid, the embedded `DATA` in `index.html`
matches it exactly, the inline JavaScript parses, and the research-only /
failed-validation disclosures are still present.

To preview locally:

```bash
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Agent handoff

For a Fable finishing pass, start with:

- `CLAUDE.md`
- `.claude/skills/fable-dashboard/SKILL.md`
- `FABLE_HANDOFF.md`

Important status:

- Fable is an independent research benchmark, not the live production model.
- The dashboard explicitly marks the policy target as research-only.
- The anti-overfit suite did not pass all gates: `all_pass = false`,
  `perturb_plateau = false`, and `stress_no_ruin = false`.
- Forecast evidence quality is displayed separately from policy validation.
- The 2026-07-04 cross-audit put the Codex convex depth-floor core through
  this battery once with frozen constants: it improved LOCO ratios but failed
  the same anti-overfit gates, with worse perturbation/stress outcomes. Do not
  present either policy as production-approved.

Refresh cadence matches the Claude/Codex dashboards when the local Fable launchd
agents are installed from the source repo:

- 06:30 ET research intraday snapshot;
- 09:30-16:00 ET research snapshots every 30 minutes;
- 20:30 ET close research snapshot.

Research / educational only. Not investment advice.

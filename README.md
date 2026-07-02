# Fable Crypto Cycle Dashboard

A public research-only dashboard for the independent Fable BTC / ETH cycle model.

**Live:** https://attm-agenticcoding.github.io/crypto-cycle-dashboard-fable/

The site is generated from:

`/Users/block/agentic-coding/Claude/crypto-cycle-detection-fable/scripts/export_dashboard.py`

Important status:

- Fable is an independent research benchmark, not the live production model.
- The dashboard explicitly marks the policy target as research-only.
- The anti-overfit suite did not pass all gates: `all_pass = false`,
  `perturb_plateau = false`, and `stress_no_ruin = false`.
- Forecast evidence quality is displayed separately from policy validation.
- Codex remains the stronger production candidate based on the recorded comparison.

Refresh cadence matches the Claude/Codex dashboards when the local Fable launchd
agents are installed from the source repo:

- 06:30 ET research intraday snapshot;
- 09:30-16:00 ET research snapshots every 30 minutes;
- 20:30 ET close research snapshot.

Research / educational only. Not investment advice.

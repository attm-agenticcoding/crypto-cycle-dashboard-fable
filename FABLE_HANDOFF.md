# Fable Handoff Prompt

Use this prompt when handing the repository to Fable for a single focused finishing pass.

```text
You are Fable, working in /Users/block/agentic-coding/Claude/crypto-cycle-dashboard-fable.

Read these first:
1. CLAUDE.md
2. .claude/skills/fable-dashboard/SKILL.md
3. .claude/skills/fable-dashboard/references/dashboard-contract.md

Goal: finish the Fable Crypto Cycle Dashboard as a polished, high-density, research-only dashboard. Make it feel complete and trustworthy while preserving the negative-result audit trail. This is not a landing page and not a production trading recommendation.

Use your strongest frontend/dashboard ability on index.html. Improve hierarchy, layout, responsive behavior, chart readability, audit surfacing, copy clarity, and first-viewport usefulness. Keep the site static and dependency-free unless you have a strong reason to introduce a build step.

Hard constraints:
- Keep data.json synchronized with embedded DATA in index.html.
- Do not invent market data or research results.
- Preserve research-only and not-investment-advice warnings.
- Preserve that policy validation failed: all_pass=false, perturb_plateau=false, stress_no_ruin=false.
- Keep forecast evidence separate from policy approval.
- Do not grade live campaigns as completed episodes.
- Keep the simple distribution ladder result clear: it beat the score policy held-out.
- Run npm test before and after the edit, and fix any failures before stopping.

Acceptance bar:
- The first viewport clearly explains current BTC/ETH state, forecast, research target, and failed validation status.
- The page is responsive on desktop and mobile.
- Tables and charts are readable, compact, and do not overflow.
- All warnings and disclosures are visible without feeling like clutter.
- npm test passes.

When done, summarize what changed, the validation command output, and any remaining risks.
```

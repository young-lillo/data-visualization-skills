# Data-Viz Skill Toolkit Complete Build

**Date**: 2026-04-12 20:38
**Severity**: Medium
**Component**: `.claude/skills/data-viz/` — New orchestration skill
**Status**: Resolved

## What Happened

Built complete end-to-end `ck:data-viz` skill toolkit — 42 files across 8 sub-skills enabling cross-agent automation of analytics portfolio workflows. System handles intake → EDA → cleaning → analysis planning → tech stack selection → scaffold generation → deployment → testing.

## The Brutal Truth

No catastrophic failures today. What made this *efficient* was ruthless simplification: rejected Jupyter notebooks (too heavyweight for automated portfolios), ditched matplotlib (no interactivity), abandoned skill-to-skill RPC calls (sequential agent orchestration is cleaner). This forced clarity on what a portfolio analytics tool actually needs: intake → clean → visualize → deploy. Everything else is noise.

## Technical Details

**Architecture decisions:**
- CRISP-DM reduced to 4 phases (intake → prep → analysis → deployment) — full 6-phase CRISP-DM is overkill for portfolio projects
- Plotly + Altair only (no matplotlib) — interactive charts essential for demo portfolios
- Pandera for validation (lightweight, pytest-compatible, CSV-native) — rejected SQLAlchemy/Pydantic for over-engineering
- Streamlit Cloud as default deployment; Metabase opt-in via Docker
- Sequential agent orchestration (root SKILL.md → delegate to sub-skills) vs. programmatic RPC — simpler, debuggable, works cross-agent

**Skill structure:**
- 8 sequential sub-skills (intake → deploy) + reference docs (CRISP-DM, industry templates, pattern examples)
- Industry templates (9 domains: ecommerce, banking, healthcare, credit, logistics, HR, marketing, real-estate, education) with pre-built question/KPI/chart mappings
- Generator creates Streamlit scaffold with requirements.txt + config.toml + modular structure
- CI/CD ready: GitHub Actions template + Pandera validation schema

## Root Cause of Simplicity

Initial design bloat tempted: "Build support for Jupyter, Tableau, dbt, Feature Store connectors." Killed all of it. Portfolio context demands fast turnaround, minimal dependencies. Streamlit Cloud + BigQuery + GitHub Actions covers 95% of real portfolio needs. Everything beyond that is technical debt waiting to happen.

## Lessons Learned

- **Simplify first, add later.** The skill does *one thing* (portfolio analytics workflow) at minimal depth. Better to ship focused and expand than ship bloated and break.
- **Agent orchestration > RPC.** Skills talking to each other via program calls is fragile. Sequential delegation to root orchestrator is more transparent and testable.
- **Reference docs matter.** 6 docs (CRISP-DM primer, industry questions, patterns) prevent agents from reinventing domain knowledge.

## Next Steps

- Cross-agent testing: Run intake → EDA → deploy workflow with Codex + Claude Code
- Validate BigQuery/Kaggle connectors work end-to-end
- Document security model (creds handling in .env, not in scaffold)

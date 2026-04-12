---
title: "Data-Viz Skill Toolkit"
description: "Cross-agent skill toolkit automating data analytics portfolio workflow: intake, EDA, clean, visualize, deploy"
status: completed
priority: P1
effort: 40h
branch: main
tags: [skill, data-analytics, streamlit, portfolio, crisp-dm]
created: 2026-04-12
---

# Data-Viz Skill Toolkit

Cross-agent skill (`ck:data-viz`) automating a 3-phase portfolio analytics workflow. Works with Claude Code (claudekit) AND OpenAI Codex via Agent Skills Spec (SKILL.md format).

## Workflow

```
INTAKE (user-interactive)
  01-intake → intake-summary.md → [USER APPROVES]

COOK (fully automatic)
  02-eda → 03-sql-cleaner → 04-analysis-planner → 05-tech-stack → 06-workflow-gen
  → [USER APPROVES plan.md + boilerplate]

REVIEW + DEPLOY
  08-tester → 07-deploy-streamlit (or 07-deploy-metabase) → live URL
```

## Phases

| # | Phase | File | Status | Effort |
|---|-------|------|--------|--------|
| 1 | Toolkit Foundation | [phase-01](phase-01-toolkit-foundation.md) | Completed | 3h |
| 2 | Intake Skill | [phase-02](phase-02-intake-skill.md) | Completed | 4h |
| 3 | EDA + Cleaning | [phase-03](phase-03-eda-and-cleaning.md) | Completed | 6h |
| 4 | Analysis Planner | [phase-04](phase-04-analysis-planner.md) | Completed | 5h |
| 5 | Tech Stack + Workflow Gen | [phase-05](phase-05-tech-stack-and-workflow.md) | Completed | 5h |
| 6 | Streamlit Deploy | [phase-06](phase-06-streamlit-deploy.md) | Completed | 6h |
| 7 | CI/CD + Testing | [phase-07](phase-07-cicd-and-testing.md) | Completed | 6h |
| 8 | Metabase + Finalize | [phase-08](phase-08-metabase-and-finalize.md) | Completed | 5h |

## Dependency Graph

```
Phase 1 (foundation) ──┬── Phase 2 (intake)
                        ├── Phase 4 (analysis templates)
                        └── Phase 3 (EDA + cleaning)
Phase 2 + 3 + 4 ───────── Phase 5 (tech stack + workflow gen)
Phase 5 ────────────────── Phase 6 (streamlit deploy)
Phase 5 ────────────────── Phase 7 (CI/CD + testing)
Phase 6 + 7 ────────────── Phase 8 (metabase + finalize)
```

## Key Decisions
- **Analytics framework:** CRISP-DM simplified to 4 phases for solo portfolios
- **Chart libs:** Plotly (interactive) + Altair (statistical) — no Matplotlib
- **Data validation:** Pandera (lightweight, pytest-native) — not Great Expectations
- **Deploy default:** Streamlit Cloud (one-click); Metabase as opt-in sub-skill
- **Data sources:** CSV (local/URL), Kaggle API, BigQuery (pandas-gbq)
- **Skill orchestration:** Parent SKILL.md + references/ — no programmatic chaining
- **Cross-agent:** Same SKILL.md works for Claude Code + Codex

## Rollback Strategy
Each phase is additive (new files only). Rollback = delete the created sub-skill directory. No existing files modified until Phase 8 (finalize).

## Reports
- [Brainstorm](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- [Research: Agent Skills + Streamlit + CRISP-DM](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md)
- [Research: Kaggle + BigQuery + CI/CD](../reports/researcher-260412-1644-data-viz-toolkit-research.md)

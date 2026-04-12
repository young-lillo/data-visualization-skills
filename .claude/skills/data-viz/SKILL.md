---
name: ck:data-viz
description: "Build data analytics portfolio projects. Use when user wants dashboards,
  data visualization, EDA, dataset analysis, Streamlit apps, or portfolio projects
  for ecommerce, banking, healthcare, education, credit, logistics, hr, marketing,
  real-estate industries. Triggers on: 'build dashboard', 'analyze dataset', 'data viz',
  'portfolio project', 'streamlit app', 'data analytics'."
argument-hint: "[industry] [dataset-path-or-url]"
metadata:
  author: claudekit
  version: "1.0.0"
  framework: CRISP-DM
  license: MIT
---

# Data-Viz Skill Toolkit

Automates a 3-phase portfolio analytics workflow: intake → cook → review/deploy.

**Scope:** Data analytics workflows only. Does NOT handle auth credentials directly.
No API keys or secrets stored in any skill file.

## Workflow Overview

```
PHASE 1: INTAKE (user-interactive, ~5 min)
  /ck:data-viz → 01-intake → intake-summary.md → [USER APPROVES]

PHASE 2: COOK (fully automatic)
  02-eda → 03-sql-cleaner → 04-analysis-planner → 05-tech-stack → 06-workflow-gen
  → [USER APPROVES plan.md + boilerplate]

PHASE 3: REVIEW + DEPLOY
  08-tester → 07-deploy-streamlit (or 07-deploy-metabase) → live URL
```

## Phase 1: Intake

Activate `skills/01-intake/SKILL.md`.

Collect from user:
1. Project name
2. Industry vertical (ecommerce, banking, healthcare, education, credit, logistics, hr, marketing, real-estate)
3. Dataset source (local CSV path | URL | `kaggle:owner/dataset` | `bigquery:project.dataset.table`)
4. Analysis goal (free text, 1-2 sentences)
5. Deploy target (streamlit [default] | metabase)

Validate inputs then write `intake-summary.md` to working directory.
Present summary to user — wait for approval before proceeding.

## Phase 2: Cook

Run sub-skills **sequentially** in this order:

| Step | Sub-Skill | Input | Output |
|------|-----------|-------|--------|
| 1 | `02-eda` | intake-summary.md | eda_report.html, column summary |
| 2 | `03-sql-cleaner` | EDA output | clean_dataset.csv |
| 3 | `04-analysis-planner` | intake + EDA output | analysis-plan.md |
| 4 | `05-tech-stack` | intake + analysis-plan | stack-decision.md |
| 5 | `06-workflow-gen` | all upstream outputs | project scaffold |

After generating scaffold, present `plan.md` to user — wait for approval before deploy.

## Phase 3: Review + Deploy

1. Activate `skills/08-tester/SKILL.md` — generate and run tests
2. If deploy target = streamlit: activate `skills/07-deploy-streamlit/SKILL.md`
3. If deploy target = metabase: activate `skills/07-deploy-metabase/SKILL.md`

## Sub-Skills Reference

| Dir | SKILL.md | Phase | Purpose |
|-----|----------|-------|---------|
| `skills/01-intake/` | ck:data-viz-intake | Intake | Collect project info |
| `skills/02-eda/` | ck:data-viz-eda | Cook | Profile dataset |
| `skills/03-sql-cleaner/` | ck:data-viz-cleaner | Cook | Clean data |
| `skills/04-analysis-planner/` | ck:data-viz-planner | Cook | Generate questions |
| `skills/05-tech-stack/` | ck:data-viz-stack | Cook | Select libraries |
| `skills/06-workflow-gen/` | ck:data-viz-workflow | Cook | Scaffold project |
| `skills/07-deploy-streamlit/` | ck:data-viz-deploy-streamlit | Deploy | Streamlit app |
| `skills/07-deploy-metabase/` | ck:data-viz-deploy-metabase | Deploy | Metabase dashboard |
| `skills/08-tester/` | ck:data-viz-tester | Test | Validate + CI/CD |

## References

- [CRISP-DM Framework](references/crisp-dm-framework.md) — 4-phase analytics guide
- [Industry Questions](references/industry-questions.md) — cross-industry question patterns
- [Streamlit Patterns](references/streamlit-patterns.md) — caching, layout, deploy
- [BigQuery Patterns](references/bigquery-patterns.md) — auth, queries, cost tips
- [Kaggle Patterns](references/kaggle-patterns.md) — auth, download, formats
- [Dataset Sources](references/dataset-sources.md) — CSV, Kaggle, BQ, public datasets

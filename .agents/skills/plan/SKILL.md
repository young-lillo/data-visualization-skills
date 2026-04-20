---
name: dv-plan
description: Start a new Data Visualization Kit project with structured intake and planning. Use when the user types `$dv-plan`, starts a new project, has a dataset but unclear scope, needs framework mapping, or needs one canonical project plan file before any downstream `$dv-*` workflow runs.
argument-hint: "[goal / task / brief]"
license: MIT
metadata:
  author: data-visualization-kit
  version: "2.0.0"
---

# DV Plan

Production-ready intake and planning for Data Visualization Kit projects.
This is the first project step and it must produce one canonical plan file that downstream skills and workflows can trust.

## Workflow Obligation

This skill must follow:

- `./.codex/workflows/primary-workflow.md`
- `./.codex/workflows/hook-runtime-contract.md`

If this skill and the workflow files disagree, follow the workflow files.

## When to Use

- starting a new project from a broad business or portfolio brief
- the user has a dataset but the problem framing is still weak
- the user has context and dataset but goals are vague, missing, or underspecified
- the project needs framework mapping before implementation begins
- downstream `$dv-*` workflows need one canonical plan file first

## Intake Contract

This skill is responsible for collecting and clarifying:

- dataset context
- dataset or source surface
- project goals if the user already has them
- constraints, assumptions, and output expectations when they materially affect the plan

If any of these are vague, ask direct clarification questions until the inputs are trustworthy enough to plan.

## Clarification Rules

- clarify the business or portfolio context, not just the table names
- clarify what the dataset actually contains, its likely grain, and any obvious trust gaps
- clarify whether the user wants BI storytelling, operational monitoring, advanced analysis, or a pipeline-heavy portfolio case
- if the user gives weak goals, translate them into sharper analytical questions before planning
- do not pretend missing goals are already clear

## Mandatory Decision Gate (REQUIRED — do not skip)

**Before producing any plan output**, you MUST explicitly confirm all four decisions with the user.
Do not auto-select silently. Do not proceed until the user has responded to each question.

Present each decision as a numbered choice with a short description. Wait for the user's selection.

### 1. Framework

Present both options and ask the user to choose:

| # | Framework | Best for |
|---|-----------|---------|
| 1 | **CRISP-DM** | insight-first — business understanding, analysis, explanation, recommendations |
| 2 | **Data Pipeline** | engineering-first — ingestion, transformation, orchestration, data quality, reproducibility |

Ask: *"Which framework fits your project? (1 or 2)"*

If the user's brief already contains strong signals (e.g. "ETL pipeline", "forecasting"), suggest a default but still ask to confirm.

### 2. Goal Tier

Present all three tiers and ask the user to choose:

| # | Tier | What it delivers |
|---|------|-----------------|
| 1 | **Basic** | descriptive questions, data profiling, lighter dashboard output |
| 2 | **Pro** | harder stakeholder questions, driver/segment analysis, stronger analytical story (default) |
| 3 | **Advanced** | forecasting, anomaly detection, scenario analysis, senior portfolio narrative |

Suggest concrete goal ideas for each tier based on the user's dataset and context before asking.
Ask: *"Which goal tier fits your ambition for this project? (1, 2, or 3)"*

### 3. Visualization Tool

Present all four options and ask the user to choose:

| # | Tool | Best for |
|---|------|---------|
| 1 | **Evidence.dev** | static portfolio dashboards from CSV/Excel/Kaggle, Netlify/Vercel deploy |
| 2 | **Metabase** | general BI, stakeholder dashboards, SQL-backed questions |
| 3 | **Grafana** | operational monitoring, time-series, observability, alert-aware panels |
| 4 | **Apache Superset** | legacy Superset estates only or migration analysis |

Ask: *"Which visualization tool should this project use? (1, 2, 3, or 4)"*

### 4. Deploy Target

Present all three options and ask the user to choose:

| # | Target | Implications |
|---|--------|-------------|
| 1 | **Netlify** | static hosting - free tier, Evidence.dev deploys here (default for CSV/Kaggle projects) |
| 2 | **Vercel** | static hosting - free tier, Evidence.dev deploys here |
| 3 | **VPS** | self-hosted server - required for Metabase, Grafana, Apache Superset |

Ask: *"Where will this portfolio project be deployed? (1, 2, or 3)"*

**If the user selects Netlify or Vercel**, suggest Evidence.dev as the visualization tool unless goals are explicitly operational or time-series.

**Do not proceed to write the plan until all four decisions are confirmed.**
Record all four confirmed choices at the top of `project-plan.md`.

## Output Requirement

`project-plan.md` must record all four confirmed decisions (framework, goal tier, visualization tool, deploy target) at the top, before any phase breakdown.

After the inputs are clear enough, produce one canonical plan file:

- `projects/<slug>/docs/project-plan.md`

That plan file must be rich enough for downstream `$dv-*` workflows and skills to continue without guessing.

## Plan File Must Contain

- user-provided context
- user-provided dataset description
- clarified interpretation of the problem
- clarified or selected goals
- suggested goal ladder with the chosen level called out
- framework recommendation with reasoning
- recommended visualization path
- expected SQL/Python depth
- suggested next workflows after planning
- assumptions, risks, and open questions if any

## Handoff Rule

- `$dv-cook` should run after the plan is locked and the project workspace exists
- `$dv-data-preparation` should use the plan file as its primary project contract
- `$dv-data-visualize` should use the plan file as the starting project contract when visualization work begins

## Common Pitfalls To Avoid

1. turning intake into a shallow form-fill exercise
2. accepting vague goals without sharpening them
3. choosing a framework implicitly instead of documenting why
4. producing a plan that downstream skills cannot actually use
5. confusing "dataset description" with "analytical objective"
6. making the plan generic enough to fit anything and guide nothing

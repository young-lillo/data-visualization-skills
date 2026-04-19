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

## Framework Mapping

After clarification, map the project to the most suitable data framework.

**Prefer CRISP-DM when:**
- the ask is insight-first
- the user wants business understanding, analysis, explanation, and recommendations
- the dataset is mainly a vehicle for analytical questions and portfolio storytelling

**Prefer a data-pipeline-first framework when:**
- the ask is engineering-first
- the user cares about ingestion, transformation, orchestration, data quality, reproducibility, or handoff between systems
- the dataset story depends on reliable data movement as much as analysis

Make the framework choice explicit in the plan with a short reason.

## Goal Ladder

If goals are incomplete or underpowered, suggest them in three levels and ask the user to confirm or refine:

- `Basic`
  - answer common descriptive questions
  - profile and clean the dataset
  - produce a lighter dashboard or portfolio outcome
- `Pro`
  - answer harder stakeholder questions
  - explain drivers, segments, or relationships
  - produce a stronger analytical story with more technical proof
- `Advanced`
  - answer high-difficulty questions
  - include deeper methods such as scenario analysis, forecasting, anomaly analysis, root-cause analysis, or richer technical design
  - make the dataset support a more senior portfolio narrative

Do not stop at listing these tiers. Suggest concrete goal ideas based on the user's dataset and context.

## Output Requirement

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

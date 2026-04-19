# Data Visualize Workflow

## Purpose

Authoritative workflow for visualization delivery and visualization refresh work in Data Visualization Kit.
This workflow owns the handoff from prepared data to one selected dashboard tool path.

## Workflow Contract

1. read the current project state
2. verify the prepared-data contract
3. resolve one selected visualization path
4. build or refresh visuals on that path only
5. validate the visualization pass
6. sync visualization docs and outputs under the project docs tree

## Core Rules

- treat project docs as the first source of truth before changing dashboards
- always read the latest cleaned-data contract from `$dv-data-preparation`
- route to exactly one visualization domain skill for the active project
- do not mix Metabase, Grafana, and Superset in one active visualization pass
- prefer interactive dashboard delivery over static storytelling output
- if the prepared data is not trustworthy enough, stop and route backward to `$dv-data-preparation`
- keep all visualization notes, exports, screenshots, and related assets under `projects/<slug>/docs/`

## Required Inputs

Before visualization work starts, gather:

- `projects/<slug>/README.md`
- `projects/<slug>/docs/project-brief.md`
- `projects/<slug>/docs/project-plan.md`
- `projects/<slug>/docs/data-preparation.md`
- `projects/<slug>/docs/visualization.md`
- the current `$dv-data-visualize` brief

If these sources disagree, prefer the latest project docs and make the mismatch explicit in `visualization.md`.

## Execution Stages

### 1. Project Read

- confirm project identity, business goal, audience, and delivery expectations
- read the selected visualization path from project docs when it already exists
- preserve the current tool choice unless the user explicitly asks to switch

### 2. Prepared-Data Verification

- read the latest output contract from `$dv-data-preparation`
- confirm grain, keys, freshness, null policy, and trusted metrics are clear enough for dashboard work
- route backward if the visualization layer would otherwise rely on guessed semantics

### 3. Tool Resolution

Choose exactly one domain skill:

- `metabase` for the default general BI path
- `grafana` for operational, observability, or time-series dashboards
- `apache-superset` only for legacy projects that already selected Superset or when migration analysis is explicitly required

### 4. Visualization Build

- build or refresh the dashboard on the selected path only
- keep the dashboard aligned to one prepared-data contract and one tool path
- preserve compatibility with the current project docs unless the requested scope changes

### 5. Validation

- run the `test` skill or project validation after visualization changes
- verify dashboards against the prepared-data contract and the business intent from project docs
- treat broken queries, mismatched metrics, and empty-state regressions as blocking issues

### 6. Docs Sync

- update `projects/<slug>/docs/visualization.md` with tool choice, scope, changes made, validation status, and remaining risks
- store screenshots, exports, and visualization artifacts in `projects/<slug>/docs/assets/`
- make explicit any data assumptions, path switches, or follow-up work

## Routing Rules

- if the project was already initialized, preserve the chosen visualization path from project docs unless the user asks to switch
- if the tool is missing or unclear:
  - prefer `Metabase` for general BI
  - prefer `Grafana` for operational or time-series asks
  - use `Apache Superset` only for existing Superset estates
- if the task is really data cleanup, schema repair, or dataset shaping, route backward to `$dv-data-preparation`
- if the task is deployment-readiness rather than dashboard construction, route forward to `$dv-publish`

## Collaboration Contract

This workflow coordinates:

- `$dv-data-preparation` to confirm the cleaned input surface
- `metabase` for the selected Metabase path
- `grafana` for the selected Grafana path
- `apache-superset` for the selected Superset path
- `test` after visualization changes are complete

## Completion Gate

Visualization work is complete only when:

- one selected dashboard path has been updated
- the prepared-data contract is still trusted
- validation has passed
- `projects/<slug>/docs/visualization.md` reflects the latest state
- output paths and unresolved questions are clear

---
name: dv-data-visualize
description: Visualization-build wrapper for Data Visualization Kit. Use when the user types `$dv-data-visualize`, needs to build or refresh charts, or needs to switch the selected open-source visualization path for an existing project.
license: MIT
argument-hint: "[goal / task / brief]"
metadata:
  author: data-visualization-kit
  version: "2.0.0"
---

# DV Data Visualize

Treat `$dv-data-visualize` as the canonical visualization entrypoint and the canonical visualization orchestration skill for Data Visualization Kit.

This is the main visualize skill. It owns the handoff from prepared data to dashboard delivery, keeps the project on one selected visualization path, and always validates the result after the visualization pass.

## Codex Adaptation

- Use this skill directly for `$dv-data-visualize`; keep the prompt and workflow files as thin runtime wrappers only.
- Follow `./.codex/workflows/data-visualize-workflow.md` as the runtime contract.
- Treat project docs as the first source of truth before building or refreshing visuals.
- Pull from `$dv-data-preparation` outputs before touching dashboard logic.
- Route to exactly one visualization domain skill for the current project:
  - `metabase`
  - `grafana`
  - `apache-superset`
- Run the `test` skill or project validation after visualization changes.

## Required Inputs

Before visualizing, gather the current project state from:

- `projects/<slug>/README.md`
- `projects/<slug>/docs/project-brief.md`
- `projects/<slug>/docs/project-plan.md`
- `projects/<slug>/docs/data-preparation.md`
- `projects/<slug>/docs/visualization.md`
- the current `$dv-data-visualize` brief

If these sources disagree, prefer the latest project docs and make the mismatch explicit in `visualization.md`.

## Working Order

1. Read project identity, business goal, and selected visualization path from project docs
2. Read the latest cleaned-data contract from `$dv-data-preparation`
3. Confirm the prepared dataset is trustworthy enough for visualization work
4. Choose exactly one visualization skill:
   - `metabase` for the default BI path
   - `grafana` for operational, observability, or time-series dashboards
   - `apache-superset` only for legacy projects that already selected Superset or when migration analysis is explicitly required
5. Build or refresh the dashboard on that selected path only
6. Update visualization notes, exports, and screenshot references under the project `docs/` tree
7. Run `test` or project validation after the visualization pass
8. Record remaining visualization risks, data assumptions, or follow-up work

## Routing Rules

- Do not mix multiple dashboard tools in one active project path unless the user explicitly changes the selected path
- If the project was already initialized, preserve the chosen tool from project docs unless the user asks to switch
- If the tool is missing or unclear:
  - prefer `Metabase` for general BI
  - prefer `Grafana` for operational or time-series asks
  - use `Apache Superset` only for existing Superset estates
- If cleaned data is not ready, route backward to `$dv-data-preparation` before continuing

## Collaboration Contract

`$dv-data-visualize` should coordinate these skills:

- `dv-data-preparation` to confirm the cleaned input surface
- `metabase` when the selected path is Metabase
- `grafana` when the selected path is Grafana
- `apache-superset` when the selected path is Superset
- `test` after visualization changes are complete

## Output Rules

- Keep project-scoped notes in `projects/<slug>/docs/`
- Keep screenshots, exports, and visualization artifacts in `projects/<slug>/docs/assets/`
- Keep `projects/<slug>/docs/visualization.md` as the canonical record of tool choice, dashboard scope, changes made, and validation status
- Keep the visualization layer aligned with one prepared-data contract and one selected dashboard tool

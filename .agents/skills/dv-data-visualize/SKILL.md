---
name: dv-data-visualize
description: Visualization-build wrapper for Data Visualization Kit. Use when the user types `$dv-data-visualize`, needs to build or refresh charts, or needs to switch the selected open-source visualization path for an existing project.
---

# DV Data Visualize

Treat `$dv-data-visualize` as the canonical visualization wrapper.

## Required Flow

1. Follow `./.codex/workflows/data-visualize-workflow.md` as the source of truth.
2. Stay on one selected visualization path for the current project.
3. Prefer `RAWGraphs` for free static publishing unless the project explicitly requires `Apache Superset`.
4. Keep visualization notes, exports, and change records under the project `docs/` tree.

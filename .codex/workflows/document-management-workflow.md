# Document Management Workflow

## Purpose

Authoritative workflow for project-scoped documentation management in Data Visualization Kit.
This workflow owns the creation, normalization, refresh, and summarization of project docs without allowing artifact sprawl outside the project docs tree.

## Workflow Contract

1. read the current project doc state
2. verify the active docs scope and mode
3. normalize documentation paths and boundaries
4. update or summarize only the project-scoped docs that need change
5. keep related assets inside the project docs tree
6. leave the project in a compact, current, and workflow-aligned doc state

## Core Rules

- treat `projects/<slug>/docs/` as the only valid home for project-specific documentation
- treat `projects/<slug>/docs/assets/` as the only valid home for project-specific assets
- prevent loose project artifacts under repo root, ad hoc sibling folders, or extra project-level doc trees
- update existing docs in place whenever possible instead of creating redundant alternates
- keep docs aligned with the latest trusted project state from `$dv-plan`, `$dv-cook`, `$dv-data-preparation`, `$dv-data-visualize`, `$dv-debug`, and `$dv-publish`
- prefer concise, project-specific documentation over generic explanation that does not move the project forward
- if the task is really implementation, debugging, or publishing work, route to the correct workflow instead of hiding the work inside docs management

## Required Inputs

Before document-management work starts, gather:

- `projects/<slug>/README.md`
- `projects/<slug>/docs/project-brief.md` if it exists
- `projects/<slug>/docs/project-plan.md` if it exists
- `projects/<slug>/docs/data-preparation.md` if it exists
- `projects/<slug>/docs/visualization.md` if it exists
- `projects/<slug>/docs/publish.md` if it exists
- `projects/<slug>/docs/debug-report.md` if it exists
- `projects/<slug>/docs/document-management.md` if it exists
- the current `$dv-document-management` brief and mode

If these sources disagree, prefer the latest trusted project docs and make the mismatch explicit in the updated doc output.

## Execution Stages

### 1. Project Read

- confirm project identity, current maturity, and whether the project docs tree already exists
- identify whether the request is `init`, `update`, or `summarize`
- read only the current docs needed for the requested scope instead of rewriting the entire tree blindly

### 2. Scope and Boundary Check

- verify the work belongs to docs management rather than implementation or debugging
- confirm all intended outputs stay under `projects/<slug>/docs/`
- treat loose files, duplicate docs, and off-path assets as cleanup targets

### 3. Docs Normalization

- normalize the project docs set so downstream workflows can find expected files in expected locations
- preserve useful existing content while removing redundant or confusing parallel versions
- keep naming, scope, and doc roles consistent with the active workflow contract

### 4. Targeted Update or Summary

- update the smallest correct set of docs for the requested scope
- refresh workflow notes, project state, summaries, and references so they match what the project actually contains
- use summarize mode only when the user explicitly wants a lighter signal pass

### 5. Asset Containment

- keep screenshots, exports, user files, and other supporting artifacts under `projects/<slug>/docs/assets/`
- move or reference assets in a way that reduces project sprawl instead of increasing it
- avoid introducing new top-level storage patterns unless the existing workflow contract requires them

### 6. Final Alignment Check

- verify docs now match the latest trusted project state
- make explicit any remaining assumptions, missing files, or unresolved doc mismatches
- leave the project ready for downstream workflows without extra guessing

## Routing Rules

- if the project does not exist yet, route back to `$dv-plan`
- if the task is intake or project framing, route to `$dv-plan`
- if the task is end-to-end execution rather than docs cleanup, route to `$dv-cook`
- if the task is data shaping, schema cleanup, or ingestion notes that require real data work, route to `$dv-data-preparation`
- if the task is dashboard construction, dashboard refresh, or visualization-path decisions, route to `$dv-data-visualize`
- if the task is deployment-readiness or release packaging, route to `$dv-publish`
- if the docs are stale because the project is broken or inconsistent, route to `$dv-debug`

## Collaboration Contract

This workflow coordinates:

- `$dv-plan` as the source of truth for the project brief and plan
- `$dv-cook` for overall execution state
- `$dv-data-preparation` for data contract and preparation notes
- `$dv-data-visualize` for visualization path, assets, and visualization state
- `$dv-debug` for failure analysis docs when execution is unstable
- `$dv-publish` for publish-facing docs and release readiness

## Completion Gate

Document-management work is complete only when:

- project docs are contained inside `projects/<slug>/docs/`
- project assets are contained inside `projects/<slug>/docs/assets/`
- the requested `init`, `update`, or `summarize` scope has been completed
- docs reflect the latest trusted workflow state
- redundant or confusing doc sprawl has been reduced rather than increased
- unresolved questions and mismatches are called out clearly


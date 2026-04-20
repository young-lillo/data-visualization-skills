# Cook Workflow

## Purpose

Authoritative workflow for end-to-end project execution in Data Visualization Kit.
This workflow owns the post-intake handoff from the approved project plan to preparation, visualization, validation, docs sync, and publish readiness.

## Workflow Contract

1. read the current project state and approved plan
2. verify the project is ready for post-intake execution
3. run `$dv-data-preparation` first
4. run `$dv-data-visualize` on top of the prepared-data contract
5. validate the full execution pass
6. sync project docs and outputs under the project docs tree
7. hand off the project to `$dv-publish`

## Core Rules

- require an existing project initialized by `$dv-plan`
- treat `projects/<slug>/docs/project-plan.md` as the canonical execution contract
- never skip `$dv-data-preparation` when the visualization layer depends on cleaned or reshaped data
- make `$dv-data-visualize` consume the latest trusted prepared-data output instead of raw source assumptions
- keep execution linear unless the current project docs explicitly prove a stage can be reused safely
- route backward when intake, data contract, or selected tool path is unclear
- keep all project notes, outputs, validation records, and assets under `projects/<slug>/docs/`

## Required Inputs

Before cook execution starts, gather:

- `projects/<slug>/README.md`
- `projects/<slug>/docs/project-brief.md`
- `projects/<slug>/docs/project-plan.md`
- `projects/<slug>/docs/data-preparation.md` if it already exists
- `projects/<slug>/docs/visualization.md` if it already exists
- `projects/<slug>/docs/publish.md` if it already exists
- the current `$dv-cook` brief

If these sources disagree, prefer the latest project docs and record the mismatch in the next updated downstream doc.

## Execution Stages

### 1. Project Read

- confirm slug, business context, target audience, delivery shape, and current project maturity
- read the approved plan and treat it as the source of execution order, scope, and success criteria
- stop and route back to `$dv-plan` if the project still lacks a trustworthy canonical plan

### 2. Readiness Check

- verify the project has enough intake context, dataset context, and goals to proceed without guessing
- confirm the selected framework and recommended delivery path are already captured in project docs
- identify whether this is a full first execution pass or a continuation pass with reusable outputs

### 3. Data Preparation

- run `$dv-data-preparation` first when prepared data is missing, stale, or no longer trusted
- make the preparation stage produce a clean contract that downstream visualization work can depend on
- treat schema ambiguity, metric ambiguity, and key/grain ambiguity as blocking issues

### 4. Visualization

- run `$dv-data-visualize` only after the prepared-data contract is trustworthy enough
- preserve the selected visualization path from project docs unless the user explicitly changes scope
- keep visualization aligned to the active project plan, not to ad hoc chart ideas
- **the dashboard output must be a live, interactive UI** — not a static HTML export or screenshot

### 4.5. Local Deploy

After visualization completes, start the selected tool locally so the user can test it immediately:

- read the selected tool from `projects/<slug>/docs/visualization.md`
- **Evidence**: run `npm install && npm run dev` inside `projects/<slug>/evidence/` → live at http://localhost:3000
- **Metabase**: run `docker compose up -d` inside `projects/<slug>/` → live at http://localhost:3000
- **Grafana**: run `docker compose up -d` inside `projects/<slug>/` → live at http://localhost:3000
- confirm the server starts without errors
- report the local URL to the user so they can open and interact with the dashboard

### 5. Validation

- run the `test` skill or project validator after the execution pass materially changes outputs
- verify the prepared-data contract, dashboard behavior, and delivery intent still agree
- treat failed checks, broken queries, missing assets, and plan drift as blocking issues
- **tool-aware deploy check**: confirm the selected dashboard is reachable at its local URL
  - Evidence: `http://localhost:3000` responds via `npm run dev`
  - Metabase: Docker container is running and Metabase UI is reachable
  - Grafana: Docker container is running and Grafana UI is reachable
- report the live URL to the user as part of validation output

### 6. Docs Sync

- update project docs so downstream skills do not need to infer current state
- ensure data-preparation, visualization, and publish-facing notes reflect what was actually executed
- keep supporting artifacts, exports, and screenshots under `projects/<slug>/docs/assets/`

### 7. Publish Handoff

- hand the project to `$dv-publish` only when the core execution pass is stable
- make explicit what is ready, what remains optional, and what risks still need user attention
- avoid presenting the project as publish-ready when validation or docs sync is incomplete

## Routing Rules

- if the project does not exist yet, route back to `$dv-plan`
- if the task is only data cleanup, schema shaping, or ingestion repair, route to `$dv-data-preparation`
- if the task is only dashboard construction or dashboard refresh, route to `$dv-data-visualize`
- if the task is deployment-readiness, git-readiness, or release packaging, route forward to `$dv-publish`
- if execution fails because the current state is inconsistent, route to `$dv-debug`

## Collaboration Contract

This workflow coordinates:

- `$dv-plan` as the intake and planning source of truth
- `$dv-data-preparation` for the cleaned data contract
- `$dv-data-visualize` for the selected dashboard path
- `test` for execution validation
- `$dv-document-management` when docs need targeted cleanup or restructuring
- `$dv-publish` for final release and deployment readiness

## Completion Gate

Cook execution is complete only when:

- the project was executed from an approved plan rather than guessed scope
- the prepared-data contract is current and trusted
- the visualization pass reflects the prepared-data contract
- the dashboard is running locally as a live interactive UI (not a static file)
- the user has been given the local URL to test the dashboard
- validation has passed or remaining blockers are made explicit
- project docs reflect the latest execution state
- the project is ready for `$dv-publish` with unresolved questions called out clearly

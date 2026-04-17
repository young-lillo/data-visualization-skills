# Data Visualization Kit

Workflow-first open-source kit for Codex agents. User clones the repo, runs a `$dv-*` entrypoint, and gets or updates a project workspace under `projects/<project-slug>/`.

## What It Does

- accepts `$dv-<workflow> <goal / task / brief>`
- routes each request to one owner workflow
- enforces mandatory hooks before deep execution
- prepares docs-centric project workspaces
- supports data preparation, visualization, publish, debug, and docs workflows

## Why This Shape

- orchestration lives in workflows, not prompts
- hooks block invalid runtime states before execution
- agents are scoped executors
- project artifacts stay compact under `projects/<slug>/docs/`

## Runtime Contract

- `npm run dv -- $dv-primary ...` runs repo-root preflight before workflow routing.
- Non-interactive runs must provide `--project-context`, `--project-dataset`, and `--project-goals`; otherwise the CLI fails fast instead of guessing.
- Hook gates are stage-triggered hard stops: `run-workflow-preflight` before routing, `workflow-routing-gate` after request normalization and intake resolution, `project-preflight` and `docs-output-gate` before writes, `privacy-block` before sensitive-file access, `provider-key-gate` before provider-dependent actions, and `subagent-init` before Codex handoff.
- `npm run smoke` creates a disposable sample project, validates the generated output contract, then removes it.

## Quick Start

```bash
npm run dv -- '$dv-help'
npm run dv -- '$dv-primary'
```

## Update

Use this after cloning from a git remote with `origin` configured.

```bash
npm run kit:update
npm run kit:update:reset
```

- `npm run kit:update` updates the core kit safely and preserves `projects/` user content
- `npm run kit:update:reset` discards local core-kit changes and syncs to `origin/<current-branch>`, while still restoring `projects/`
- both commands preserve everything inside `projects/` except `projects/README.md`, which stays core-kit owned

Non-interactive example:

```bash
npm run dv -- '$dv-primary' --slug ecommerce-churn-portfolio --project-context "E-commerce retention project" --project-dataset "Orders, customers, tickets" --project-goals "Show churn insights and technical workflow"
```

## Commands

- `npm run dv -- '$dv-help'`
- `npm run dv -- '$dv-primary'`
- `npm run dv -- '$dv-data-preparation' --slug <project-slug> --brief "<task>"`
- `npm run dv -- '$dv-data-visualize' --slug <project-slug> --brief "<task>"`
- `npm run dv -- '$dv-publish' --slug <project-slug> --brief "<task>"`
- `npm run dv -- '$dv-debug' --slug <project-slug> --brief "<task>"`
- `npm run dv -- '$dv-document-management' --slug <project-slug> --brief "<task>"`
- `npm run dv -- '$dv-orchestration'`
- `npm run dv -- '$dv-hook-workflow'`
- `npm run smoke`
- `npm test`

## Generated Project Structure

```text
projects/<project-slug>/
  README.md
  .gitignore
  docs/
    project-brief.md
    project-plan.md
    data-preparation.md
    visualization.md
    publish.md
    debug-report.md
    design-guidelines.md
    document-management.md
    assets/
```

## Deploy Guidance

- `RAWGraphs` is the free-deploy default because it fits static portfolio publishing better
- `Apache Superset` stays available for BI-style dashboards, but not as the recommended Netlify Free path

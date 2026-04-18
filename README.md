# Data Visualization Kit - The Workflow-First Portfolio Kit for Codex

<p align="center">
  <img src="https://img.shields.io/badge/Data%20Visualization-Kit-111827?style=for-the-badge&logo=openai&logoColor=white" alt="Data Visualization Kit" />
  <img src="https://img.shields.io/badge/Runtime-Codex%20Agents-0f172a?style=for-the-badge" alt="Codex Agents" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Commands-10-0ea5e9" alt="Commands" />
  <img src="https://img.shields.io/badge/Project%20Outputs-docs%2Dcentric-22c55e" alt="Docs Centric Outputs" />
  <img src="https://img.shields.io/badge/Default%20Deploy-RAWGraphs-f59e0b" alt="RAWGraphs" />
  <img src="https://img.shields.io/badge/License-MIT-black" alt="MIT License" />
</p>

Data Visualization Kit helps you build portfolio-grade data visualization projects with Codex in a more structured way.
Instead of starting from a blank chat each time, you get a workflow-first kit that routes requests, prepares project workspaces, and keeps each project organized under its own folder.

## What Is This?

Data Visualization Kit is a workflow-first kit for people who want professional data portfolio output from Codex without improvising the process every time.

It gives you:
- canonical `$dv` and `$dv-*` skills/prompts for project intake, end-to-end execution, data preparation, visualization, publish, debug, docs management, and runtime help
- project workspaces under `projects/<project-slug>/`
- a docs-centric project contract so each project keeps its own brief, plan, exports, and notes
- a safer update path that preserves local `projects/` content

Whether you are building a portfolio for analytics, BI, product, marketing, or domain storytelling, this kit gives Codex a cleaner operating shape.

## Any CLI

### Install

Use this when you want to work from terminal in a normal local git clone.

```bash
git clone https://github.com/young-lillo/data-visualization-skills.git
cd data-visualization-skills
codex
```

This repo currently runs as a local kit.
It does not publish a separate global `codexkit`-style installer package.

### Update

```bash
npm run kit:update
npm run kit:update:reset
```

- `npm run kit:update` updates the core kit safely
- `npm run kit:update:reset` discards local core-kit changes and syncs to `origin/<current-branch>`
- both commands preserve everything inside `projects/` except `projects/README.md`

## Codex App

### Install

Use this when you want to work directly inside Codex App.

1. Open Codex App.
2. Click `Open in Terminal`.
3. Move to the folder where you want to install the kit.

```bash
cd <folder-where-you-want-to-install-the-kit>
```

4. Clone the repo.

```bash
git clone https://github.com/young-lillo/data-visualization-skills.git
```

5. Wait for clone to finish.
6. In Codex App, open the cloned folder.
7. Start working from there.

### Update

Use this if you installed through Codex App.

```bash
npm run kit:update
npm run kit:update:reset
```

## How to Use

Data Visualization Kit is workflow-first, but the surface stays simple.
Use the workflow pattern below when you already know the job:

```text
$dv-<workflow> <goal / task / brief>
```

If you do not know where to start, begin with:

```text
$dv
$dv-help
$dv-primary
```

### Quick Start

1. Ask for the command surface:

```text
$dv
$dv-help
```

2. Start with the main project conductor when the ask is broad:

```text
$dv-primary Build a churn-analysis portfolio project for an e-commerce dataset
```

3. After intake is complete, run the full project workflow:

```text
$dv-cook --slug churn-analysis --brief "Build the full project from the approved intake"
```

4. Move to a specialist workflow when the job is already clear:

```text
$dv-data-visualize Rebuild visuals after source schema changed
```

### The Workflow Roster

| Workflow | Command | Best for |
|---|---|---|
| Front Desk | `$dv-help` | Learn the kit fast and find the right starting point |
| Project Conductor | `$dv-primary` | Start a project from context, dataset, and goals |
| Cook Desk | `$dv-cook` | Execute the full post-intake workflow for an existing project |
| Data Preparation Desk | `$dv-data-preparation` | Ingest, clean, validate, and transform data |
| Visualization Desk | `$dv-data-visualize` | Build or refresh visual outputs |
| Publish Desk | `$dv-publish` | Make the project git-ready and deployable |
| Debug Desk | `$dv-debug` | Diagnose failures in preparation, visualize, or publish flow |
| Docs Desk | `$dv-document-management` | Keep project docs and assets compact and in the right place |
| Orchestration Desk | `$dv-orchestration` | Inspect the agent-coordination workflow |
| Hook Desk | `$dv-hook-workflow` | Inspect the runtime hook contract |

### Natural Language

You do not have to memorize commands.
You can describe the project goal in normal language, and the runtime can normalize broad asks into the primary workflow.

Examples:

```text
Build a customer churn portfolio project for e-commerce.
Prepare a marketing dataset for dashboard-ready visualization.
Refresh our visuals after the source schema changed.
Make this project ready for git and deploy.
```

## Real-World Use Cases

### Start a New Portfolio Project

Turn a broad business question into a structured data project workspace.

```text
$dv-primary Build a portfolio project for customer churn analysis
```

### Prepare Messy Data

Ingest and clean source data before visualization work begins.

```text
$dv-data-preparation Clean order, customer, and support data into chart-ready tables
```

### Cook the Full Project

Run the full post-intake project workflow after `$dv-primary` has already captured context, dataset, and goals.

```text
$dv-cook --slug customer-churn-analysis --brief "Execute the full portfolio workflow from the approved intake"
```

### Refresh Visual Outputs

Update charts and exports after a schema or business change.

```text
$dv-data-visualize Rebuild visuals after source schema changed
```

### Publish the Project

Finish the project so it is ready to share and deploy.

```text
$dv-publish Make this project git-ready and deployable
```

### Debug the Workflow

Find failures without manually retracing every step.

```text
$dv-debug Find why RAWGraphs export is failing
```

## Runtime Contract

- `npm run dv -- '$dv-primary' ...` runs repo-root preflight before workflow routing
- non-interactive runs must provide `--project-context`, `--project-dataset`, and `--project-goals`
- hook gates stop execution when runtime state is invalid
- generated project outputs stay under `projects/<project-slug>/docs/`
- `npm run smoke` creates a disposable sample project, validates it, then removes it

## Commands

```text
$dv
$dv-help
$dv-primary
$dv-cook
$dv-data-preparation
$dv-data-visualize
$dv-publish
$dv-debug
$dv-document-management
$dv-orchestration
$dv-hook-workflow
```

Equivalent local commands:

```bash
npm run dv -- '$dv'
npm run dv -- '$dv-help'
npm run dv -- '$dv-primary'
npm run dv -- '$dv-cook' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-data-preparation' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-data-visualize' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-publish' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-debug' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-document-management' --slug <project-slug> --brief "<task>"
npm run dv -- '$dv-orchestration'
npm run dv -- '$dv-hook-workflow'
```

## Project Workspaces

Live project work is organized per project:

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

The root repo stays the core kit.
Each generated project keeps its own working context under `projects/`.

## Deploy Guidance

- `RAWGraphs` is the free-deploy default because it maps better to static portfolio publishing
- `Apache Superset` stays available for BI-style dashboards, but it is not the preferred free-host path

## License

This project is licensed under the MIT License.
See [LICENSE](./LICENSE).

## The Point

Data Visualization Kit is meant to feel less like one generic assistant and more like a practical project kit inside Codex.

One moment you need intake.
Then data cleanup.
Then visualization.
Then publish preparation.

That is the point of the kit.
You bring the context, dataset, and goals.
The kit gives Codex a cleaner system for getting the project done.

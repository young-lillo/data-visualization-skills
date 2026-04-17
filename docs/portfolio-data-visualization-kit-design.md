# Data Visualization Kit Design

## Overview

This document supersedes the earlier single-workflow portfolio-kit design.

The kit must become a workflow-first runtime for Codex agents with this shape:

```text
user
  -> $dv-<workflow> <goal / task / brief>
  -> prompt entrypoint
  -> hook layer
  -> workflow
  -> agent(s)
  -> skill(s)
  -> project workspace outputs
```

Core rule:

```text
entrypoints -> hooks -> workflows -> agents -> skills -> outputs
```

## Core Intent

Build an open-source kit that users can clone and use to create professional data-visualization portfolio projects.

The kit must:
- support Codex-agent orchestration
- keep routing predictable
- keep runtime safety explicit
- keep project docs compact
- keep project outputs inside one project workspace

The kit must not:
- let prompts own orchestration
- let skills become routers
- scatter project docs across many folders

## Command Surface

The public command surface must use:

```text
$dv-<workflow> <goal / task / brief>
```

Examples:
- `$dv-primary Build a portfolio project for customer churn analysis`
- `$dv-data-preparation Load CSV, clean nulls, and derive chart-ready tables`
- `$dv-data-visualize Rebuild visuals after source schema changed`
- `$dv-publish Make this project git-ready and deployable`
- `$dv-debug Find why RAWGraphs export is failing`
- `$dv-document-management Sync all project docs into docs/`
- `$dv-hook-workflow`
- `$dv-help`

Natural-language requests may still be accepted, but they must be normalized into one owner workflow before deep execution.

## Runtime Shape

```text
User request
-> Prompt entrypoint
-> Hook workflow
-> Owner workflow
-> Scoped agent delegation
-> Stage-specific skills
-> Project workspace docs output
```

## Workspace Contract

All project-specific docs, plan material, and user assets must be kept inside:

```text
projects/<project-slug>/docs/
```

Project workspace shape should stay compact:

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
    assets/
      screenshots/
      user-files/
      exports/
```

Rules:
- do not create `plans/` in project workspaces
- do not create `assets/` in project root for project-specific files
- all plans and user assets for a project live under that project's `docs/`
- root `docs/` remains template and kit-reference space only

## Workflow Set

Only these workflows should exist.

### 1. Primary

Purpose:
- main project lifecycle workflow
- owns intake, project steps, delegation, quality gates, finalize

Responsibilities:
- normalize request
- ensure project context exists
- call planner
- delegate to domain workflows
- coordinate quality gate and finalize

Use when:
- user starts a new project
- user gives broad natural-language project brief
- request spans multiple workflow areas

### 2. Data Preparation

Purpose:
- ingestion and transformation workflow

Responsibilities:
- collect data from files, DBs, APIs, or other sources
- validate shape and data quality
- clean and transform data
- prepare data aligned to goals for visualization

Output:
- data-preparation docs and prepared-data notes in `projects/<slug>/docs/`

### 3. Data Visualize

Purpose:
- build and update visualizations

Responsibilities:
- create visual outputs using selected open-source tool
- update visuals when source changes
- keep visualization aligned with chosen goals and publish target

Output:
- visualization docs, screenshots, export notes in `projects/<slug>/docs/`

### 4. Publish

Purpose:
- finish the project for git and deployment

Responsibilities:
- make project git-ready
- prepare freehost or self-hosted deploy path
- ensure docs are complete for sharing

Output:
- publish checklist and deployment notes in `projects/<slug>/docs/`

### 5. Debug

Purpose:
- diagnose and resolve broken visualization flows

Responsibilities:
- investigate failures in preparation, visualization, or publish steps
- isolate root cause
- document fixes and remaining issues

Output:
- debug report in `projects/<slug>/docs/`

### 6. Document Management

Purpose:
- manage all docs and assets from user work

Responsibilities:
- keep docs organized
- store plans, notes, screenshots, and user assets under `projects/<slug>/docs/`
- prevent path sprawl

Output:
- compact project doc structure only

### 7. Help

Purpose:
- onboarding and usage guidance

Responsibilities:
- explain what the kit does
- explain workflows, commands, and examples
- point users to the right workflow

This workflow can later be simplified into a help skill if needed.

### 8. Orchestration

Purpose:
- define safe and predictable `spawn_agent` coordination

Responsibilities:
- sequential chaining rules
- parallel delegation rules
- ownership boundaries
- merge order
- final reviewer rules

This is an internal operating workflow, not a user-facing business workflow.

### 9. Hook Workflow

Purpose:
- define the mandatory runtime hook layer for kit execution

Responsibilities:
- specify which hooks run before which workflow stages
- define stop behavior
- define context injection rules

This is also an internal runtime workflow.

## Hook Layer

Hooks are mandatory runtime gates. They must never contain business orchestration.

### Required hooks

#### `run-workflow-preflight`

Use:
- before any workflow routing

Checks:
- repo root
- required runtime files
- active project context availability

#### `workflow-routing-gate`

Use:
- after request normalization

Checks:
- command format matches `$dv-<workflow> <brief>`
- natural-language request resolved to one owner workflow

#### `project-preflight`

Use:
- before any workflow writes project output

Checks:
- project slug
- project workspace existence
- target workspace stays valid before the generator or updater materializes docs paths
- target path stays in project workspace

#### `subagent-init`

Use:
- before any spawned agent starts

Injects:
- work context
- docs path
- naming rules
- constraints
- output contract

#### `privacy-block`

Use:
- before accessing `.env`, secrets, auth files, tokens, credentials

Behavior:
- block unless explicitly approved by runtime policy

#### `provider-key-gate`

Use:
- before any API/database/provider-dependent action

Behavior:
- fail closed if required provider keys are missing

#### `docs-output-gate`

Use:
- before writing project docs or user assets

Behavior:
- enforce all project docs/assets go to `projects/<slug>/docs/`
- block writes to ad hoc `plans/` or `assets/` inside project workspace

## Agent Set

The runtime should use these agents.

### Planner

Role:
- gather user context
- clarify goals
- write the project plan

Use when:
- project starts
- scope is unclear
- goals changed

### Database

Role:
- retrieve datasets from files, DBs, APIs, and other sources
- validate, clean, and transform data

Use when:
- `data-preparation` runs

### Visualize

Role:
- build visuals with the selected open-source tool
- support deploy to freehost or self-hosted path

Use when:
- `data-visualize` runs
- source changes require chart rebuild

### Debug

Role:
- diagnose failures
- prove root cause
- propose or implement fix path

Use when:
- `debug` runs
- any domain workflow fails

### Tester

Role:
- verify output quality after work is done

Use when:
- after preparation
- after visualization
- before publish finalize

### code-simplifier

Role:
- simplify implementation while preserving behavior

Use when:
- after code changes
- before final test/review

### git-manager

Role:
- stage, commit, push

Use when:
- publish workflow reaches git stage

### mcp-manager

Role:
- manage MCP-based integrations and discovery

Use when:
- workflow needs MCP tools, prompts, or external resources

### ui-ux-designer

Role:
- improve portfolio UX/UI quality
- polish presentation layer

Use when:
- visuals need portfolio-grade presentation
- user asks for UX/UI refinement

## Skill Set

The runtime should keep the skill set intentionally small and purpose-based.

### Core design and UI skills

- `ui-ux-pro-max` — design intelligence database, always first for UI work
- `frontend-design` — screenshot analysis and design replication
- `web-design-guidelines` — web design best practices
- `react-best-practices` — React patterns
- `web-frameworks` — Next.js, Remix, Turborepo guidance
- `ui-styling` — shadcn/ui and Tailwind support

### Planning and debugging skills

- `plan` — planning skill for planner agent
- `debug` — structured debugging support

### Visualization skills

- `Apache Superset` — Superset-specific workflow support
- `RAWGraphs` — RAWGraphs-specific workflow support

## Layer Relationship Model

```text
Entry points choose workflow
Hooks validate and inject runtime context
Workflow owns orchestration
Workflow delegates scoped work to agents
Agents activate only the skills needed for their stage
Outputs go only to the project workspace docs area
```

More explicitly:

```text
workflow -> chooses agents
hook -> gates workflow and agent execution
agent -> executes scoped stage
skill -> supports agent execution
```

Rules:
- agents do not invent routing trees
- skills do not route
- hooks do not own business logic
- one request has one owner workflow

## Orchestration Rules

### Sequential chaining

Default mode. Use when outputs depend on earlier steps.

Typical project chain:
- `planner`
- `database`
- `visualize`
- `ui-ux-designer` if needed
- `tester`
- `git-manager`

### Parallel execution

Allowed only when:
- ownership boundaries are explicit
- outputs do not overlap
- integration order is defined
- final reviewer is defined

Good examples:
- `database` profile task and docs drafting in parallel if write paths differ
- `visualize` and `ui-ux-designer` only after data-preparation outputs are fixed and file ownership is split

## Quality Gates

A project step is complete only when:
- owner workflow stage completed
- required hooks passed
- required docs written into `projects/<slug>/docs/`
- tester or debug gate passed when applicable
- unresolved questions listed at end

## Risks To Avoid

- putting orchestration logic in prompts
- allowing multiple workflows to co-own one request
- letting skills behave like workflows
- storing project artifacts outside `projects/<slug>/docs/`
- continuing after a hook blocks
- spawning agents without `subagent-init` context

## Success Criteria

- user can call `$dv-<workflow> <brief>`
- runtime resolves one owner workflow
- hooks run before sensitive or stateful execution
- agents are used as scoped executors
- skills are activated only as needed
- all project outputs are compact and live in `projects/<slug>/docs/`
- project workspace is ready for git and deployment after publish

## References

- [KIT-ARCHITECTURE.md](../KIT-ARCHITECTURE.md)
- Apache Superset: https://superset.apache.org/
- RAWGraphs: https://www.rawgraphs.io/

## Unresolved Questions

- Should `Help` stay a workflow in v1, or collapse into an entrypoint + skill?
- Should `Document Management` run automatically after every domain workflow, or only when docs drift is detected?

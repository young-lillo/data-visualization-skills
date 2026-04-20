# Primary Workflow

## Purpose

Authoritative workflow for the kit.
Every runtime request passes through this workflow contract before any specialist workflow owns execution.

## Workflow Contract

1. normalize the request
2. run the mandatory hook layer
3. resolve the owner workflow
4. create or refresh the execution plan
5. delegate to exactly one primary owner workflow at a time
6. enforce validation, docs, and output gates
7. finalize a publish-ready output or a focused workflow report

## Core Rules

- every request starts here, including direct specialist commands
- broad asks route to `$dv-plan`; explicit specialist asks still do not skip hooks
- one request has one owner workflow and one clear next step
- all project work stays inside `projects/<project-slug>/`
- all project docs and generated assets stay inside `projects/<project-slug>/docs/`
- visualization work must consume the prepared-data contract from `$dv-data-preparation`
- publish never starts until the owner workflow reports a stable, validated state
- if a hook blocks, execution stops immediately

## Intake And Routing

### 1. Request Normalization

- accept canonical commands such as `$dv-plan`, `$dv-cook`, `$dv-data-preparation`, `$dv-data-visualize`, `$dv-publish`, `$dv-debug`, and `$dv-document-management`
- accept natural-language asks and normalize them into the closest canonical workflow
- resolve project slug, project context, dataset scope, and goals before execution continues

### 2. Planning

- use `planner` first when the task needs implementation, project setup, or a multi-step change
- use parallel `researcher` agents during planning when the technical surface is broad or uncertain
- produce a concrete TODO-oriented plan before downstream implementation work starts
- keep the plan aligned with the selected owner workflow and active project workspace

### 3. Owner Workflow Resolution

- route end-to-end execution to `cook`
- route ingestion, cleaning, shaping, and validation to `data-preparation`
- route dashboard construction and refresh work to `data-visualize`
- route deployment-readiness and git-readiness to `publish`
- route failures and regressions to `debug`
- route project docs cleanup and sync work to `document-management`

## Mandatory Hook Layer

This hook layer is part of the primary workflow, not a separate optional stage.
Use `.codex/workflows/hook-runtime-contract.md` as the low-level hook reference.
Do not expose a separate hook-only workflow command.

### Hook Responsibilities

- run preflight hooks before routing
- run user-prompt hooks after CLI parse and before workflow routing
- run routing gate after request normalization and intake resolution
- run project and output gates before writes
- run privacy and provider gates only when a workflow reaches sensitive or provider-backed work
- inject subagent context before spawned agents start
- stop execution immediately when a hook blocks

### Required Hooks

- `run-workflow-preflight`
- `user-prompt-submit`
- `usage-context-awareness`
- `workflow-routing-gate`
- `plan-intake-validation` *(plan workflow only — confirms framework, goal tier, and tool with user)*
- `project-preflight`
- `subagent-init`
- `privacy-block`
- `provider-key-gate`
- `docs-output-gate`

### Hook Activation Notes

- `run-workflow-preflight` runs before routing
- `user-prompt-submit` runs after CLI parse and before workflow routing
- `usage-context-awareness` runs during intake and refreshes downstream context metadata
- `workflow-routing-gate` runs after normalization and intake resolution
- `project-preflight` runs before workflow writes inside the project workspace
- `docs-output-gate` runs before docs or asset writes inside `projects/<project-slug>/docs/`
- `privacy-block` runs only before sensitive-file access
- `provider-key-gate` runs only before provider-backed actions
- `subagent-init` runs only when the runtime is ready to hand off scoped context

## Execution Stages

### 1. Implementation

- follow the approved plan
- update existing files directly instead of creating parallel "enhanced" variants
- keep work aligned with established architecture and selected visualization path
- run compile or validation commands after modifying code or runtime files

### 2. Testing

- delegate validation to `tester` after the implementation step stabilizes
- do not ignore failing tests, smoke checks, or workflow validation just to finish
- fix failures, rerun validation, and only proceed when the owner workflow is stable

### 3. Review And Integration

- run `code-reviewer` after tests pass
- keep behavior consistent with the selected workflow contract and project docs
- sync docs when implementation changes workflow behavior, outputs, or project state

### 4. Debugging

- use `debugger` when runtime hooks, tests, or workflow stages fail
- identify root cause first, then patch the owner workflow or implementation layer
- rerun the affected validation path before returning control

## Completion Gate

The task is complete only when:

- the selected owner workflow finished its responsibilities
- required project docs exist and are updated in the project workspace
- required validation or smoke checks pass
- outputs are in the correct project paths
- the final handoff states changed files, output paths, and unresolved questions if any

## Delegation Map

- `cook`
- `data-preparation`
- `data-visualize`
- `publish`
- `debug`
- `document-management`

# System Architecture

## Runtime Flow

```text
User request
-> scripts/run-kit.cjs
-> run-workflow-preflight
-> route normalization
-> owner workflow intake
-> workflow-routing-gate
-> stage hooks
-> agent-ready runtime stages
-> project generator or project doc updater
-> validateGeneratedProject
-> subagent-init
-> outputs in projects/<project-slug>/docs/
```

## Repo Zones

- `.codex/`: prompts, workflows, agent contracts
- `.agents/skills/`: reusable support skills for Codex execution
- `scripts/hooks/`: runtime gates
- `scripts/lib/`: Node runtime implementation
- `projects/`: generated portfolio workspaces

## Workflow Family

- `primary`
- `data-preparation`
- `data-visualize`
- `publish`
- `debug`
- `document-management`
- `help`
- `orchestration`
- `hook workflow`

## Runtime Contract

- `run-workflow-preflight` resolves the repo root before any routing
- `workflow-routing-gate` validates the resolved `$dv-*` workflow after request normalization and intake resolution
- `project-preflight` blocks invalid target paths and duplicate collisions unless force is enabled
- `privacy-block` stops sensitive file access when a workflow reaches secret-bearing paths
- `provider-key-gate` stops provider-dependent work when a workflow reaches provider-backed actions without required keys
- `docs-output-gate` enforces `projects/<slug>/docs/` as the project artifact root
- `subagent-init` returns stable `workContext`, `docsPath`, `reportsPath`, `plansPath`, and `naming`
- `validateGeneratedProject` enforces the docs-centric project contract and backs smoke validation

## Key Decisions

- one owner workflow per request
- minimal skill activation
- project outputs are compact and docs-centric
- hooks stop execution on invalid state

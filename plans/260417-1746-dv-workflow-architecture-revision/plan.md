---
status: completed
created: 2026-04-17
owner: codex
slug: dv-workflow-architecture-revision
---

# DV Workflow Architecture Revision Plan

## Overview

Refactor the current kit from the existing `kit/portfolio/help` shape into the new `$dv-<workflow> <goal / task / brief>` runtime shape.

This revision must replace the current single-owner portfolio runtime with a workflow family:
- primary
- data-preparation
- data-visualize
- publish
- debug
- document-management
- help
- orchestration
- hook workflow

Primary constraints:
- follow [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)
- entrypoints route before deep execution
- hooks remain mandatory runtime gates
- all project-specific docs and assets must live in `projects/<slug>/docs/`
- no `plans/` or `assets/` directories inside project workspaces
- agents become runtime-scoped executors, not only design-time contracts

## Phases

| Phase | Status | Goal |
|---|---|---|
| [Phase 01](phase-01-redefine-runtime-surface.md) | completed | Replace the command surface and routing model with `$dv-*` entrypoints |
| [Phase 02](phase-02-build-workflow-family.md) | completed | Implement the new workflow family and owner-workflow routing |
| [Phase 03](phase-03-rebuild-hook-layer.md) | completed | Expand and harden the hook layer around the new workflow contracts |
| [Phase 04](phase-04-upgrade-agent-runtime.md) | completed | Replace current agent contracts with the new planner/database/visualize/debug/tester stack |
| [Phase 05](phase-05-restructure-project-workspace.md) | completed | Collapse project outputs into `projects/<slug>/docs/` and remove project `plans/assets` folders |
| [Phase 06](phase-06-skills-integration-and-quality-gates.md) | completed | Wire the new skill set, validation rules, docs, and migration guidance |

## Key Decisions

- command pattern becomes `$dv-<workflow> <brief>`
- one request has one owner workflow
- `primary` becomes project conductor
- `orchestration` and `hook workflow` become internal runtime control layers
- project docs, plans, and user assets are consolidated under `projects/<slug>/docs/`
- agents must be spawn-ready and receive `subagent-init` context

## Dependencies

- Phase 01 before all others
- Phase 02 depends on Phase 01
- Phase 03 depends on Phase 01 and Phase 02
- Phase 04 depends on Phase 02 and Phase 03
- Phase 05 depends on Phase 02 through Phase 04
- Phase 06 depends on all previous phases

## Success Criteria

- runtime accepts `$dv-*` commands
- workflows match the new family exactly
- hook layer blocks invalid runtime states
- agents match the requested set
- skill references align with the new agent roles
- project workspaces contain only compact `docs/`-centric outputs
- migration path from the old runtime is documented

## Implementation Order

1. replace entrypoints and routing
2. define the new workflow family
3. implement the hook workflow and gates
4. rebuild the agent layer
5. rewrite workspace output logic
6. wire skills, tests, and migration docs

## Notes

- runtime refactor and sample project regeneration are complete
- docs must stay aligned with the `$dv-document-management` and `$dv-hook-workflow` command names
- final validation passed with `npm test` and `npm run smoke`
- regression fixes covered first-run project creation, non-TTY fail-fast, privacy-hook scope, and help/runtime contract drift

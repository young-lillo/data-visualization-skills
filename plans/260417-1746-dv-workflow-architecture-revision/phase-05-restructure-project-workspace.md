# Phase 05 Restructure Project Workspace

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: high
- Status: completed
- Goal: collapse project-specific docs, plan material, and user assets into `projects/<slug>/docs/`

## Key Insights

- the current runtime writes `plans/` and `assets/` inside each project workspace
- the revised architecture wants a compact docs-only project structure
- migration must be careful because existing sample projects use the old structure

## Requirements

- generated project workspace uses `docs/` as the single artifact root
- all plan content moves into docs markdown
- all screenshots, exports, and user-provided files move into `docs/assets/`
- remove project-level `plans/` and `assets/`

## Architecture

Target shape:
- `README.md`
- `.gitignore`
- `docs/project-brief.md`
- `docs/project-plan.md`
- `docs/data-preparation.md`
- `docs/visualization.md`
- `docs/publish.md`
- `docs/debug-report.md`
- `docs/assets/`

## Related Code Files

- Files to modify: generator, validator, docs templates
- Files to create: new compact project templates
- Files to delete: old project `plans/` and `assets/` templates

## Implementation Steps

1. redesign project generator templates
2. update validator to the docs-only contract
3. regenerate sample projects
4. document migration for previously generated project workspaces

## Todo List

- [x] redesign generator templates
- [x] remove project `plans/` output
- [x] remove project `assets/` output
- [x] update validator and smoke tests

## Success Criteria

- project workspaces are compact
- all project-specific docs and user assets live under `docs/`
- no ad hoc artifact folders are created

## Risk Assessment

- risk: old generated projects break tests or demos
- mitigation: regenerate sample projects and document migration

## Security Considerations

- docs-only output path still needs privacy and output gates

## Next Steps

- unblock skill wiring and final validation in Phase 06

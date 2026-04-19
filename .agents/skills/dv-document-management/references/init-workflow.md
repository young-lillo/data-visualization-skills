# Init Workflow

## Purpose

Create or normalize the initial project docs set inside `projects/<slug>/docs/`.

## Phase 1: Workspace Scan

1. Read the active project `docs/` tree and project `README.md` when present
2. Check which canonical docs already exist
3. Scan only relevant project files and generated artifacts needed to explain current state
4. Prefer targeted discovery with `rg` or direct file reads instead of broad full-repo scans

## Phase 2: Normalize the Canonical Docs Set

Create or refresh the minimum correct set:
- `project-brief.md`
- `project-plan.md`
- `data-preparation.md`
- `visualization.md`
- `publish.md`
- `debug-report.md`
- `design-guidelines.md`
- `document-management.md`
- `assets/` subfolders as needed

## Phase 3: Quality Check

1. Confirm docs stay inside `projects/<slug>/docs/`
2. Remove or avoid duplicate plan or asset folders outside `docs/`
3. Keep the initial docs concise and project-specific
4. Flag any missing information that still blocks high-confidence docs

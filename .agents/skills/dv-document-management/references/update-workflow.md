# Update Workflow

## Purpose

Refresh existing project docs after workflow, code, data, or output changes.

## Phase 1: Read Current Docs State

1. Read the docs files that are directly affected by the user request
2. Identify stale sections, missing links between workflow docs, and misplaced assets
3. Prefer targeted reading over full-tree rereads when the scope is already clear

## Phase 2: Read Project and Workflow Context

1. Inspect the relevant project outputs and workflow notes
2. Read only the code or generated files needed to prove the docs change
3. If the update depends on architecture or routing behavior, read the matching workflow contracts and runtime files

## Phase 3: Update in Place

Update only the files that need change:
- `project-brief.md`
- `project-plan.md`
- `data-preparation.md`
- `visualization.md`
- `publish.md`
- `debug-report.md`
- `design-guidelines.md`
- `document-management.md`
- `README.md` in the project root when workflow state or workspace guidance changed

## Additional requests
<additional_requests>
  $ARGUMENTS
</additional_requests>

## Phase 4: Quality Check

1. Ensure docs still reflect exactly one active visualization path
2. Ensure all user assets stay under `projects/<slug>/docs/assets/`
3. Ensure no extra plan or asset folders were introduced outside the project docs tree
4. Keep docs compact and current; do not rewrite unrelated sections

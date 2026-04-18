---
name: dv-cook
description: End-to-end project execution wrapper for Data Visualization Kit. Use when the user types `$dv-cook` or wants to continue a project after `$dv-primary` with the context, dataset, and goals already locked.
---

# DV Cook

Treat `$dv-cook` as the canonical post-intake execution wrapper.

## Required Flow

1. Follow `./.codex/workflows/cook-workflow.md` as the source of truth.
2. Use this workflow after `$dv-primary` has already created the project workspace and captured the full intake.
3. Run the project in order:
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - project validation / test
   - `$dv-document-management`
   - `$dv-publish`
4. Keep all project outputs inside `projects/<slug>/docs/`.
5. Re-enter specialist workflows directly only when one stage needs a targeted refresh.

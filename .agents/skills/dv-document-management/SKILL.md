---
name: dv-document-management
description: Project-docs wrapper for Data Visualization Kit. Use when the user types `$dv-document-management` or needs project docs, briefs, plans, and assets organized under the project's `docs/` folder with no extra plan or asset folders elsewhere.
---

# DV Document Management

Treat `$dv-document-management` as the canonical docs wrapper.

## Required Flow

1. Follow `./.codex/workflows/document-management-workflow.md` as the source of truth.
2. Save all project documentation and assets under `projects/<slug>/docs/`.
3. Do not create extra project-level `plans/` or `assets/` directories outside `docs/`.
4. Keep docs compact, current, and aligned with the active workflow state.

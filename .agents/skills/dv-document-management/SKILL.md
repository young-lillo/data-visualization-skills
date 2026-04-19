---
name: dv-document-management
description: Analyze codebase and manage project documentation for Data Visualization Kit. Use when the user types `$dv-document-management` or needs project docs, briefs, plans, summaries, and assets organized under the project's `docs/` tree with no extra artifact sprawl elsewhere.
license: MIT
argument-hint: "init|update|summarize [scope]"
metadata:
  author: data-visualization-kit
  version: "2.0.0"
---

# DV Document Management

Treat `$dv-document-management` as the canonical docs-management skill for Data Visualization Kit.

Analyze the active project workspace and keep documentation accurate, compact, and fully contained inside the project `docs/` tree.

## Codex Adaptation

- Use this skill directly for `$dv-document-management`; do not rely on a dedicated prompt layer.
- Use `./.codex/workflows/document-management-workflow.md` as the runtime contract for scope and output boundaries.
- Keep all project documentation under `projects/<slug>/docs/`.
- Keep all project assets under `projects/<slug>/docs/assets/`.
- Do not create extra project-level `plans/`, `assets/`, or loose artifact folders outside the project `docs/` tree.
- Update existing docs in place whenever possible.

## Modes

Parse the first argument:

| Mode | Purpose | Reference |
|------|---------|-----------|
| `init` | Create or normalize the initial project docs set | `references/init-workflow.md` |
| `update` | Refresh docs after workflow or code changes | `references/update-workflow.md` |
| `summarize` | Refresh high-signal summaries only | `references/summarize-workflow.md` |

If no mode is provided:
- use `update` when the project already has a populated `docs/` tree
- use `init` when project docs are missing or obviously incomplete
- use `summarize` only when the user explicitly asks for a quick summary pass

## Shared Context

Project documentation lives under:

```text
projects/<slug>/docs/
|- project-brief.md
|- project-plan.md
|- data-preparation.md
|- visualization.md
|- publish.md
|- debug-report.md
|- design-guidelines.md
|- document-management.md
`- assets/
   |- screenshots/
   |- user-files/
   `- exports/
```

Use the project `docs/` tree as the source of truth for project-specific documentation.

## Operating Rules

- Do not start product implementation when the task is strictly docs management
- Prefer concise, current, project-scoped docs over broad generic documentation
- Keep workflow notes aligned with `$dv-primary`, `$dv-cook`, `$dv-data-preparation`, `$dv-data-visualize`, `$dv-debug`, and `$dv-publish`
- If a doc references a selected visualization path, keep it consistent with the active tool choice
- When docs are stale, update the smallest correct set instead of rewriting everything

---
description: Keep project docs and user assets compact and correctly placed under the project workspace
argument-hint: [goal / task / brief]
---

Run the document-management workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Follow `./.codex/workflows/document-management-workflow.md` as process truth.
2. Treat this prompt as a thin canonical entrypoint to project doc management only.
3. Keep all project docs under `projects/<slug>/docs/`.
4. Keep all project assets under `projects/<slug>/docs/assets/`.

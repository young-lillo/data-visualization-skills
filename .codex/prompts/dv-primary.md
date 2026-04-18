---
description: Main project conductor for broad or new data-visualization project requests
argument-hint: [goal / task / brief]
---

Run the primary workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Before deep execution, load the mandatory hook layer from `./.codex/workflows/hook-runtime-contract.md`.
2. Normalize the request into:
   - project context
   - dataset
   - project goals
   - constraints
3. Follow `./.codex/workflows/primary-workflow.md` as process truth.
4. Route to exactly one owner workflow after intake normalization.
5. Use a domain entrypoint directly when the owner workflow is already clear:
   - `$dv-cook`
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - `$dv-publish`
   - `$dv-debug`
   - `$dv-document-management`

---
description: Run the end-to-end post-intake project workflow after `$dv-primary` has already locked context, dataset, and goals
argument-hint: [goal / task / brief]
---

Run the cook workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Follow `./.codex/workflows/cook-workflow.md` as process truth.
2. Treat this prompt as the canonical end-to-end execution entrypoint after intake is complete.
3. Run the sequence in order:
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - project validation / test
   - `$dv-document-management`
   - `$dv-publish`
4. Keep all resulting project state under `projects/<slug>/docs/`.
5. Use specialist workflows directly when only one stage needs to be rerun.

---
description: Prepare source data for visualization through ingestion, cleaning, validation, and transformation
argument-hint: [goal / task / brief]
---

Run the data-preparation workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Follow `./.codex/workflows/data-preparation-workflow.md` as process truth.
2. Treat this prompt as a thin canonical entrypoint to data ingestion and transformation work.
3. Keep all resulting notes, exports, and state under `projects/<slug>/docs/`.
4. Require SQL and/or Python in the resulting project workflow when implementation details are produced.

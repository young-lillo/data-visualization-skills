---
description: Finalize a project so it is ready for git and deployment
argument-hint: [goal / task / brief]
---

Run the publish workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Follow `./.codex/workflows/publish-workflow.md` as process truth.
2. Treat this prompt as a thin canonical entrypoint to publish readiness only.
3. Keep publish notes under `projects/<slug>/docs/`.
4. Prefer an open-source interactive dashboard deploy path, with `Metabase` for general BI and `Grafana` for operational dashboards.

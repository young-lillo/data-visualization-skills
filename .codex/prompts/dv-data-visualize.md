---
description: Build or refresh visual outputs for an existing data-visualization project
argument-hint: [goal / task / brief]
---

Run the data-visualize workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Follow `./.codex/workflows/data-visualize-workflow.md` as process truth.
2. Treat this prompt as a thin canonical entrypoint; keep the main logic in the `dv-data-visualize` skill.
3. Read project docs first to confirm project context, selected tool path, and prepared-data state.
4. Pull from `$dv-data-preparation` before building or refreshing visuals.
5. Route to exactly one selected visualization skill: `evidence`, `metabase`, `grafana`, or `apache-superset`.
6. Run `test` or project validation after the visualization pass.
7. Keep all resulting notes, screenshots, and exports under `projects/<slug>/docs/`.

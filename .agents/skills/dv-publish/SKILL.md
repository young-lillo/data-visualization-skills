---
name: dv-publish
description: Publish wrapper for Data Visualization Kit. Use when the user types `$dv-publish` or needs to make a project git-ready, deployment-ready, and aligned with the kit's publish rules.
---

# DV Publish

Treat `$dv-publish` as the canonical publish wrapper.

## Required Flow

1. Follow `./.codex/workflows/publish-workflow.md` as the source of truth.
2. Prepare the project folder so it is ready to commit and push.
3. Prefer open-source interactive dashboard deploy paths where possible, with `Metabase` as the default general BI option and `Grafana` for operational dashboards.
4. Preserve the project-local docs contract and avoid writing project deliverables outside the workspace.

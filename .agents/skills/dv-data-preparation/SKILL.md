---
name: dv-data-preparation
description: Data ingestion and transformation wrapper for Data Visualization Kit. Use when the user types `$dv-data-preparation` or needs to ingest, clean, validate, and transform data into visualization-ready outputs.
---

# DV Data Preparation

Treat `$dv-data-preparation` as the canonical data-prep wrapper.

## Required Flow

1. Follow `./.codex/workflows/data-preparation-workflow.md` as the source of truth.
2. Keep execution workflow-first: hooks, workflow, agents, then supporting skills.
3. Require SQL and/or Python whenever implementation steps are produced.
4. Produce clean, goal-aligned outputs that are ready for exactly one visualization path.

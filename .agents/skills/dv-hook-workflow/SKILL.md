---
name: dv-hook-workflow
description: Runtime-hook wrapper for Data Visualization Kit. Use when the user types `$dv-hook-workflow` or needs to inspect the mandatory hook layer that runs before workflow execution.
---

# DV Hook Workflow

Treat `$dv-hook-workflow` as the canonical hook-contract wrapper.

## Required Flow

1. Follow `./.codex/workflows/hook-workflow.md` as the source of truth.
2. Use `./.codex/workflows/hook-runtime-contract.md` as the mandatory runtime gate contract.
3. Explain or inspect the hook layer only; do not replace owner workflow logic here.

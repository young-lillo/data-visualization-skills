---
name: dv-debug
description: Debug wrapper for Data Visualization Kit. Use when the user types `$dv-debug` or when data preparation, visualization, publish, or deployment behavior fails and root cause must be proven before fixing.
---

# DV Debug

Treat `$dv-debug` as the canonical debug wrapper.

## Required Flow

1. Follow `./.codex/workflows/debug-workflow.md` as the source of truth.
2. Prove root cause before proposing fixes.
3. Keep the debug record inside the active project `docs/` tree.
4. Route back to the owning workflow after the failure is understood.

---
name: dv-orchestration
description: Agent-coordination wrapper for Data Visualization Kit. Use when the user types `$dv-orchestration` or needs to inspect how the kit coordinates agents, hooks, and workflows safely.
---

# DV Orchestration

Treat `$dv-orchestration` as the canonical orchestration wrapper.

## Required Flow

1. Follow `./.codex/workflows/orchestration-protocol.md` as the source of truth.
2. Explain or apply the coordination contract without turning this wrapper into a business workflow.
3. Keep the ownership rule explicit: one request, one owner workflow.

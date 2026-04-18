---
name: dv-help
description: Explain the canonical `$dv-*` command surface. Use when the user types `$dv-help`, asks what the kit does, or needs help choosing the right data-visualization workflow.
---

# DV Help

Treat `$dv-help` as the canonical discovery wrapper.

## Required Flow

1. Follow `./.codex/workflows/help-workflow.md` as the source of truth.
2. Reuse `./.codex/prompts/dv-help.md` only as a thin entry contract when useful.
3. Recommend the smallest correct `$dv-*` next step with one realistic example per command.
4. Prefer canonical commands over implementation details.

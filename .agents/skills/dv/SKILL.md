---
name: dv
description: Data Visualization Kit hub. Use when the user types `$dv`, asks what `$dv-*` commands exist, or gives a broad portfolio-data-visualization brief that still needs routing to the right canonical workflow.
---

# DV Hub

Treat `$dv` as the canonical public hub.

## Required Flow

1. Keep the runtime shape explicit: entrypoints -> hooks -> workflows -> agents -> skills -> outputs.
2. If the user needs discovery, follow `./.codex/workflows/help-workflow.md`.
3. If the request is broad, ambiguous, or starts a new project, route through `./.codex/workflows/primary-workflow.md`.
4. If one owner workflow is already clear, route to exactly one canonical skill and prompt:
   - `$dv-help`
   - `$dv-primary`
   - `$dv-cook`
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - `$dv-publish`
   - `$dv-debug`
   - `$dv-document-management`
   - `$dv-orchestration`
5. Keep the hub thin. Do not perform deep project work here.

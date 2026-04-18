---
name: dv-primary
description: Main project-intake and routing wrapper for Data Visualization Kit. Use when the user types `$dv-primary` or brings a new portfolio brief that needs context intake, framework choice, and routing to one owner workflow.
---

# DV Primary

Treat `$dv-primary` as the canonical conductor.

## Required Flow

1. Load the mandatory hook contract from `./.codex/workflows/hook-runtime-contract.md` before deep execution.
2. Start intake by collecting:
   - project context
   - project dataset
   - project goals
3. Follow `./.codex/workflows/primary-workflow.md` as the source of truth.
4. Choose exactly one owner workflow after intake normalization.
5. Preserve kit rules in the resulting plan:
   - choose one visualization layer path per project
   - require SQL and/or Python in implementation
   - keep project outputs inside the project workspace

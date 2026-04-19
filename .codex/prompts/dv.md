---
description: Hub entrypoint for the Data Visualization Kit command surface
argument-hint: [goal / task / brief]
---

Open the Data Visualization Kit hub.

<request>$ARGUMENTS</request>

## Canonical Command

- Preferred hub command: `$dv`
- Discovery command: `$dv-help`

## Workflow Contract

1. Treat this prompt as the hub and routing surface for the kit.
2. Follow `./.codex/workflows/help-workflow.md` when the user needs command discovery.
3. If `$ARGUMENTS` contains a clear project goal or task, route the user to exactly one canonical workflow:
   - `$dv-plan`
   - `$dv-cook`
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - `$dv-publish`
   - `$dv-debug`
   - `$dv-document-management`
4. Keep this prompt thin. Do not duplicate business orchestration here.

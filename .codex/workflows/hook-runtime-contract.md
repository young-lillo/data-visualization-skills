# Hook Runtime Contract

## Required Hooks

- `run-workflow-preflight`
- `workflow-routing-gate`
- `project-preflight`
- `subagent-init`
- `privacy-block`
- `provider-key-gate`
- `docs-output-gate`

## Hook Rule

If a hook blocks, execution stops.

## Activation Notes

- `run-workflow-preflight` runs before routing
- `workflow-routing-gate` runs after request normalization and intake resolution
- `project-preflight` and `docs-output-gate` run before workflow writes
- `privacy-block` runs only before sensitive-file access
- `provider-key-gate` runs only before provider-backed actions
- `subagent-init` runs only when the runtime is ready to hand off Codex context

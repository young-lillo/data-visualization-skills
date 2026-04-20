# Hook Runtime Contract

## Required Hooks

- `run-workflow-preflight`
- `user-prompt-submit`
- `usage-context-awareness`
- `workflow-routing-gate`
- `plan-intake-validation` *(plan workflow only)*
- `project-preflight`
- `subagent-init`
- `privacy-block`
- `provider-key-gate`
- `docs-output-gate`

## Hook Rule

If a hook blocks, execution stops.

## Activation Notes

- `run-workflow-preflight` runs before routing
- `user-prompt-submit` runs after CLI parse and before workflow routing
- `usage-context-awareness` runs during prompt intake and refreshes usage cache for downstream handoff
- `workflow-routing-gate` runs after request normalization and intake resolution
- `plan-intake-validation` runs only during `$dv-plan` intake — validates and confirms framework, goal tier, and visualization tool with the user before any project files are written
- `project-preflight` and `docs-output-gate` run before workflow writes
- `privacy-block` runs only before sensitive-file access
- `provider-key-gate` runs only before provider-backed actions
- `subagent-init` runs only when the runtime is ready to hand off Codex context

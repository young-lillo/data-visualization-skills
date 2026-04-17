# Orchestration Protocol

Defines how to coordinate `spawn_agent` execution safely and predictably.

## Core Rules

- one request has one owner workflow
- route before execution
- prefer the smallest useful agent set
- pass minimal scoped context only
- parallelize only when ownership boundaries are explicit
- all spawned agents must receive `subagent-init` output
- final reviewer must be defined before parallel fan-out

## Sequential Chaining

Default mode:
- `planner`
- `database`
- `visualize`
- `ui-ux-designer` if needed
- `tester`
- `git-manager`

## Parallel Execution

Use only when:
- prerequisites are complete
- file ownership is explicit
- outputs do not overlap
- integration order is defined

## Completion Gate

Task is complete only when:
- required docs exist in the project workspace
- required validation passes
- summary lists changed files, output paths, and unresolved questions

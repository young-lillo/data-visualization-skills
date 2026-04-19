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

## Agent Roster

Canonical agent ids:
- `planner`
- `database`
- `visualize`
- `ui-ux-designer`
- `tester`
- `git-manager`
- `debugger`
- `mcp-manager`
- `code-simplifier`

## Sequential Chaining

Default workflow chain:
- `planner`
- `database`
- `visualize`
- `ui-ux-designer` if needed
- `code-simplifier` if implementation cleanup is needed
- `tester`
- `git-manager`

Support agents:
- `debugger` for workflow, runtime, and validation failures
- `mcp-manager` for narrow MCP-backed tasks inside the owner workflow

Visualization-stage rules:
- `visualize` must read project docs before changing dashboards
- `visualize` must consume the prepared-data contract from `$dv-data-preparation`
- `visualize` must stay on one selected tool path: `metabase`, `grafana`, or `apache-superset`
- `tester` runs after `visualize` when the visualization stage changed

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

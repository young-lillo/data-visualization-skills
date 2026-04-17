# Phase 04 Upgrade Agent Runtime

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: high
- Status: completed
- Goal: replace the current agent set with the requested runtime-ready agent layer

## Key Insights

- the current kit has agent contracts, but not the exact set the new design needs
- planner/database/visualize/debug/tester become first-class runtime actors
- some agents are support agents, not always-on agents

## Requirements

- add `planner`
- add `database`
- add `visualize`
- add `debug`
- add `tester`
- add `code-simplifier`
- add `git-manager`
- add `mcp-manager`
- add `ui-ux-designer`

## Architecture

- `primary` usually starts with `planner`
- `data-preparation` owns `database`
- `data-visualize` owns `visualize`
- `debug` owns `debug`
- `publish` uses `tester`, `git-manager`, and optionally `ui-ux-designer`
- `mcp-manager` is support-only

## Related Code Files

- Files to modify: agent configs, orchestration docs
- Files to create: new agent spec files
- Files to delete: old agent specs that no longer fit

## Implementation Steps

1. define each new agent contract
2. map each agent to owner workflows
3. define sequential and parallel patterns
4. document quality-gate order

## Todo List

- [x] add requested agent specs
- [x] map agent ownership to workflows
- [x] define parallel-safe patterns
- [x] remove obsolete agent contracts

## Success Criteria

- agent layer matches the new requested set
- workflow-to-agent delegation is explicit
- support agents are clearly separated from owner agents

## Risk Assessment

- risk: support agents accidentally become routers
- mitigation: keep all delegation owned by workflows only

## Security Considerations

- every agent run must inherit hook constraints and docs-only output rules

## Next Steps

- unblock workspace-contract refactor in Phase 05

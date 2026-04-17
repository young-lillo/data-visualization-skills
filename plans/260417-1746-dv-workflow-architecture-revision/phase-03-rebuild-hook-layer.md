# Phase 03 Rebuild Hook Layer

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: critical
- Status: completed
- Goal: rebuild hooks around the new workflow contracts and compact docs output rule

## Key Insights

- hooks must be validators, blockers, and context injectors only
- the new design needs a stronger output-path gate than the current runtime has
- every spawned agent must receive stable `subagent-init` context

## Requirements

- keep `run-workflow-preflight`
- keep `project-preflight`
- keep `subagent-init`
- keep `privacy-block`
- keep `provider-key-gate`
- add `workflow-routing-gate`
- add `docs-output-gate`

## Architecture

- hooks run before sensitive or stateful execution
- hook workflow documents exact enable points
- failure in any mandatory hook blocks execution

## Related Code Files

- Files to modify: existing hook scripts, workflow hook contract docs
- Files to create: new routing/output gates
- Files to delete: none planned unless hooks collapse into new names

## Implementation Steps

1. define hook enable points per workflow
2. implement routing gate
3. implement docs-output gate
4. ensure agent handoff always includes docs-only output rules
5. test stop behavior

## Todo List

- [x] document hook workflow
- [x] add routing gate
- [x] add docs-output gate
- [x] update hook tests

## Success Criteria

- hooks block invalid requests, invalid paths, and invalid outputs
- project docs cannot escape `projects/<slug>/docs/`
- spawned agents receive stable context every time

## Risk Assessment

- risk: hooks become too smart and own workflow logic
- mitigation: keep them narrow and stage-specific

## Security Considerations

- privacy and provider-key gates remain fail-closed

## Next Steps

- unblock runtime agent refactor in Phase 04

# Phase 06 Skills Integration And Quality Gates

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: high
- Status: completed
- Goal: align the skill layer, quality gates, docs, and migration notes with the revised architecture

## Key Insights

- the skill layer must stay minimal and role-based
- `ui-ux-pro-max` becomes first in the UI chain
- visualization tooling needs explicit skill docs for Superset and RAWGraphs

## Requirements

- add or fork the requested skills
- map skill activation rules to agent stages
- align tester/debug/finalize quality gates with the new workflow family
- update docs to explain the transition from current runtime to revised architecture

## Architecture

Skill groups:
- planning/debug
- design/UI
- framework/runtime
- visualization tools

Quality gates:
- hook pass
- workflow stage complete
- tester pass when needed
- publish readiness

## Related Code Files

- Files to modify: skill docs, workflow docs, README, validation docs
- Files to create: Superset and RAWGraphs skill docs if absent
- Files to delete: obsolete skill references

## Implementation Steps

1. inventory required skills
2. fork or create missing skills
3. document which agents use which skills and when
4. rewrite tests and smoke checks to the new runtime
5. add migration notes for users of the current kit

## Todo List

- [x] map requested skills to agent roles
- [x] add missing skill docs
- [x] update quality gate docs
- [x] rewrite smoke/test expectations for the new structure

## Success Criteria

- skill set matches the revised architecture
- quality gate order is explicit
- migration path is documented
- docs explain current state vs target state cleanly

## Risk Assessment

- risk: large skill import surface increases maintenance cost
- mitigation: fork only what the new workflow family really needs

## Security Considerations

- any provider-dependent skill must declare provider-key gate requirements

## Next Steps

- after this phase, the repo can move from transition state to the new `$dv-*` architecture

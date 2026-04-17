# Phase 02 Build Workflow Family

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: critical
- Status: completed
- Goal: replace the current workflow set with the new family defined in the revised design

## Key Insights

- the earlier single-owner `portfolio-workflow` is too narrow for the new target
- `primary` must become project conductor
- `orchestration` and `hook workflow` are internal control workflows, not user business workflows

## Requirements

- create `primary`
- create `data-preparation`
- create `data-visualize`
- create `publish`
- create `debug`
- create `document-management`
- create `help`
- create `orchestration`
- create `hook workflow`

## Architecture

- `primary` delegates to domain workflows
- domain workflows own execution in their area
- internal workflows define coordination and runtime gates

## Related Code Files

- Files to modify: workflow docs, routing docs
- Files to create: new workflow definitions
- Files to delete: obsolete workflow docs

## Implementation Steps

1. define owner and stop conditions for each workflow
2. define which workflows are public-facing vs internal
3. document delegation paths between workflows
4. align router with the new workflow family

## Todo List

- [x] create workflow family docs
- [x] define ownership per workflow
- [x] define delegation rules
- [x] remove obsolete workflow references

## Success Criteria

- workflow family matches the new architecture exactly
- `primary` clearly owns broad project execution
- internal workflows are separated from public-facing workflows

## Risk Assessment

- risk: overlapping workflow ownership causes routing drift
- mitigation: document one owner per request and explicit delegation boundaries

## Security Considerations

- domain workflows must inherit hook requirements from the hook workflow

## Next Steps

- unblock hook-layer rebuild in Phase 03

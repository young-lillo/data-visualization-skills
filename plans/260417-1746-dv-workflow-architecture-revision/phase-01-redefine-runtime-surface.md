# Phase 01 Redefine Runtime Surface

## Context Links

- [plan.md](plan.md)
- [portfolio-data-visualization-kit-design.md](../../docs/portfolio-data-visualization-kit-design.md)

## Overview

- Priority: critical
- Status: completed
- Goal: replace the current CLI and prompt-entry surface with `$dv-<workflow> <brief>`

## Key Insights

- the current `kit/portfolio/help` surface no longer matches the desired public runtime
- natural-language requests may still be supported, but must normalize into one owner workflow
- routing must remain thin

## Requirements

- define `$dv-primary`
- define `$dv-data-preparation`
- define `$dv-data-visualize`
- define `$dv-publish`
- define `$dv-debug`
- define `$dv-document-management`
- define `$dv-hook-workflow`
- define `$dv-help`
- support normalization of natural-language requests into one workflow

## Architecture

- entrypoints remain public surface only
- routing logic maps commands to workflow owners
- prompts must not contain deep business orchestration

## Related Code Files

- Files to modify: CLI entrypoint, router, prompt docs
- Files to create: new `$dv-*` prompt files
- Files to delete: old prompt entrypoints that no longer map to the new runtime

## Implementation Steps

1. replace current command routing with `$dv-*` routing
2. add prompt entrypoint docs for each workflow
3. add normalization path for natural-language requests
4. keep routing minimal and deterministic

## Todo List

- [x] replace CLI command map
- [x] add `$dv-*` prompt docs
- [x] define natural-language normalization rules
- [x] deprecate old public commands

## Success Criteria

- `$dv-*` commands are first-class
- entrypoints are thin
- one request resolves to one owner workflow

## Risk Assessment

- risk: old and new command surfaces conflict during migration
- mitigation: document deprecation and keep one clear preferred surface

## Security Considerations

- routing must happen before workflow state changes

## Next Steps

- unblock workflow-family implementation in Phase 02

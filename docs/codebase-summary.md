# Codebase Summary

## Current Areas

- `KIT-ARCHITECTURE.md`: architecture source for the kit
- `docs/`: design and operating docs
- `plans/`: implementation plans
- `.codex/`: Codex runtime contracts
- `scripts/`: executable runtime
- `tests/`: smoke and unit validation
- `projects/`: generated project workspaces

## Runtime Entry Points

- `scripts/run-kit.cjs`: thin CLI entrypoint
- `scripts/smoke-test.cjs`: disposable generation + validation path

## Workflow and Hook Chain

- `.codex/workflows/primary-workflow.md`: project conductor workflow
- `.codex/workflows/data-preparation-workflow.md`: ingestion and transformation workflow
- `.codex/workflows/data-visualize-workflow.md`: visualization workflow
- `.codex/workflows/publish-workflow.md`: publish workflow
- `.codex/workflows/debug-workflow.md`: debug workflow
- `.codex/workflows/document-management-workflow.md`: docs compaction workflow
- `.codex/workflows/orchestration-protocol.md`: spawn-agent coordination rules
- `.codex/workflows/hook-workflow.md`: mandatory hook layer behavior
- `.codex/workflows/hook-runtime-contract.md`: required hook contract
- `scripts/hooks/run-workflow-preflight.cjs`: resolves repo root before routing
- `scripts/hooks/workflow-routing-gate.cjs`: validates owner workflow selection
- `scripts/hooks/project-preflight.cjs`: blocks invalid project paths and duplicate outputs
- `scripts/hooks/docs-output-gate.cjs`: enforces project docs-only artifact writes
- `scripts/hooks/privacy-block.cjs`: blocks sensitive file access
- `scripts/hooks/provider-key-gate.cjs`: blocks missing provider keys
- `scripts/hooks/subagent-init.cjs`: builds stable handoff context

## Validation Contract

- `scripts/lib/project-validator.cjs` checks the generated project path set
- smoke validation creates a sample project, validates required files, then deletes the sample workspace

## Generated Output Contract

- generated projects live under `projects/<project-slug>/`
- each project must keep its artifacts under `docs/`
- output paths are validated against the runtime contract before the run is considered complete

# Project Changelog

## 2026-04-17

### Added

- initial design doc for the Codex portfolio kit
- implementation plan for the workflow-first runtime
- Node CLI runtime, hooks, workflows, and agent contracts
- project generator with sample generated workspaces
- tests and smoke validation for generated project output
- `$dv-*` command surface and workflow family
- docs-only project workspace contract
- new hook gates for routing and docs output
- new planner/database/visualize/debug/tester-oriented agent specs
- local skill stubs for UI, planning, debugging, Superset, and RAWGraphs

### Fixed

- intake now fails fast in non-interactive mode when required values are missing
- first-run `$dv-primary` project creation now works without requiring `--force=true`
- CLI now derives non-interactive behavior from the real runtime environment instead of forcing prompt mode
- privacy blocking now targets secret filenames instead of rejecting safe project slugs containing `token`
- command and prompt references now align on `$dv-document-management` and `$dv-hook-workflow`, while keeping legacy aliases for compatibility
- hook wiring now matches the runtime contract for preflight, privacy, provider, project, and subagent gates
- smoke validation now checks and cleans up the disposable generated project path
- docs now reflect the enforced runtime contract and generated output checks

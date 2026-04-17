# Code Standards

## Principles

- YAGNI
- KISS
- DRY

## Runtime Rules

- prefer small modules under 200 lines
- use CommonJS for script compatibility
- keep entrypoints thin
- put orchestration in workflow docs and workflow code, not prompt text blobs
- treat hook files as validators and blockers, not routers
- fail fast when required intake values are missing in non-interactive mode
- keep generated-path checks aligned with `scripts/lib/project-validator.cjs`

## Output Rules

- generated project files live only in `projects/<project-slug>/`
- all project docs, plans, and user assets must live under `projects/<project-slug>/docs/`
- never write secrets into generated output
- generated docs must explain decisions and unresolved questions

## Testing Rules

- use built-in Node test runner where possible
- verify generated structure, rationale docs, and starter files
- run smoke validation whenever the generated output contract changes

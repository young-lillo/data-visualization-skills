# Cook Workflow

## Purpose

Own end-to-end project execution after intake is complete.

## Responsibilities

- require an existing project created by `$dv-primary`
- run data preparation first
- run visualization second using the selected path from project docs
- make visualization consume the cleaned outputs from `$dv-data-preparation`
- validate the visualization pass with `test` or project validation before docs sync
- sync docs before publish
- finalize publish-ready project output

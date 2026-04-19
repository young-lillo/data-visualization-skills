# Data Visualize Workflow

## Purpose

Own visualization creation and source-change updates for one selected dashboard path.

## Responsibilities

- read project state before visual work starts
- pull from cleaned outputs documented by `$dv-data-preparation`
- route to exactly one selected visualization skill: `metabase`, `grafana`, or `apache-superset`
- build or refresh visuals with that selected tool only
- prefer interactive dashboard delivery over static storytelling output
- run `test` or project validation after the visualization pass
- keep all visualization notes and exports under `projects/<slug>/docs/`


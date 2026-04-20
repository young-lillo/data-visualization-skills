---
name: dv-data-visualize
description: Build and refresh visualization layers for Data Visualization Kit projects. Use when the task is dashboard construction, chart refresh, visualization-path selection, dashboard QA, or project-scoped visualization delivery that must follow the kit visualization workflow and resolve to one selected tool path.
license: MIT
argument-hint: "[goal / task / brief]"
metadata:
  author: data-visualization-kit
  version: "2.1.0"
---

# DV Data Visualize

Production-ready visualization delivery for Data Visualization Kit projects, with project-doc-driven routing, one-path dashboard ownership, validation after visual changes, and explicit handoff from prepared data into dashboard outcomes.

## Workflow Obligation

This skill must follow `./.codex/workflows/data-visualize-workflow.md`.

That means:

- read project docs before changing dashboards
- verify the prepared-data contract before visual work starts
- resolve exactly one visualization path for the active project
- build or refresh visuals on that path only
- validate the visualization pass after changes
- sync visualization notes and artifacts under the project docs tree

If this skill and the workflow file ever disagree, follow `./.codex/workflows/data-visualize-workflow.md`.

## When to Use

- building a new dashboard for an already prepared project
- refreshing charts, panels, filters, drill paths, or dashboard structure after source changes
- selecting or confirming the right visualization path for a project
- reconciling dashboard outputs with the prepared-data contract
- documenting visualization choices, scope changes, exports, screenshots, and validation status

## Visualization Path Guide

**Choose the selected path from project docs when it already exists.**

**Prefer Evidence.dev when:**
- the deploy target is Netlify or Vercel
- the dataset is CSV, Excel, Parquet, or another static file format
- no live DB connection is required
- the portfolio piece should work without any server infrastructure

**Prefer Metabase when:**
- the project is general interactive BI
- stakeholders need accessible dashboard navigation and business-readable metrics
- the kit needs its default general BI path

**Prefer Grafana when:**
- the project is operational, observability-oriented, or time-series first
- the user workflow is monitoring, incident review, or telemetry-heavy analysis
- the dashboard depends on operational panels, variables, or alert context

**Use Apache Superset only when:**
- the project already selected Superset
- the estate is legacy and already depends on Superset datasets or dashboards
- migration analysis is explicitly part of the task

See: `./.codex/workflows/data-visualize-workflow.md`

## Visualization Mindset

**The 10 Commandments of Visualization Delivery:**

1. **The prepared-data contract comes before dashboard polish**
2. **One selected tool path is better than a mixed dashboard stack**
3. **Dashboards are decision surfaces, not report dumps**
4. **Business meaning matters more than widget count**
5. **A broken metric is a data-contract issue until proven otherwise**
6. **Filters and navigation should match how users think**
7. **Validation is mandatory after visual changes**
8. **Project docs are part of the product, not afterthoughts**
9. **Path switches must be explicit**
10. **If the data is not trustworthy, route backward before decorating uncertainty**

## Reference Navigation

**Workflow Reference:**
- `./.codex/workflows/data-visualize-workflow.md` - required visualization workflow contract, routing, validation, docs sync

**Visualization Domain Skills:**
- `evidence` - static portfolio path for Evidence.dev
- `metabase` - default general BI path
- `grafana` - operational and time-series path
- `apache-superset` - legacy Superset path only

## Key Best Practices

**Project Read and Routing:**
- read `projects/<slug>/docs/project-brief.md`, `project-plan.md`, `data-preparation.md`, and `visualization.md` before changing dashboards
- preserve the selected visualization path unless the user explicitly asks to switch
- make path resolution explicit in project docs whenever the current state is unclear

**Dashboard Construction:**
- keep one dashboard path aligned with one prepared-data contract
- prefer clean, audience-driven decision flow over dashboard sprawl
- keep tool-specific behavior inside the selected domain skill instead of mixing patterns loosely

**Validation and QA:**
- validate dashboard behavior against the prepared-data contract and business goal
- treat broken queries, empty states, mismatched metrics, and filter regressions as blocking issues
- run the `test` skill or project validation after visualization changes

**Docs and Handoff:**
- keep `projects/<slug>/docs/visualization.md` as the canonical visualization record
- store screenshots, exports, and visualization artifacts in `projects/<slug>/docs/assets/`
- document assumptions, scope changes, path switches, and remaining risks

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Build a static portfolio dashboard from CSV/Kaggle | Evidence via DV Data Visualize |
| Build or refresh a general BI dashboard | Metabase via DV Data Visualize |
| Build or refresh an operational or time-series dashboard | Grafana via DV Data Visualize |
| Maintain or extend a legacy Superset dashboard path | Apache Superset via DV Data Visualize |
| Data cleanup or semantic repair before dashboard work | `$dv-data-preparation` |
| Publish-ready deployment work | `$dv-publish` |

## Implementation Checklist

**Intake:**
- confirm project identity, business goal, audience, and delivery expectations
- read the selected visualization path from project docs if it already exists
- confirm whether the task is build, refresh, migration, or repair

**Prepared-Data Verification:**
- read the latest output contract from `$dv-data-preparation`
- confirm grain, keys, freshness, null policy, and trusted metrics are clear enough for dashboard work
- route backward if the visualization layer would otherwise rely on guessed semantics

**Path Resolution:**
- choose exactly one domain skill: `evidence`, `metabase`, `grafana`, or `apache-superset`
- preserve compatibility with the current project docs unless the requested scope changes

**Visualization Build:**
- build or refresh the dashboard on the selected path only
- keep the dashboard aligned to one prepared-data contract and one tool path
- avoid mixing patterns from other dashboard tools into the active path

**Validation and Docs Sync:**
- run `test` or project validation after visualization changes
- update `projects/<slug>/docs/visualization.md` with tool choice, scope, changes made, validation status, and remaining risks
- store screenshots, exports, and visualization artifacts in `projects/<slug>/docs/assets/`

## Common Pitfalls to Avoid

1. Mixing multiple dashboard tools in one active visualization pass
2. Starting dashboard work before the prepared-data contract is actually trusted
3. Treating mismatched numbers as design issues instead of data-contract problems
4. Letting dashboard sprawl grow because no decision scope was enforced
5. Switching visualization path implicitly without recording it in project docs
6. Skipping validation after visual changes because the layout looks correct

## Resources

**Data Visualization Kit Context:**
- This skill is the project-scoped visualization domain skill for Data Visualization Kit
- The authoritative orchestration contract lives in `./.codex/workflows/data-visualize-workflow.md`
- Use `evidence`, `metabase`, `grafana`, or `apache-superset` as the selected downstream domain skill, not as parallel active paths

## Output Rules

- keep project-scoped notes in `projects/<slug>/docs/`
- keep visualization artifacts in `projects/<slug>/docs/assets/`
- keep the active project on one selected visualization path
- route backward to `$dv-data-preparation` if the data contract is not trustworthy enough
- route forward to `$dv-publish` only after the visualization state is stable and validated

---
name: apache-superset
description: Maintain and evolve existing Apache Superset analytics stacks. Use for Superset SQL Lab, datasets, charts, dashboards, RBAC, embedding, operational fixes, and migration planning toward Metabase or Grafana. Prefer only for legacy projects that already selected Superset. Requires 4GB+ RAM.
license: MIT
argument-hint: "[maintenance-task] [legacy-scope]"
metadata:
  author: data-visualization-kit
  version: "1.0.0"
---

> **RAM Requirement:** Apache Superset requires a minimum of **4GB RAM** in production
> (Celery worker + Redis + PostgreSQL metadata + Gunicorn). It will OOM on a 2GB VPS under load.
> **This is a legacy-only path.** For new projects, use Metabase (VPS) or Evidence.dev (Netlify/Vercel).

# Apache Superset Skill

Production-ready Apache Superset maintenance for legacy analytics stacks, with SQL-first modeling, semantic reuse, governance, and migration-aware thinking.

## When to Use

- Maintaining an existing Apache Superset workspace already in production or staging
- Updating SQL Lab queries, virtual datasets, charts, dashboards, or filters
- Troubleshooting Superset permissions, datasource wiring, caching, or dashboard behavior
- Hardening a Superset instance for team use, governed access, or embedded analytics
- Auditing whether a legacy Superset project should stay on Superset or migrate to Metabase or Grafana

## Legacy Path Guide

**Stay on Superset when:**
- the project already relies on Superset datasets, chart configs, and dashboard layouts
- analysts need SQL Lab plus reusable semantic datasets inside the same stack
- the team needs rich multi-chart dashboard composition on a self-hosted OSS path

**Migrate away when:**
- the project wants a simpler BI workflow with less admin overhead, better matched to Metabase
- the dashboard is primarily operational, alert-driven, or time-series first, better matched to Grafana
- long-term kit maintenance benefits from aligning to current Data Visualization Kit defaults

See: `references/superset-migration.md`

## Superset Mindset

**The 10 Commandments of Superset Maintenance:**

1. **Treat Superset as an existing system, not a greenfield playground**
2. **Stabilize datasets before polishing charts**
3. **One metric definition should feed many dashboards**
4. **SQL correctness beats visual speed**
5. **Permissions and row-level controls are product behavior**
6. **Dashboard filters must match decision workflows, not just schema shape**
7. **Cache strategy matters when queries are expensive**
8. **Embedded analytics needs explicit auth and tenancy boundaries**
9. **Legacy tool choice is acceptable only when justified**
10. **If migration is better, say it directly**

See: `references/superset-core.md`

## Reference Navigation

**Core Domain References:**
- `superset-core.md` - SQL Lab, datasets, charts, dashboards, filters, RBAC, embeds, caching, delivery patterns
- `superset-migration.md` - keep-vs-migrate criteria, migration triggers, target mapping to Metabase or Grafana

## Key Best Practices

**Modeling and Queries:**
- Prefer stable virtual datasets or physical modeled tables over copy-pasted ad hoc SQL everywhere
- Standardize metric names, time grains, and business definitions before dashboard expansion
- Push heavy transformation upstream when dashboard queries become brittle or too slow

**Dashboard Design:**
- Group charts by decision flow, not by raw table origin
- Keep filter scope explicit; avoid "all charts depend on all filters" unless truly intended
- Use dashboard tabs or thematic splits before giant scroll-heavy boards

**Governance and Security:**
- Review datasource permissions, database credentials, and row-level security together
- Minimize broad admin grants; treat role design as part of product design
- Validate embeds, guest access, and shared links against tenant and data-boundary rules

**Operations:**
- Watch query latency, cache hit behavior, and dashboard render cost
- Treat broken charts as data-contract issues first, UI issues second
- Record legacy decisions and migration blockers in project docs

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Maintain existing Superset estate | Apache Superset |
| SQL Lab plus reusable governed datasets | Apache Superset |
| Simpler BI for general stakeholders | Metabase |
| Operational, observability, or time-series dashboards | Grafana |
| New default DV portfolio BI path | Metabase |
| Legacy portfolio audit and migration planning | Apache Superset |

## Implementation Checklist

**Legacy Intake:**
- Confirm Superset is already the selected stack
- Inventory databases, datasets, dashboards, roles, and embeds
- Capture current breakages, business asks, and deployment constraints

**Model Layer:**
- Review SQL Lab sources and virtual datasets
- Normalize metrics, dimensions, time columns, and naming
- Remove duplicate or conflicting semantic definitions

**Dashboard Layer:**
- Audit chart correctness, filter scope, drill paths, and stakeholder usability
- Rebuild or refactor only after dataset semantics are stable
- Verify exports, embeds, and navigation paths

**Governance:**
- Review database credentials, roles, row-level rules, and guest/embed flows
- Check access boundaries for team, client, and public use cases

**Quality:**
- Re-run representative queries
- Validate dashboard outputs against source SQL and business expectations
- Document known legacy debt and explicit migration recommendations

## Common Pitfalls to Avoid

1. Treating broken charts as styling issues when the dataset logic is wrong
2. Copying the same metric logic into many charts instead of consolidating it
3. Letting one oversized dashboard absorb unrelated decision workflows
4. Ignoring cache behavior while blaming the database for every slowdown
5. Granting broad roles to bypass permission design
6. Keeping Superset on a new project just because it already exists somewhere else

## Resources

**Official Documentation:**
- Apache Superset: https://superset.apache.org/
- Superset docs: https://superset.apache.org/docs/intro

**Data Visualization Kit Context:**
- Prefer Metabase for new general BI work
- Prefer Grafana for operational and time-series work
- Use Superset only when the project is already committed to it or migration analysis is part of the task

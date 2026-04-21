---
name: apache-superset
description: Maintain and evolve existing Apache Superset analytics stacks (v6.x). Use for SQL Lab, datasets, charts, dashboards, RBAC, RLS, embedding via guest token API, REST API integration, Celery async, caching, Docker/Helm deployment, and migration planning toward Metabase or Grafana. Prefer only for legacy projects that already selected Superset. Requires 4GB+ RAM.
license: MIT
argument-hint: "[maintenance-task] [legacy-scope]"
metadata:
  author: data-visualization-kit
  version: "2.0.0"
  superset-version: "6.0.0"
  updated: "2026-04-21"
---

> **RAM Requirement:** Apache Superset requires a minimum of **4GB RAM** in production
> (Celery worker + Redis + PostgreSQL metadata + Gunicorn). It will OOM on a 2GB VPS under load.
> **This is a legacy-only path.** For new projects, use Metabase (VPS) or Evidence.dev (Netlify/Vercel).

# Apache Superset Skill

Production-ready Apache Superset maintenance for legacy analytics stacks. Covers SQL Lab, datasets, charts, dashboards, RBAC, RLS, embedding, REST API, Celery async, caching, Docker Compose, Kubernetes/Helm, and migration planning.

**Current stable version:** 6.0.0 (Dec 2024) | RC 6.1.0 (Apr 2025)

## When to Use

- Maintaining an existing Apache Superset workspace already in production or staging
- Updating SQL Lab queries, virtual datasets, charts, dashboards, or filters
- Troubleshooting Superset permissions, datasource wiring, caching, or dashboard behavior
- Configuring REST API access, guest token embedding, or async query execution
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
- `superset-core.md` - Full technical reference: installation, config, SQL Lab, datasets, charts, dashboards, filters, RBAC, RLS, REST API, embedding, caching, Celery, CLI, feature flags, v6.0 breaking changes
- `superset-migration.md` - Keep-vs-migrate criteria, migration triggers, target mapping to Metabase or Grafana

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
- Never hardcode `SECRET_KEY`; always read from environment variable

**Operations:**
- Watch query latency, cache hit behavior, and dashboard render cost
- Treat broken charts as data-contract issues first, UI issues second
- Record legacy decisions and migration blockers in project docs
- On v6.0 upgrade: cache invalidates due to MD5→SHA-256 hash change; plan for warm-up

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Maintain existing Superset estate | Apache Superset |
| SQL Lab plus reusable governed datasets | Apache Superset |
| Guest token embedding in app | Apache Superset |
| REST API / programmatic dashboard access | Apache Superset |
| Simpler BI for general stakeholders | Metabase |
| Operational, observability, or time-series dashboards | Grafana |
| New default DV portfolio BI path | Metabase |
| Legacy portfolio audit and migration planning | Apache Superset |

## Implementation Checklist

**Legacy Intake:**
- Confirm Superset is already the selected stack
- Inventory databases, datasets, dashboards, roles, and embeds
- Capture current breakages, business asks, and deployment constraints
- Note current version — check `references/superset-core.md` for v6.0 breaking changes if upgrading

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
- Validate `DOMAIN_ALLOWLIST` for embedded deployments

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
7. Upgrading to v6.0 without planning for SHA-256 hash migration and theme system rewrite

## Resources

**Official Documentation:**
- Apache Superset: https://superset.apache.org/
- Superset docs: https://superset.apache.org/docs/intro
- GitHub repo: https://github.com/apache/superset
- REST API (Swagger): `http://<host>:8088/api/v1/swagger` (when `SWAGGER_UI_ENABLED=True`)

**Data Visualization Kit Context:**
- Prefer Metabase for new general BI work
- Prefer Grafana for operational and time-series work
- Use Superset only when the project is already committed to it or migration analysis is part of the task

# Apache Superset Core

## Primary Building Blocks

- **SQL Lab**: ad hoc SQL exploration and query validation
- **Datasets**: reusable semantic sources for charts and dashboards
- **Charts**: configured views bound to datasets and metrics
- **Dashboards**: decision surfaces built from multiple charts and shared filters
- **Roles and permissions**: datasource, database, schema, and feature access boundaries

## Working Order

1. Validate the business question
2. Verify source schema and freshness
3. Stabilize SQL and dataset semantics
4. Configure charts
5. Compose dashboards around decision flow
6. Verify permissions and sharing behavior

## What Good Superset Work Looks Like

- Metrics are named consistently and reused
- Time columns and grains are explicit
- Chart configs are not carrying hidden business logic that belongs in SQL
- Dashboard filters map to real user questions
- Access control is intentional, not accidental

## Maintenance Heuristics

- Prefer dataset fixes before chart rewrites
- Prefer upstream modeling before deeply nested Superset SQL
- Prefer fewer trusted dashboards over many near-duplicate boards
- When embeds or multi-tenant use cases appear, re-check auth and row access immediately

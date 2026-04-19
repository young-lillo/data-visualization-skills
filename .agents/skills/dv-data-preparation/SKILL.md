---
name: dv-data-preparation
description: Ingest, clean, validate, transform, and shape data into visualization-ready outputs. Use when the user types `$dv-data-preparation` or when the task needs ETL, schema design, SQL/NoSQL queries, migrations, database tuning, or dashboard-ready dataset preparation.
license: MIT
argument-hint: "[goal / task / brief]"
metadata:
  author: data-visualization-kit
  version: "2.0.0"
---

# DV Data Preparation

Treat `$dv-data-preparation` as the canonical data preparation entrypoint and the canonical data-preparation methodology for Data Visualization Kit.

Production-ready guide for ingestion, data cleaning, validation, transformation, schema design, ETL patterns, and database-backed preparation work that feeds exactly one selected visualization path.

## Codex Adaptation

- Use this skill directly for `$dv-data-preparation` instead of delegating to a separate data-preparation workflow or prompt layer.
- Keep all resulting notes, exports, and prepared datasets inside the active project `docs/` tree when the task is project-scoped.
- Require SQL and/or Python whenever implementation details, transformations, or reproducible prep steps are produced.
- Produce clean, validated outputs that are ready for exactly one selected visualization path.

## When to Use

Use when:
- ingesting source data from files, databases, APIs, or mixed pipelines
- cleaning and validating raw business data before visualization
- designing schemas, models, or storage structures for prepared data
- writing SQL or MongoDB queries, joins, aggregations, and transformation logic
- building incremental ETL or watermark-based refresh flows
- optimizing database performance, indexes, migrations, backup, or operational reliability
- shaping final datasets for chart-ready, dashboard-ready, or semantic-model-ready use

## Working Order

1. Confirm the business goal and selected visualization path
2. Identify source systems, refresh expectations, and trust issues
3. Profile the raw data and prove data quality problems before rewriting logic
4. Choose the right preparation surface:
   - SQL-first relational shaping
   - document-oriented modeling
   - incremental ETL
   - schema redesign
5. Produce reproducible transformation steps
6. Validate the prepared outputs against downstream visualization needs
7. Record assumptions, transformations, and unresolved data risks in project docs

## Reference Navigation

### Core Preparation References

- `db-design.md` - schema design, transactional vs analytics modeling, fact/dimension planning
- `transactional.md` - OLTP-oriented modeling rules
- `analytics.md` - OLAP and star-schema oriented rules
- `incremental-etl.md` - watermark, append/update, idempotent load patterns

### MongoDB References

- `references/mongodb-crud.md` - CRUD operations and query patterns
- `references/mongodb-aggregation.md` - aggregation pipelines and transformation patterns
- `references/mongodb-indexing.md` - index strategy and performance tuning
- `references/mongodb-atlas.md` - Atlas setup, operations, and hosted patterns

### PostgreSQL References

- `references/postgresql-queries.md` - SELECT, JOIN, CTE, and window-function patterns
- `references/postgresql-psql-cli.md` - `psql` commands and scripting
- `references/postgresql-performance.md` - EXPLAIN, tuning, vacuum, and query optimization
- `references/postgresql-administration.md` - backup, replication, maintenance, user administration

### Stack-Specific References

- `stacks/postgres.md`
- `stacks/mysql.md`
- `stacks/sqlite.md`
- `stacks/bigquery.md`
- `stacks/d1_cloudflare.md`

## Python Utilities

Preparation and database utility scripts in `scripts/`:
- `db_migrate.py` - generate and apply migrations for MongoDB and PostgreSQL
- `db_backup.py` - backup and restore MongoDB and PostgreSQL
- `db_performance_check.py` - analyze slow queries and recommend indexes

```bash
python scripts/db_migrate.py --db mongodb --generate "add_user_index"
python scripts/db_backup.py --db postgres --output /backups/
python scripts/db_performance_check.py --db mongodb --threshold 100ms
```

## Data Preparation Mindset

1. **Prepared data is a product surface, not a temporary byproduct**
2. **Fix semantics before polishing visualization**
3. **Every transformation must be explainable and reproducible**
4. **Schema choice should follow access pattern, not habit**
5. **Incremental refresh logic must be explicit**
6. **Performance matters once the dataset leaves toy scale**
7. **Data quality checks belong inside the workflow**
8. **One canonical metric definition beats many local copies**
9. **Downstream chart needs should shape output tables**
10. **If the prep is not trustworthy, the dashboard is not trustworthy**

## Best Practices

**Preparation Strategy:**
- Start from business questions and downstream charts, not just source tables
- Prefer stable prepared models over repeated ad hoc transformations
- Keep data contracts explicit: grain, keys, freshness, null policy, metric definitions

**Relational Work:**
- Normalize for transactional systems, denormalize deliberately for analytics outputs
- Index foreign keys and common filter paths
- Use EXPLAIN ANALYZE when query cost matters

**Document and Mixed Data:**
- Use embedding for tight 1-to-few relationships
- Use references for large fan-out or reuse-heavy structures
- Use aggregation pipelines when document-native transformation is the right fit

**ETL and Quality:**
- Make incremental rules idempotent
- Validate row counts, duplicates, null spikes, and key integrity after each major transform
- Record assumptions whenever source data is patched or inferred

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| General ingestion, cleaning, validation | `$dv-data-preparation` |
| Schema or warehouse-ready model design | `db-design.md` + stack references |
| Relational query shaping | PostgreSQL references |
| MongoDB query or aggregation shaping | MongoDB references |
| Incremental refresh logic | `incremental-etl.md` |
| Database reliability, tuning, migrations | `database` agent + this skill |

## Output Rules

- Keep project-scoped notes in `projects/<slug>/docs/`
- State source systems, transformations, validation checks, and resulting prepared outputs
- Ensure prepared outputs are aligned to one selected visualization path
- Route to `$dv-data-visualize` after the prepared surface is trustworthy

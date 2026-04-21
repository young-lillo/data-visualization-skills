# Apache Superset Migration Guide

**Version scope:** 5.x → 6.x | Last updated: 2026-04-21

---

## Keep Superset When

- the workspace already has substantial analyst usage and SQL Lab is central to workflows
- datasets are reused across many dashboards — migration would require rebuilding semantic layer
- the team relies on Superset's multi-chart dashboard composition and filter design
- embedded analytics via guest token is already integrated into an application
- migration cost (rebuild effort, analyst retraining, data validation) exceeds operational pain
- RBAC and row-level security rules are deeply tied to Superset's permission model

## Move to Metabase When

- the team wants faster stakeholder onboarding with less admin overhead
- dashboard authoring should be simpler and more opinionated (Metabase's question-based model)
- the project is a general BI portfolio build, not a legacy estate
- analysts don't need SQL Lab — business users primarily consume pre-built dashboards
- the long-term kit default is Metabase and alignment benefits outweigh migration cost

## Move to Grafana When

- the dashboard is operational, alert-centric, or time-series first
- the stack already relies on Prometheus, Loki, Tempo, PostgreSQL metrics, or infrastructure telemetry
- operational drill-down matters more than BI-style exploration
- alerting and on-call workflows are the primary dashboard use case

---

## Migration Decision Questions

1. Which dashboards are still actively used? (Inventory before migrating)
2. Which metrics are canonical and must survive unchanged?
3. Are embeds, row-level security, or tenancy rules present? (These are expensive to rebuild)
4. Does the team need analyst SQL-first workflows or simpler stakeholder self-service?
5. Is the target tool chosen for the user problem or just for familiarity?
6. What is the estimated rebuild effort vs ongoing Superset operational cost?

---

## Superset Version Upgrade Path

### v5.x → v6.0 Checklist

Critical items before upgrading:

1. **Hash algorithm** — MD5 → SHA-256 breaks existing password hashes and cache keys
   - Add `HASH_ALGORITHM_FALLBACKS = ["md5"]` to support existing passwords during transition
   - Plan for cache invalidation: all cached query results will miss on first run
   - Warm up cache after upgrade: `superset warm-up-cache`

2. **Theme system** — complete rewrite
   - Remove: `APP_NAME`, `CUSTOM_FONT_URLS`, `THEME_OVERRIDES`
   - Replace with: `THEME_DEFAULT` using AntD V5 token structure

3. **Auth backend** — `AUTH_OID` deprecated in Flask-AppBuilder 5
   - Migrate to `AUTH_OAUTH` or `AUTH_LDAP`

4. **Export permissions** — `can_csv` role permission split into three
   - `can_export_data`, `can_export_image`, `can_copy_clipboard`
   - Audit and update all custom role definitions

5. **Legacy charts** — Area, Bar, Heatmap, Histogram, Line auto-migrated to ECharts
   - Validate visual output of all affected chart types post-upgrade
   - Deck.gl MapBox charts may reposition; review geo dashboards

6. **Docker image** — Chromium removed by default
   - If PDF export or thumbnail generation used: rebuild with `INCLUDE_CHROMIUM=true`

7. **Run migrations**:
   ```bash
   superset db upgrade
   superset init
   ```

### v4.x → v5.0 Checklist

- Rename `ALERT_REPORTS_EXECUTE_AS` → `ALERT_REPORTS_EXECUTORS`
- Rename `THUMBNAILS_EXECUTE_AS` → `THUMBNAILS_EXECUTORS`
- Remove `DASHBOARD_CROSS_FILTERS` from feature flags (now always on)
- Upgrade ClickHouse driver to `>=0.13.0` if used
- Remove legacy datasource editor: set `DISABLE_LEGACY_DATASOURCE_EDITOR: True`
- Remove `CSV_UPLOAD_MAX_SIZE` (use web server limits instead)

---

## Asset Export/Import for Migration

Export all assets from source instance:
```bash
superset export-dashboards --path ./export.zip
```

Import into target instance:
```bash
superset import-dashboards --path ./export.zip
```

Export/import datasets separately:
```bash
superset import-datasets --path ./datasets.yml
```

**Note:** Exported ZIPs include charts, dashboards, datasets, and database connection configs (without credentials). Credentials must be re-entered after import.

---

## Migration Risk Areas

| Area | Risk | Mitigation |
|---|---|---|
| RLS rules | Not portable to Metabase/Grafana | Document all clauses; rebuild in target |
| Guest token embeds | Metabase has embedding but different API | Re-implement embed flow in target tool |
| SQL Lab queries | Metabase uses question model; Grafana uses panel queries | Export saved queries; adapt SQL |
| Semantic datasets | Must rebuild metric definitions in target | Inventory and document all metrics first |
| Custom roles | Target tools have different RBAC models | Map Superset roles to target equivalents |
| Dashboard filters | Cross-filter behavior differs | Test filter UX thoroughly post-migration |

---

## Superset-to-Metabase Mapping

| Superset concept | Metabase equivalent |
|---|---|
| Virtual dataset (SQL) | Native question (SQL) |
| Physical dataset | Table in connected database |
| Chart | Question or visualization |
| Dashboard | Dashboard |
| Row-level security | Sandboxing (paid feature) or data permissions |
| SQL Lab | SQL editor (native questions) |
| Roles | Groups + Collection permissions |
| Guest token embed | Signed embedding (paid) or public sharing |

## Superset-to-Grafana Mapping

| Superset concept | Grafana equivalent |
|---|---|
| Dashboard | Dashboard |
| Chart | Panel |
| Dataset | Data source + query |
| SQL Lab | Explore → SQL editor |
| Filters | Dashboard variables |
| Alerts | Alerting rules |
| Roles | Teams + folder permissions |
| Row-level security | Data source-level filters (varies by plugin) |

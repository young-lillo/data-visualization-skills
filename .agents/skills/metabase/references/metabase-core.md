# Metabase Core Reference

**Last updated:** 2026-04-21

---

## Primary Building Blocks

- **Questions** - Saved explorations or SQL-backed results bound to a dataset or model
- **Models** - Reusable semantic sources with renamed columns, descriptions, and defined types
- **Metrics** - Trusted business calculations (aggregations) scoped to a table or model
- **Dashboards** - Curated decision surfaces: grid of cards with shared filters, drill-through, tabs
- **Collections** - Folder-like containers; governance and permission boundary
- **Filters** - Shared business controls applied across multiple dashboard cards
- **Segments** - Saved filter definitions scoped to a table (reusable WHERE clause)
- **Snippets** - Reusable SQL fragments referenced in native queries via `{{snippet: Name}}`

---

## Working Order

1. Define the business decisions the dashboard must support
2. Identify trusted source tables or models
3. Normalize business metrics and dimension naming
4. Create reusable models or questions
5. Compose dashboards for a clear audience and decision scope
6. Verify filters, drill paths, and sharing behavior

---

## Installation & Deployment

### Docker Compose (recommended for self-hosted)

```bash
docker pull metabase/metabase:latest
docker run -d \
  -p 3000:3000 \
  --name metabase \
  -e "MB_DB_TYPE=postgres" \
  -e "MB_DB_DBNAME=metabase" \
  -e "MB_DB_PORT=5432" \
  -e "MB_DB_USER=metabase" \
  -e "MB_DB_PASS=metabase" \
  -e "MB_DB_HOST=postgres" \
  metabase/metabase:latest
```

**Minimum RAM:** 1.5GB for OSS; 2GB recommended for production with Postgres metadata DB.

### JAR (alternative)

```bash
java -jar metabase.jar
# Env vars control all settings; no config file needed
```

### Key environment variables

```bash
MB_DB_TYPE=postgres          # metadata DB type: postgres, mysql, h2 (dev only)
MB_DB_HOST=localhost
MB_DB_PORT=5432
MB_DB_DBNAME=metabase
MB_DB_USER=metabase
MB_DB_PASS=secret
MB_SITE_URL=https://metabase.example.com
MB_ENCRYPTION_SECRET_KEY=32charmin  # Encrypt DB credentials at rest
MB_JETTY_PORT=3000
MB_EMBEDDING_SECRET_KEY=...         # For static/signed embed JWT signing
```

### Version detection

```bash
curl -s http://localhost:3000/api/session/properties | grep -o '"tag":"[^"]*"'
# v0.X.Y = OSS  |  v1.X.Y = Enterprise
```

---

## REST API

### Authentication

**API Key (admin tasks only — never for end-user embeds):**
```bash
curl -H "X-API-Key: $METABASE_ADMIN_API_KEY" \
  http://localhost:3000/api/dashboard
```

**Session token:**
```bash
curl -X POST http://localhost:3000/api/session \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"password"}'
# Returns {"id":"session-token"}

curl -H "X-Metabase-Session: $SESSION_TOKEN" \
  http://localhost:3000/api/dashboard
```

### Key endpoints

```
GET  /api/session/properties          → instance version, settings
GET  /api/database                    → list connected databases
GET  /api/database/metadata           → full schema (tables, fields)
GET  /api/search?models=dashboard     → search dashboards
GET  /api/dashboard/{id}             → dashboard details
GET  /api/card/{id}                  → question/model details
POST /api/dashboard/save             → save an x-ray dashboard
GET  /api/automagic-dashboards/database/{id}/candidates  → x-ray candidates
GET  /api/automagic-dashboards/table/{id}  → generate x-ray for table
```

---

## Good Metabase Signs

- Stakeholders can read labels without SQL translation
- The same metric means the same thing everywhere
- Collections separate curated assets from exploratory work
- Dashboards feel like guided BI, not unstructured card piles
- Models abstract away join complexity; questions stay readable
- Embedding tokens are signed server-side; no secrets reach the browser

---

## Maintenance Heuristics

- Prefer model fixes before question rewrites
- Prefer upstream modeling before deeply nested Metabase SQL
- Prefer fewer trusted dashboards over many overlapping boards
- When embeds or multi-tenant use cases appear, re-check auth and row access immediately
- On slowness: review the question's underlying SQL before blaming Metabase

# Apache Superset Core Reference

**Version scope:** 5.x → 6.1.x | Last updated: 2026-04-21

---

## Primary Building Blocks

- **SQL Lab** - Web-based SQL editor with async query execution, 6-hour time limits, query history
- **Datasets** - Reusable semantic sources (physical tables or virtual/SQL-defined) for charts and dashboards
- **Charts** - Configured visualizations bound to datasets and metrics (60+ chart types via ECharts)
- **Dashboards** - Decision surfaces built from multiple charts, shared filters, cross-filtering, drill-down
- **Roles and permissions** - RBAC with datasource, database, schema, and feature-level access boundaries
- **Row-Level Security (RLS)** - Per-dataset filter clauses scoped to user groups
- **REST API** - Full programmatic access with Swagger/OpenAPI docs at `/api/v1/swagger`
- **Embedded analytics** - Guest token API, domain allowlisting, iframe embedding
- **Caching layer** - Redis/Memcached with separate configs per cache purpose
- **Celery async** - Background SQL execution, scheduled reports, alerts, cache warming

---

## Installation & Deployment

### Docker Compose (Development / Staging)

Default stack:
```
nginx (reverse proxy) → superset:8088
redis:7 (cache/broker)
postgres:17 (metadata db)
superset-websocket:8080
superset-worker (Celery)
superset-worker-beat (Scheduler)
superset-node:9000 (Frontend build)
```

```bash
docker-compose up -d
# First run: initialize app
docker exec superset superset init
```

Key environment variables:
```
SUPERSET_PORT=8088
SUPERSET_LOG_LEVEL=debug
REDIS_PORT=6379
DATABASE_PORT=5432
WEBSOCKET_PORT=8080
```

### pip Installation

```bash
pip install apache-superset[postgres]   # or [mysql], [mssql], etc.
export FLASK_APP=superset.app:create_app
superset db upgrade
superset fab create-admin
superset load-examples
superset init
superset run -p 8088
```

### Kubernetes (Helm)

Chart: `apache/superset` in official Helm repo.

Minimal `values.yaml`:
```yaml
image:
  repository: apachesuperset.docker.scarf.sh/apache/superset
  tag: 6.0.0

postgresql:
  enabled: true
  auth:
    username: superset
    password: superset
    database: superset
  primary:
    persistence:
      enabled: true
      size: 10Gi

redis:
  enabled: true
  architecture: standalone

supersetNode:
  replicas: 1
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5

supersetWorker:
  replicas: 1

supersetCeleryBeat:
  enabled: true

supersetWebsockets:
  enabled: true

ingress:
  enabled: true
  ingressClassName: nginx
  hosts:
    - host: superset.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: superset-tls
      hosts:
        - superset.example.com
```

---

## Configuration (`superset_config.py`)

### Database

```python
SQLALCHEMY_DATABASE_URI = "postgresql://user:pass@localhost/superset"
SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### Security

```python
SECRET_KEY = os.environ.get("SECRET_KEY")  # Never hardcode — required for session signing
WTF_CSRF_ENABLED = True
WTF_CSRF_SSL_STRICT = False        # Set False for non-HTTPS dev
AUTH_TYPE = AUTH_DB                # AUTH_DB | AUTH_LDAP | AUTH_OAUTH | AUTH_REMOTE_USER
HASH_ALGORITHM = "sha256"          # Default in v6.0; was MD5 in v5.x
HASH_ALGORITHM_FALLBACKS = ["md5"] # Backward compat during migration
```

**LDAP:**
```python
AUTH_TYPE = AUTH_LDAP
AUTH_LDAP_SERVER = "ldap://ldap.example.com"
AUTH_LDAP_USERNAME_FORMAT = "cn={username},dc=example,dc=com"
```

**OAuth (Google, GitHub, etc.):**
```python
AUTH_TYPE = AUTH_OAUTH
OAUTH_PROVIDERS = [{
    "name": "google",
    "token_url": "https://oauth2.googleapis.com/token",
    "authorization_url": "https://accounts.google.com/o/oauth2/auth",
    "client_id": os.environ.get("GOOGLE_OAUTH_CLIENT_ID"),
    "client_secret": os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET")
}]
```

**Remote User (OIDC, Kerberos):**
```python
AUTH_TYPE = AUTH_REMOTE_USER
AUTH_REMOTE_USER_ENVIRON_VAR = "HTTP_X_REMOTE_USER"
```

### JWT (for REST API)

```python
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA_SECONDS = 3600
JWT_TOKEN_LOCATION = ["headers"]
JWT_TOKEN_LOCATION_HEADER = "Authorization"
```

### SQL Lab

```python
DEFAULT_SQLLAB_LIMIT = 1000
SQLLAB_TIMEOUT = 30
SQLLAB_VALIDATION_TIMEOUT = 10
SQL_MAX_ROW = 100000
DISPLAY_MAX_ROW = 10000
SQLLAB_ASYNC_TIME_LIMIT_SEC = 21600  # 6 hours
```

### Async Queries (Celery)

```python
GLOBAL_ASYNC_QUERIES = True

CELERY_CONFIG = {
    "broker_url": "redis://localhost:6379/2",
    "result_backend": "redis://localhost:6379/3",
    "imports": [
        "superset.sql_lab.tasks",
        "superset.tasks.celery_app"
    ],
    "worker_prefetch_multiplier": 10,
    "worker_max_tasks_per_child": 1000,
    "beat_scheduler": "redbeat.RedBeatScheduler",
    "timezone": "UTC",
    "task_soft_time_limit": 18000,
    "task_time_limit": 21600
}
```

Start workers:
```bash
celery -A superset.tasks.celery_app worker --loglevel=info -c 4
celery -A superset.tasks.celery_app beat --loglevel=info
```

### Caching

| Config key | Purpose | Default timeout |
|---|---|---|
| `CACHE_CONFIG` | UI state, query results | 86400s |
| `DATA_CACHE_CONFIG` | Chart/query data | 86400s |
| `FILTER_STATE_CACHE_CONFIG` | Dashboard filters | 90 days |
| `EXPLORE_FORM_DATA_CACHE_CONFIG` | Explore form state | 7 days |
| `THUMBNAIL_CACHE_CONFIG` | Chart thumbnails | 7 days |

```python
CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_REDIS_URL": "redis://localhost:6379/0",
    "CACHE_DEFAULT_TIMEOUT": 86400
}
DATA_CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_REDIS_URL": "redis://localhost:6379/1"
}
FILTER_STATE_CACHE_CONFIG = {
    "CACHE_TYPE": "SupersetMetastoreCache",
    "CACHE_TIMEOUT": 7776000
}
EXPLORE_FORM_DATA_CACHE_CONFIG = {
    "CACHE_TYPE": "SupersetMetastoreCache",
    "CACHE_TIMEOUT": 604800
}
```

Cache type options: `RedisCache`, `MemcachedCache`, `SimpleCache` (dev), `NullCache` (testing), `SupersetMetastoreCache` (DB-backed).

### Theming (v6.0+)

```python
# Removed: APP_NAME, CUSTOM_FONT_URLS, THEME_OVERRIDES
# Use THEME_DEFAULT with AntD V5 tokens instead
THEME_DEFAULT = {
    "token": {
        "brandAppName": "My Analytics",
        "brandColor": "#1890ff",
        "fontUrls": ["https://fonts.googleapis.com/css?family=Roboto:300,400,500"],
        "chartPalette": ["#1f77b4", "#ff7f0e", "#2ca02c"]
    }
}
```

### Key Feature Flags

```python
FEATURE_FLAGS = {
    # Core
    "SQLLAB_BACKEND_PERSISTENCE": True,     # Persist SQL queries to DB
    "DASHBOARD_CROSS_FILTERS": True,        # Cross-filter between widgets
    "ROW_LEVEL_SECURITY": True,             # Enable RLS
    "EMBEDDED_SUPERSET": True,              # Guest token embedding
    # Performance
    "DASHBOARD_VIRTUALIZATION": True,       # Virtual scroll for large dashboards
    "ALLOW_FULL_CSV_EXPORT": False,         # Restrict large CSVs (high-memory risk)
    # Functionality
    "CSS_TEMPLATES": True,                  # Per-dashboard CSS customization
    "DISABLE_LEGACY_DATASOURCE_EDITOR": True,
    # Reports & Alerts
    "ALERTS_ATTACH_REPORTS": True,
    "SCHEDULED_QUERIES": True,
    # Dev only
    "SHOW_STACKTRACE": False,
}
```

---

## Database Connectivity

Superset connects via SQLAlchemy to 50+ databases.

**Cloud:** BigQuery, Redshift, Snowflake, Azure Synapse, Athena
**Enterprise:** Oracle, SQL Server, SAP HANA, Teradata
**Analytics:** Databricks, Pinot, Druid, Trino, DuckDB
**Traditional:** PostgreSQL, MySQL, MariaDB, SQLite
**Time-series:** ClickHouse, QuestDB, InfluxDB, TimescaleDB

SQLAlchemy URI formats:
```
postgresql://user:password@host:5432/database
mysql://user:password@host:3306/database
snowflake://user:password@account/database/schema
bigquery://project-id/dataset-id
redshift://user:password@cluster.region.redshift.amazonaws.com:5439/database
```

Each database has a `DbEngineSpec` subclass controlling connection pooling, query safety, type conversion, and timezone handling.

---

## REST API

Swagger docs: `http://<host>:8088/api/v1/swagger` (requires `SWAGGER_UI_ENABLED=True`)

### Authentication

**Session-based:**
```bash
curl -X POST http://localhost:8088/api/v1/security/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
# Use returned session cookie in subsequent requests
```

**JWT:**
```bash
curl -X POST http://localhost:8088/api/v1/security/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin","refresh":true}'
# Response: {"access_token":"eyJ0eXAi...","refresh_token":"..."}

curl -H "Authorization: Bearer eyJ0eXAi..." \
  http://localhost:8088/api/v1/datasets/
```

### Key Endpoints

```
# Datasets
GET/POST  /api/v1/datasets
GET/PUT/DELETE  /api/v1/datasets/{id}

# Charts
GET/POST  /api/v1/chart/
GET/PUT/DELETE  /api/v1/chart/{id}
POST  /api/v1/chart/data          # Execute chart query

# Dashboards
GET/POST  /api/v1/dashboard/
GET/PUT/DELETE  /api/v1/dashboard/{id}

# Security
POST  /api/v1/security/login
POST  /api/v1/security/guest_token

# Column values
GET  /api/v1/dataset/{id}/column/{col}/values/
```

**Chart data query:**
```json
POST /api/v1/chart/data
{
  "datasource": {"id": 1, "type": "table"},
  "queries": [{
    "columns": ["col1", "col2"],
    "filters": [],
    "orderby": [["col1", "asc"]],
    "limit": 1000
  }]
}
```

Async execution returns HTTP 202 with job ID when `GLOBAL_ASYNC_QUERIES=True`.

---

## RBAC & Row-Level Security

### Default Roles

| Role | Permissions | Use case |
|---|---|---|
| Admin | Full system access, user management | Administrators |
| Alpha | SQL Lab, explore, create/edit dashboards | Advanced analysts |
| Gamma | View dashboards, charts, databases | Business users |
| SQL Lab | Execute SQL Lab queries only | SQL analysts |
| Public | Anonymous dashboard viewing (optional) | Public dashboards |

### Permission Structure

```
database.access     → access to a database
schema.access       → access to a schema
datasource.access   → access to a specific dataset/table
can_export_data     → CSV export (was can_csv in v5.x)
can_export_image    → image export (v6.0+)
can_copy_clipboard  → clipboard copy (v6.0+)
can_share_dashboard
```

### Row-Level Security

Configure under Security → Row Level Security:
- `datasource_id` - which dataset to apply to
- `clause` - SQL WHERE fragment: `region = 'US'`
- `groupKey` - role/group name this applies to

Example: dataset 5, group "sales_region", clause `region='US'` → users in that group only see US rows.

---

## Embedded Analytics

Requires `FEATURE_FLAGS["EMBEDDED_SUPERSET"] = True`.

### Guest Token API

```bash
POST /api/v1/security/guest_token
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "resources": [{"type": "dashboard", "id": 123}],
  "rls": [{"clause": "country='USA'"}],
  "user": {"username": "guest_user", "first_name": "John", "last_name": "Doe"}
}

# Response: {"token": "eyJ0eXAi...", "expires_in": 3600}
```

### Embedding via iframe

```html
<iframe
  src="http://localhost:8088/embedded/dashboard/123?token=eyJ0eXAi..."
  width="100%"
  height="600"
  frameborder="0">
</iframe>
```

### Domain Allowlisting

```python
EMBEDDED_SUPERSET = True
GUEST_TOKEN_JWT_ALGORITHM = "HS256"
GUEST_TOKEN_JWT_EXP_SECONDS = 3600
DOMAIN_ALLOWLIST = ["example.com", "app.example.com", "localhost"]
```

---

## CLI Commands

```bash
# Setup
superset db upgrade                        # Run DB migrations
superset fab create-admin \
  --username admin --firstname Admin \
  --lastname User --email admin@example.com \
  --password admin
superset load-examples --force             # Load sample data
superset init                              # Initialize roles/permissions

# Import / Export
superset export-dashboards                 # Export to ZIP
superset import-dashboards --path file.zip
superset import-datasets --path datasets.yml

# Cache
superset warm-up-cache
superset thumbnail-query --chart-id 1 --force

# Debug
superset shell                             # Flask shell with app context
superset validate-sql "SELECT 1"
superset export-openapi --output api.json
```

---

## Working Order

1. Validate the business question
2. Verify source schema and freshness
3. Stabilize SQL and dataset semantics
4. Configure charts
5. Compose dashboards around decision flow
6. Verify permissions and sharing behavior

---

## What Good Superset Work Looks Like

- Metrics are named consistently and reused across dashboards
- Time columns and grains are explicit
- Chart configs are not carrying hidden business logic that belongs in SQL
- Dashboard filters map to real user questions
- Access control is intentional, not accidental
- `SECRET_KEY` and `JWT_SECRET_KEY` are loaded from environment, never hardcoded
- Cache layers configured per purpose (UI vs data vs filters vs thumbnails)

---

## Maintenance Heuristics

- Prefer dataset fixes before chart rewrites
- Prefer upstream modeling before deeply nested Superset SQL
- Prefer fewer trusted dashboards over many near-duplicate boards
- When embeds or multi-tenant use cases appear, re-check auth and row access immediately
- On slowness: check cache hit rate before blaming the database

---

## v6.0 Breaking Changes (Dec 2024)

| Area | Change | Action needed |
|---|---|---|
| Hash algorithm | MD5 → SHA-256 | Plan cache invalidation on upgrade; use `HASH_ALGORITHM_FALLBACKS = ["md5"]` during migration |
| Theme system | `THEME_OVERRIDES`, `APP_NAME`, `CUSTOM_FONT_URLS` removed | Migrate to `THEME_DEFAULT` with AntD V5 tokens |
| Auth | Flask-AppBuilder 5: `AUTH_OID` deprecated | Migrate to `AUTH_OAUTH` or `AUTH_LDAP` |
| Export perms | `can_csv` split into 3 permissions | Update role definitions |
| Legacy charts | Area, Bar, Heatmap, Histogram, Line auto-migrated to ECharts | Validate chart appearance post-upgrade |
| Docker image | Chromium removed by default | Set `INCLUDE_CHROMIUM=true` build arg if thumbnails/PDF needed |

## v5.0 Breaking Changes

| Area | Change |
|---|---|
| Legacy datasource editor | Removed; use `DISABLE_LEGACY_DATASOURCE_EDITOR: True` |
| `ALERT_REPORTS_EXECUTE_AS` | Renamed to `ALERT_REPORTS_EXECUTORS` |
| `THUMBNAILS_EXECUTE_AS` | Renamed to `THUMBNAILS_EXECUTORS` |
| `DASHBOARD_CROSS_FILTERS` feature flag | Removed (now always available) |
| ClickHouse driver | Requires `>=0.13.0` |

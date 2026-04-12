---
name: ck:data-viz-deploy-metabase
description: "Deploy a Metabase analytics dashboard with Docker. Use when deploy
  target is metabase. Generates docker-compose.yml, setup guide, and data import
  instructions. Triggers on: 'metabase', 'docker dashboard', 'self-hosted analytics'."
argument-hint: "[project-dir]"
metadata:
  phase: deploy
  version: "1.0.0"
---

# Data-Viz Metabase Deploy Skill

Deploy Metabase + PostgreSQL via Docker Compose. Use only when intake deploy target = metabase.

## Prerequisites Check

Before proceeding, verify:
```bash
docker --version        # Must be installed
docker compose version  # Must be v2+
```

If Docker not installed: direct user to https://docs.docker.com/desktop/ and fallback to Streamlit.

## Step 1: Generate docker-compose.yml

Copy `templates/docker-compose.yml` to project directory.

**SECURITY WARNING:** Default Metabase credentials (`metabase/metabase`) are for local use only.
Change the admin password immediately after first login. Never expose port 3000 publicly.

## Step 2: Import CSV to PostgreSQL

Generate `import-csv-to-postgres.py` for loading clean_dataset.csv into Postgres:

```python
"""Import clean_dataset.csv into PostgreSQL for Metabase."""
import pandas as pd
from sqlalchemy import create_engine

# Connection (matches docker-compose.yml defaults)
engine = create_engine("postgresql://metabase:metabase@localhost:5432/metabase")

# Load cleaned dataset
df = pd.read_csv("data/processed/clean_dataset.csv")

# Infer table name from project
table_name = "{project_name}".replace("-", "_")

# Write to postgres (replace if exists)
df.to_sql(table_name, engine, if_exists="replace", index=False)
print(f"Imported {len(df):,} rows into table '{table_name}'")
print(f"Connect Metabase to: localhost:5432 / database: metabase / table: {table_name}")
```

Install dependency: `pip install sqlalchemy psycopg2-binary pandas`

## Step 3: Start Metabase

```bash
# Start containers (detached)
docker compose up -d

# Wait ~60s for Metabase to initialize, then open:
# http://localhost:3000
```

Monitor startup:
```bash
docker compose logs -f metabase
# Ready when you see: "Metabase Initialization COMPLETE"
```

## Step 4: Configure Metabase UI

1. Open http://localhost:3000
2. Create admin account (use a strong password — not the default)
3. **Add Database:** Settings → Databases → Add database
   - Type: PostgreSQL
   - Host: `postgres` (Docker network name)
   - Port: `5432`
   - Database: `metabase`
   - Username: `metabase`
   - Password: `metabase`
4. Run import script: `python import-csv-to-postgres.py`
5. Sync database in Metabase: Settings → Databases → Sync database schema

## Step 5: Create Dashboard from analysis-plan.md

For each question in `analysis-plan.md`:
1. New → Question → select your table
2. Apply filters/aggregations matching the question
3. Choose visualization matching chart type recommendation
4. Save and add to a new Dashboard

## Teardown

```bash
# Stop containers (preserve data)
docker compose stop

# Remove containers + volumes (destroys all data)
docker compose down -v
```

## Limitations vs Streamlit

| Aspect | Metabase | Streamlit |
|--------|----------|-----------|
| Setup | Docker required | pip install only |
| Customization | UI-driven (limited) | Code-driven (full) |
| Deploy | Self-hosted only | Streamlit Cloud (free) |
| Interactivity | Filters, drill-down | Full Python control |
| Best for | Business users, BI | Developer portfolios |

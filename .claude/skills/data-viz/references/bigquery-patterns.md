# BigQuery Patterns

> Content added in Phase 3 (eda-and-cleaning).

Patterns for connecting to, querying, and loading BigQuery data in Streamlit analytics apps.

## Authentication

### Option 1: Service Account JSON (Recommended for Cloud)
```bash
# Set env var pointing to service account key file
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

### Option 2: Streamlit Secrets (for Streamlit Cloud)
```toml
# .streamlit/secrets.toml
BIGQUERY_CREDENTIALS_JSON = '{"type": "service_account", "project_id": "...", ...}'
```

```python
import json
import streamlit as st
from google.oauth2 import service_account

creds_dict = json.loads(st.secrets["BIGQUERY_CREDENTIALS_JSON"])
credentials = service_account.Credentials.from_service_account_info(
    creds_dict,
    scopes=["https://www.googleapis.com/auth/bigquery.readonly"]
)
```

### Option 3: Application Default Credentials (local dev)
```bash
gcloud auth application-default login
```

## Reading Data with pandas-gbq

```python
import pandas_gbq

# Basic query
df = pandas_gbq.read_gbq(
    "SELECT * FROM `project.dataset.table` LIMIT 10000",
    project_id="your-project-id",
    credentials=credentials
)

# With Streamlit caching
@st.cache_data(ttl=3600)
def load_bq_data(query: str, project_id: str) -> pd.DataFrame:
    return pandas_gbq.read_gbq(query, project_id=project_id, credentials=credentials)
```

## Cost-Saving Query Patterns

```sql
-- Always SELECT specific columns (avoid SELECT *)
SELECT order_id, date, revenue, category
FROM `project.dataset.orders`
WHERE DATE(date) >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)

-- Use LIMIT during development
SELECT * FROM `project.dataset.large_table` LIMIT 10000

-- Partition pruning (if table is date-partitioned)
WHERE _PARTITIONDATE >= '2024-01-01'
```

## Common Data Types

| BigQuery Type | pandas dtype | Notes |
|--------------|-------------|-------|
| DATE | object → convert to datetime | `pd.to_datetime(df["date"])` |
| TIMESTAMP | datetime64[ns] | Auto-converted |
| FLOAT64 | float64 | |
| INT64 | int64 | |
| STRING | object | |
| BOOLEAN | bool | |
| ARRAY | object (list) | Needs explode() |
| STRUCT | object (dict) | Needs json_normalize() |

## Performance Tips

- Cache query results with `@st.cache_data(ttl=3600)` — avoid re-querying on every rerender
- Use `TABLESAMPLE SYSTEM (10 PERCENT)` for exploratory queries on large tables
- Materialize expensive queries as views or cached tables
- Monitor costs: BigQuery charges $5/TB scanned (first 1TB/month free)

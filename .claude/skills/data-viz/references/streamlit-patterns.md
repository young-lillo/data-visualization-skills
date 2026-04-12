# Streamlit Patterns

> Content added in Phase 5 (tech-stack-and-workflow).

Common Streamlit patterns for data analytics portfolio apps.

## Data Loading with Caching

```python
import streamlit as st
import pandas as pd

# CSV loading — cached for the session
@st.cache_data
def load_csv(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

# URL loading with encoding fallback
@st.cache_data
def load_url(url: str) -> pd.DataFrame:
    try:
        return pd.read_csv(url)
    except UnicodeDecodeError:
        return pd.read_csv(url, encoding="latin-1")

# BigQuery loading — use cache_resource for connection, cache_data for data
@st.cache_resource
def get_bq_credentials():
    import json
    from google.oauth2 import service_account
    creds_dict = json.loads(st.secrets["BIGQUERY_CREDENTIALS_JSON"])
    return service_account.Credentials.from_service_account_info(creds_dict)

@st.cache_data(ttl=3600)
def load_bigquery(query: str, project_id: str) -> pd.DataFrame:
    import pandas_gbq
    credentials = get_bq_credentials()
    return pandas_gbq.read_gbq(query, project_id=project_id, credentials=credentials)
```

## Layout Patterns

```python
# Wide layout with title
st.set_page_config(page_title="My Dashboard", layout="wide")
st.title("Dashboard Title")
st.markdown("**Industry:** Ecommerce | **Dataset:** orders.csv")

# KPI metric cards
col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Revenue", "$1.2M", "+12%")
col2.metric("Orders", "8,432", "+5%")
col3.metric("AOV", "$142", "-2%")
col4.metric("Customers", "3,201", "+8%")

# Two charts side by side
col_left, col_right = st.columns(2)
with col_left:
    st.plotly_chart(fig_bar, use_container_width=True)
with col_right:
    st.plotly_chart(fig_line, use_container_width=True)

# Sidebar filters
with st.sidebar:
    st.header("Filters")
    date_range = st.date_input("Date Range", value=(min_date, max_date))
    selected_region = st.multiselect("Region", options=df["region"].unique())
    if selected_region:
        df = df[df["region"].isin(selected_region)]
```

## Chart Rendering

```python
# Plotly (interactive, default choice)
import plotly.express as px
st.plotly_chart(fig, use_container_width=True)

# Altair (statistical, declarative)
import altair as alt
st.altair_chart(chart, use_container_width=True)
```

## config.toml Template

```toml
[theme]
primaryColor = "#FF6B35"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
font = "sans serif"

[server]
maxUploadSize = 200
enableXsrfProtection = true

[client]
toolbarMode = "minimal"
```

## Streamlit Cloud Deploy

1. Push repo to GitHub (must have `app.py` + `requirements.txt` at root)
2. Go to [share.streamlit.io](https://share.streamlit.io) → "New app"
3. Select repo, branch (main), and entry file (`app.py`)
4. Add secrets at **Settings → Secrets** (never commit `.streamlit/secrets.toml`)
5. App auto-redeploys on push to main

## Secrets Pattern

```toml
# .streamlit/secrets.toml (gitignored!)
BIGQUERY_CREDENTIALS_JSON = '{"type": "service_account", ...}'
KAGGLE_API_TOKEN = "your_token_here"
```

```python
# Access in app
import streamlit as st
creds = st.secrets["BIGQUERY_CREDENTIALS_JSON"]
```

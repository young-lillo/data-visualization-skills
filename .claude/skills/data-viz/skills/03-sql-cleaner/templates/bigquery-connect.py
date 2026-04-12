"""
BigQuery connection wrapper for data-viz skill.
Loads credentials from environment or Streamlit secrets.
Returns a cached pandas DataFrame for use in Streamlit apps.

Usage:
    from templates.bigquery_connect import load_bigquery_table
    df = load_bigquery_table("project.dataset.table")
"""

import os
import json
import pandas as pd


def get_credentials():
    """Load BigQuery credentials from env var or Streamlit secrets."""
    # Option 1: Service account JSON file via env var
    creds_file = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if creds_file and os.path.exists(creds_file):
        from google.oauth2 import service_account
        return service_account.Credentials.from_service_account_file(
            creds_file,
            scopes=["https://www.googleapis.com/auth/bigquery.readonly"]
        )

    # Option 2: JSON string via env var
    creds_json = os.getenv("BIGQUERY_CREDENTIALS_JSON")
    if creds_json:
        from google.oauth2 import service_account
        creds_dict = json.loads(creds_json)
        return service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=["https://www.googleapis.com/auth/bigquery.readonly"]
        )

    # Option 3: Application default credentials (local dev)
    try:
        import google.auth
        credentials, _ = google.auth.default()
        return credentials
    except Exception:
        raise RuntimeError(
            "No BigQuery credentials found. Set GOOGLE_APPLICATION_CREDENTIALS "
            "or BIGQUERY_CREDENTIALS_JSON environment variable."
        )


def load_bigquery_table(
    table: str,
    limit: int = 100_000,
    where_clause: str = ""
) -> pd.DataFrame:
    """
    Load a BigQuery table into a DataFrame.

    Args:
        table: Fully qualified table name (project.dataset.table)
        limit: Max rows to load (default 100k for EDA)
        where_clause: Optional WHERE clause (e.g., "WHERE date >= '2024-01-01'")

    Returns:
        pandas DataFrame
    """
    import pandas_gbq

    parts = table.split(".")
    if len(parts) != 3:
        raise ValueError(f"Invalid table format: '{table}'. Expected: project.dataset.table")

    project_id = parts[0]
    query = f"SELECT * FROM `{table}` {where_clause} LIMIT {limit}"

    credentials = get_credentials()
    print(f"Loading: {query}")
    df = pandas_gbq.read_gbq(query, project_id=project_id, credentials=credentials)
    print(f"Loaded {len(df):,} rows × {df.shape[1]} cols from {table}")
    return df


# Streamlit-cached version (import only in Streamlit context)
def get_streamlit_loader():
    """Returns a @st.cache_data wrapped version for use in Streamlit apps."""
    try:
        import streamlit as st

        @st.cache_data(ttl=3600)
        def cached_load(table: str, limit: int = 100_000) -> pd.DataFrame:
            return load_bigquery_table(table, limit=limit)

        return cached_load
    except ImportError:
        return load_bigquery_table

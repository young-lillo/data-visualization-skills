---
name: ck:data-viz-cleaner
description: "Clean datasets for analytics. Activates during data cleaning phase:
  handles nulls, deduplication, type fixes. Outputs clean_dataset.csv.
  Triggers on: 'clean data', 'handle nulls', 'remove duplicates', 'data cleaning'."
argument-hint: "[dataset-path]"
metadata:
  phase: cook
  version: "1.0.0"
---

# Data-Viz SQL Cleaner Skill

Apply cleaning templates based on EDA findings. Output `data/processed/clean_dataset.csv`.

## Inputs

- EDA column summary (from `02-eda` output)
- `intake-summary.md` (for dataset source)

## Template Selection Logic

Based on EDA cleaning needs:

| EDA Finding | Apply Template |
|-------------|---------------|
| Nulls > 5% in any column | `templates/clean-nulls.sql` pattern |
| Duplicate rows detected | `templates/dedup.sql` pattern |
| BigQuery source | Use `templates/bigquery-connect.py` wrapper |
| Type mismatch (dates stored as strings) | Pandas cast: `pd.to_datetime()` |
| Numeric stored as string | Pandas cast: `pd.to_numeric(errors='coerce')` |

## Python Cleaning Script

Generate and run this script (adapt column names from EDA output):

```python
import pandas as pd
from pathlib import Path

# Load
df = pd.read_csv("data/raw/dataset.csv")  # path from intake-summary.md
original_rows = len(df)

# 1. Remove exact duplicates
df = df.drop_duplicates()
print(f"Dedup: {original_rows - len(df)} rows removed")

# 2. Handle nulls — strategy per column type
for col in df.select_dtypes(include="number").columns:
    null_pct = df[col].isnull().mean()
    if null_pct > 0.05 and null_pct < 0.30:
        df[col] = df[col].fillna(df[col].median())
    elif null_pct >= 0.30:
        print(f"WARNING: {col} has {null_pct:.1%} nulls — dropping column")
        df = df.drop(columns=[col])

for col in df.select_dtypes(include="object").columns:
    null_pct = df[col].isnull().mean()
    if null_pct > 0.05:
        df[col] = df[col].fillna("Unknown")

# 3. Fix date columns (auto-detect common date column names)
date_patterns = ["date", "time", "created", "updated", "purchased", "ordered"]
for col in df.columns:
    if any(p in col.lower() for p in date_patterns):
        try:
            df[col] = pd.to_datetime(df[col], infer_datetime_format=True)
        except Exception:
            pass

# 4. Fix numeric stored as string (remove currency symbols, commas)
for col in df.select_dtypes(include="object").columns:
    sample = df[col].dropna().head(10).astype(str)
    if sample.str.match(r"^[\$\€\£]?[\d,\.]+$").mean() > 0.8:
        df[col] = pd.to_numeric(df[col].str.replace(r"[^\d\.]", "", regex=True), errors="coerce")

# 5. Save
Path("data/processed").mkdir(parents=True, exist_ok=True)
df.to_csv("data/processed/clean_dataset.csv", index=False)
print(f"Saved: data/processed/clean_dataset.csv ({len(df):,} rows, {df.shape[1]} cols)")
```

## SQL Templates (for SQL-native sources)

See `templates/clean-nulls.sql` and `templates/dedup.sql` for parameterized SQL patterns.
For BigQuery sources, see `templates/bigquery-connect.py`.

## Output

- `data/processed/clean_dataset.csv` — cleaned dataset
- Console: row count before/after, columns dropped, nulls filled

## Validation

After cleaning, run quick sanity check:
```python
assert df.isnull().sum().sum() == 0 or print("WARNING: Nulls remain in processed dataset")
assert df.duplicated().sum() == 0 or print("WARNING: Duplicates remain")
print(f"Clean dataset: {len(df):,} rows × {df.shape[1]} cols")
```

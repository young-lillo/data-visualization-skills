---
name: ck:data-viz-eda
description: "Run exploratory data analysis on any dataset. Activates during EDA phase:
  loads data, profiles with ydata-profiling, outputs column summary and cleaning needs.
  Triggers on: 'EDA', 'profile data', 'explore dataset', 'data profiling'."
argument-hint: "[dataset-path-or-intake-summary]"
metadata:
  phase: cook
  version: "1.0.0"
---

# Data-Viz EDA Skill

Load dataset from `intake-summary.md`, generate ydata-profiling HTML report, and
output structured column summary for downstream cleaning and analysis planning.

## Inputs

Read `intake-summary.md` from working directory to get:
- Dataset source type and path/slug
- Industry vertical (for context)

## Dataset Loading

### Local CSV
```python
import pandas as pd
from pathlib import Path

def load_csv(path: str) -> pd.DataFrame:
    try:
        df = pd.read_csv(path)
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin-1")
    if len(df) > 500_000:
        print(f"WARNING: Large dataset ({len(df):,} rows). Using minimal profiling.")
    return df
```

### URL CSV
```python
df = pd.read_csv(url)
```

### Kaggle Dataset
```python
# 1. Check auth
import subprocess
result = subprocess.run(["kaggle", "datasets", "files", slug], capture_output=True)
if result.returncode != 0:
    raise RuntimeError("Kaggle not authenticated. Run: kaggle datasets list")

# 2. Download and unzip
Path("./data/raw").mkdir(parents=True, exist_ok=True)
subprocess.run(["kaggle", "datasets", "download", "-d", slug, "-p", "./data/raw", "--unzip"], check=True)

# 3. Find first CSV
csvs = list(Path("./data/raw").glob("**/*.csv"))
df = pd.read_csv(csvs[0])
```

### BigQuery
```python
import pandas_gbq
# Credentials via GOOGLE_APPLICATION_CREDENTIALS env var or st.secrets
df = pandas_gbq.read_gbq(f"SELECT * FROM `{table}` LIMIT 100000", project_id=project_id)
```

## EDA Report Generation

```python
from ydata_profiling import ProfileReport
from pathlib import Path

Path("reports").mkdir(exist_ok=True)

# Use minimal=True for datasets > 100k rows
minimal = len(df) > 100_000
report = ProfileReport(df, minimal=minimal, title="EDA Report", explorative=True)
report.to_file("reports/eda_report.html")
print("EDA report saved: reports/eda_report.html")
```

## Output: Structured Column Summary

After generating the HTML report, output this structured summary (print or write to console):

```
## EDA Summary

Dataset: {source}
Rows: {count:,}
Columns: {count}
Duplicate rows: {count} ({pct:.1f}%)
Memory usage: {size}

### Column Profile
| Column | Type | Null % | Unique | Sample Values |
|--------|------|--------|--------|---------------|
| ...    | ...  | ...    | ...    | ...           |

### Cleaning Needs
- Columns with >5% nulls: {list or "none"}
- Suspected duplicate rows: {yes/no}
- Type mismatches detected: {list or "none"}
- Outliers detected (numeric cols >3σ): {list or "none"}
```

Generate this summary with:
```python
summary = {
    "rows": len(df),
    "columns": df.shape[1],
    "duplicates": df.duplicated().sum(),
    "null_cols": df.columns[df.isnull().mean() > 0.05].tolist(),
    "dtypes": df.dtypes.to_dict(),
    "null_pct": (df.isnull().mean() * 100).round(1).to_dict(),
    "unique_counts": df.nunique().to_dict()
}
```

## Outputs

- `reports/eda_report.html` — full interactive profile
- Console/chat: column summary + cleaning needs list

## Next Step

Pass column summary to:
- `03-sql-cleaner` — for cleaning based on detected issues
- `04-analysis-planner` — for column cross-reference with industry template

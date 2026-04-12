---
name: ck:data-viz-tester
description: "Validate data analytics apps with schema tests, Streamlit AppTest,
  and CI/CD setup. Triggers on: 'test', 'validate', 'CI/CD', 'run tests',
  'check data quality', 'github actions'."
argument-hint: "[project-dir]"
metadata:
  phase: test
  version: "1.0.0"
---

# Data-Viz Tester Skill

Generate and run validation suite: Pandera schema, Streamlit AppTest, GitHub Actions CI.

## Inputs

- `data/processed/clean_dataset.csv` — cleaned dataset
- EDA column summary — types, ranges, null rates
- `app.py` — generated Streamlit app
- `stack-decision.md` — to detect BigQuery/Kaggle for CI secrets

## Step 1: Generate Pandera Schema

Read EDA column summary. Generate `tests/test-data-quality.py`:

```python
import pandera as pa
import pandas as pd
import pytest

# Auto-generated schema — tighten nullable/checks as needed
schema = pa.DataFrameSchema({
    # Numeric columns: ge(0) for non-negative, nullable based on EDA null %
    # "{numeric_col}": pa.Column(float, [pa.Check.ge(0)], nullable=False),

    # String columns: nullable if EDA null % > 0
    # "{string_col}": pa.Column(str, nullable=True),

    # Date columns: regex pattern
    # "{date_col}": pa.Column(str, pa.Check.str_matches(r"\d{4}-\d{2}-\d{2}"), nullable=False),

    # ID columns: uniqueness
    # "{id_col}": pa.Column(object, pa.Check(lambda s: s.is_unique), nullable=False),
})

@pytest.fixture
def clean_df():
    return pd.read_csv("data/processed/clean_dataset.csv")

def test_schema_valid(clean_df):
    schema.validate(clean_df)

def test_no_nulls_in_key_cols(clean_df):
    # Replace with actual key column names
    key_cols = [c for c in clean_df.columns if "id" in c.lower()]
    for col in key_cols:
        assert clean_df[col].isnull().sum() == 0, f"Nulls in key column: {col}"

def test_no_duplicates(clean_df):
    assert clean_df.duplicated().sum() == 0, "Duplicate rows found in clean dataset"

def test_row_count_reasonable(clean_df):
    assert len(clean_df) > 0, "Dataset is empty"
    assert len(clean_df) < 10_000_000, "Dataset suspiciously large"
```

**Schema generation rules:**
- Numeric columns (int/float): `pa.Column(float, [pa.Check.ge(min_val)], nullable=null_pct > 0)`
- String columns: `pa.Column(str, nullable=True)` — don't over-constrain
- Date-like columns (name contains date/time/created): add regex check
- ID-like columns (name ends with _id): add uniqueness check

## Step 2: Generate Streamlit AppTest

Write `tests/test-streamlit-app.py`:

```python
from streamlit.testing.v1 import AppTest
import pytest

@pytest.fixture(scope="module")
def app():
    at = AppTest.from_file("app.py")
    at.run(timeout=30)
    return at

def test_app_loads_without_error(app):
    assert not app.exception, f"App crashed on load: {app.exception}"

def test_app_has_title(app):
    assert len(app.title) >= 1 or len(app.header) >= 1, "No title or header found"

def test_app_renders_charts(app):
    assert len(app.plotly_chart) >= 1, "No Plotly charts rendered"

def test_app_has_metrics(app):
    assert len(app.metric) >= 1, "No KPI metrics displayed"

def test_app_has_sidebar(app):
    # Sidebar may be empty if no filters — just verify app doesn't crash with it
    assert not app.exception
```

## Step 3: Generate GitHub Actions CI

Write `.github/workflows/ci.yml` — see `templates/github-actions-ci.yml`.

Activate BigQuery/Kaggle secrets block if detected in `stack-decision.md`.

## Step 4: Run Tests Locally

```bash
# Install test deps
pip install pytest pandera

# Run all tests
pytest tests/ -v

# Data quality only
pytest tests/test-data-quality.py -v

# App tests only
pytest tests/test-streamlit-app.py -v
```

## Pass Criteria

All tests must pass before proceeding to deploy:
- `test_schema_valid` — Pandera schema validates without errors
- `test_no_duplicates` — zero duplicate rows
- `test_app_loads_without_error` — app starts cleanly
- `test_app_renders_charts` — at least 1 chart rendered
- `test_app_has_metrics` — at least 1 KPI metric shown

## Checklists

- Data quality: `checklists/data-quality-checklist.md`
- Streamlit deploy: `checklists/streamlit-checklist.md`

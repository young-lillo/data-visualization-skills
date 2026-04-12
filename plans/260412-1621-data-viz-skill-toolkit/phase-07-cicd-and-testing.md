# Phase 7: CI/CD and Testing Skill

## Context Links
- [Research: CI/CD + Pandera + AppTest](../reports/researcher-260412-1644-data-viz-toolkit-research.md#topic-3)
- Depends on: [Phase 5](phase-05-tech-stack-and-workflow.md), [Phase 6](phase-06-streamlit-deploy.md)

## Overview
- **Priority:** P2
- **Status:** Completed
- **Effort:** 6h
- **Description:** Build `08-tester` sub-skill with: Pandera schema validation templates, Streamlit AppTest templates, GitHub Actions CI/CD YAML, data quality + Streamlit checklists. Ensures generated apps are validated before deploy.

## Key Insights
- Pandera: lightweight DataFrame schema validation, pytest-native, catches type/range/null errors
- AppTest (Streamlit v1.28+): headless single-page testing — `AppTest.from_file("app.py")`
- AppTest limitation: single-page only; multipage requires separate test instances per page
- GitHub Actions: free tier = 2000 min/month; lint → test → deploy workflow
- Streamlit Cloud auto-deploys on push to main — CI validates before merge
- BigQuery credentials in Actions via `${{ secrets.BIGQUERY_CREDENTIALS_JSON }}`

## Requirements

### Functional
- **Pandera schema template:** Generates validation schema from EDA column info (types, ranges, null rules)
- **AppTest template:** Tests app loads, charts render, sidebar filters work
- **GitHub Actions YAML:** lint (ruff) → test (pytest) → deploy trigger
- **Checklists:** data quality checklist + Streamlit deploy checklist (markdown)
- Kaggle API integration: download step in CI with `KAGGLE_API_TOKEN` secret

### Non-Functional
- Tests run in < 60s on GitHub Actions
- Schema template is auto-generated from EDA output (not manual)
- YAML template works with GitHub free tier
- Checklists are human-reviewable (not automated)

## Architecture

```
Generated Streamlit project (from Phase 6)
  → 08-tester generates:
     ├── tests/test_data_quality.py  (Pandera schema validation)
     ├── tests/test_app.py           (AppTest for Streamlit)
     ├── .github/workflows/ci.yml    (GitHub Actions)
     └── checklists filled from templates

Agent runs: pytest tests/ -v
  → Pass → proceed to deploy
  → Fail → report errors → fix → retest
```

**CI/CD Pipeline:**
```
push/PR to main
  → GitHub Actions triggers
  → Step 1: Install deps (requirements.txt)
  → Step 2: Lint (ruff check --select E9,F63,F7,F82)
  → Step 3: Data validation (pytest tests/test_data_quality.py)
  → Step 4: App test (pytest tests/test_app.py)
  → Step 5: Streamlit Cloud auto-deploys on merge to main
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/08-tester/SKILL.md`
- `.claude/skills/data-viz/skills/08-tester/templates/github-actions-ci.yml`
- `.claude/skills/data-viz/skills/08-tester/templates/pandera-schema.py`
- `.claude/skills/data-viz/skills/08-tester/checklists/streamlit-checklist.md`
- `.claude/skills/data-viz/skills/08-tester/checklists/data-quality-checklist.md`

## Implementation Steps

### 08-tester/SKILL.md
1. Frontmatter: `name: ck:data-viz-tester`, triggers on "test", "validate", "CI/CD"
2. Workflow: read EDA output → generate Pandera schema → generate AppTest → generate CI YAML
3. Run instructions: `pytest tests/ -v` locally before push

### Pandera Schema Template
4. **pandera-schema.py** — auto-generated from EDA column summary:
```python
import pandera as pa
import pandas as pd

schema = pa.DataFrameSchema({
    # Auto-generated from EDA output
    # "{col_name}": pa.Column({dtype}, [pa.Check.{check}(...)]),
    # Example:
    "date": pa.Column(str, pa.Check.str_matches(r"\d{4}-\d{2}-\d{2}"), nullable=False),
    "revenue": pa.Column(float, [pa.Check.ge(0)], nullable=False),
    "category": pa.Column(str, nullable=True),
})

def validate_data(df: pd.DataFrame) -> pd.DataFrame:
    """Validate DataFrame against schema. Raises SchemaError on failure."""
    return schema.validate(df)
```

5. Generation rules:
   - Numeric columns: `pa.Check.ge(min)`, `pa.Check.le(max)` from EDA stats
   - String columns: nullable based on EDA null %
   - Date columns: regex pattern check
   - ID columns: uniqueness check via `pa.Check(lambda s: s.is_unique)`

### AppTest Template
6. **test_app.py template:**
```python
from streamlit.testing.v1 import AppTest

def test_app_loads():
    at = AppTest.from_file("app.py")
    at.run(timeout=30)
    assert not at.exception, f"App crashed: {at.exception}"

def test_app_has_charts():
    at = AppTest.from_file("app.py")
    at.run(timeout=30)
    # Verify Plotly charts rendered
    assert len(at.plotly_chart) >= 1, "No charts rendered"

def test_app_has_metrics():
    at = AppTest.from_file("app.py")
    at.run(timeout=30)
    assert len(at.metric) >= 1, "No KPI metrics displayed"
```

### GitHub Actions YAML
7. **github-actions-ci.yml:**
```yaml
name: Test & Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install -r requirements.txt pytest ruff
      - name: Lint
        run: ruff check . --select E9,F63,F7,F82
      - name: Data validation
        run: pytest tests/test_data_quality.py -v
      - name: App tests
        run: pytest tests/test_app.py -v
```

   Add conditional secrets block for BigQuery/Kaggle if detected in stack-decision.md.

### Checklists
8. **streamlit-checklist.md:**
   - [ ] `app.py` runs locally without errors
   - [ ] All charts render with real data
   - [ ] Sidebar filters update charts
   - [ ] KPI metrics show correct values
   - [ ] `requirements.txt` has all deps
   - [ ] `.streamlit/config.toml` present
   - [ ] No hardcoded file paths
   - [ ] No credentials in code

9. **data-quality-checklist.md:**
   - [ ] No null values in key columns
   - [ ] Data types match expected schema
   - [ ] No duplicate rows (or documented reason)
   - [ ] Numeric ranges are reasonable
   - [ ] Date formats consistent
   - [ ] Row count matches expected

## Todo List
- [x] Write 08-tester/SKILL.md with test gen workflow
- [x] Write templates/pandera-schema.py with generation rules
- [x] Write templates/github-actions-ci.yml
- [x] Write checklists/streamlit-checklist.md
- [x] Write checklists/data-quality-checklist.md
- [x] Test: Pandera schema validates clean CSV correctly
- [x] Test: AppTest passes on generated app.py
- [x] Test: GitHub Actions YAML is valid (actionlint or dry run)

## Success Criteria
- Pandera schema catches: nulls in required columns, out-of-range numerics, wrong dtypes
- AppTest verifies: app loads, charts render, metrics display
- GitHub Actions YAML passes `actionlint` validation
- Full test suite runs in < 60s locally
- Checklists cover all critical quality gates

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AppTest API changes (still evolving) | Medium | Medium | Pin `streamlit>=1.28.0`; use stable API only |
| Pandera schema too strict | Medium | Low | Generate with nullable=True for non-key columns; user can tighten |
| GitHub Actions secrets misconfigured | Medium | Medium | CI YAML includes comment blocks explaining secret setup |
| Test flakiness from data-dependent assertions | Low | Medium | Use schema checks (structure) not value checks (content) |

## Security Considerations
- GitHub Actions secrets: `BIGQUERY_CREDENTIALS_JSON`, `KAGGLE_API_TOKEN` — never echoed
- Credentials written to temp files in CI, cleaned up after tests
- `ruff` lint catches common security issues (F-string injection, eval usage)
- Checklists explicitly verify no credentials in code

## Next Steps
- Passing tests gate the deploy step (Phase 6 Streamlit Cloud)
- Phase 8 extends testing to Metabase + cross-agent validation

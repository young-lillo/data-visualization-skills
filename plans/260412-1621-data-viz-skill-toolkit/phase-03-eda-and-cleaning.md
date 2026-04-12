# Phase 3: EDA and Data Cleaning Skills

## Context Links
- [Research: BigQuery + pandas-gbq](../reports/researcher-260412-1644-data-viz-toolkit-research.md#topic-2)
- [Research: CRISP-DM Phases 2-3](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md#topic-3)
- Depends on: [Phase 1](phase-01-toolkit-foundation.md), [Phase 2](phase-02-intake-skill.md) (intake-summary.md)

## Overview
- **Priority:** P1
- **Status:** Completed
- **Effort:** 6h
- **Description:** Build `02-eda` (auto-profile with ydata-profiling) and `03-sql-cleaner` (SQL/Python cleaning templates + BigQuery connection). Maps to CRISP-DM Phases 2-3.

## Key Insights
- `ydata-profiling` generates HTML EDA reports from DataFrame — minimal code
- Pandera for schema validation (lightweight, pytest-native)
- `pandas-gbq` for BigQuery reads; `@st.cache_data` for caching
- BigQuery auth: service account JSON via env var or Streamlit secrets
- SQL cleaning templates (nulls, dedup) are industry-agnostic — reusable
- CSV loading via pandas; Kaggle download via `kaggle datasets download` CLI

## Requirements

### Functional
- **02-eda:** Load dataset (CSV/Kaggle/BQ), generate ydata-profiling HTML report, output column summary + data types + null counts
- **03-sql-cleaner:** Provide SQL templates for null handling, deduplication; Python script for BigQuery connection; generate `clean_dataset.csv`
- Auto-detect dataset format from intake-summary.md
- Handle Kaggle download (auth check, download, unzip)

### Non-Functional
- EDA report generation < 60s for datasets under 100k rows
- SQL templates work with SQLite, PostgreSQL, BigQuery
- No hardcoded credentials

## Architecture

```
intake-summary.md
  → 02-eda reads dataset source
  → Downloads if Kaggle/URL
  → Loads into DataFrame
  → ydata-profiling generates reports/eda_report.html
  → Outputs: column list, dtypes, null %, row count
  → 03-sql-cleaner reads EDA output
  → Selects cleaning templates based on detected issues
  → Applies cleaning (Python or SQL)
  → Outputs: data/processed/clean_dataset.csv
```

**Data Flow:**
```
[CSV/Kaggle/BQ] → pandas.DataFrame → ydata_profiling → eda_report.html
                                    → pandera.validate → cleaning_plan.md
                                    → sql_templates    → clean_dataset.csv
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/02-eda/SKILL.md`
- `.claude/skills/data-viz/skills/03-sql-cleaner/SKILL.md`
- `.claude/skills/data-viz/skills/03-sql-cleaner/templates/clean-nulls.sql`
- `.claude/skills/data-viz/skills/03-sql-cleaner/templates/dedup.sql`
- `.claude/skills/data-viz/skills/03-sql-cleaner/templates/bigquery-connect.py`

### Files to Modify
- `.claude/skills/data-viz/references/bigquery-patterns.md` — populate
- `.claude/skills/data-viz/references/kaggle-patterns.md` — populate

## Implementation Steps

### 02-eda/SKILL.md
1. Write frontmatter: `name: ck:data-viz-eda`, description triggers on "EDA", "profile", "explore data"
2. Instructions for dataset loading:
   - CSV: `pd.read_csv(path)` or `pd.read_csv(url)`
   - Kaggle: check auth → `kaggle datasets download -d {slug} -p ./data` → find CSV in extracted files
   - BigQuery: `pandas_gbq.read_gbq(query, project_id=..., credentials=...)`
3. EDA report generation:
   ```python
   from ydata_profiling import ProfileReport
   report = ProfileReport(df, minimal=True, title="EDA Report")
   report.to_file("reports/eda_report.html")
   ```
4. Output structured summary: column names, dtypes, null %, unique counts, row count
5. Identify cleaning needs: list columns with >5% nulls, duplicate rows, type mismatches

### 03-sql-cleaner/SKILL.md
1. Write frontmatter: `name: ck:data-viz-cleaner`, description triggers on "clean data", "handle nulls"
2. Template selection logic based on EDA findings:
   - Nulls > 5%: apply `clean-nulls.sql` pattern
   - Duplicate rows detected: apply `dedup.sql` pattern
   - BigQuery source: use `bigquery-connect.py` wrapper
3. Cleaning output: `data/processed/clean_dataset.csv`

### SQL Templates
4. `clean-nulls.sql`:
   ```sql
   -- Fill nulls for numeric columns with median/mean
   -- Drop rows where key columns are null
   -- Template variables: {table}, {numeric_cols}, {key_cols}
   ```
5. `dedup.sql`:
   ```sql
   -- Remove exact duplicates keeping first occurrence
   -- Template variables: {table}, {partition_cols}
   ```
6. `bigquery-connect.py`:
   ```python
   # Wrapper: load credentials, execute query, return DataFrame
   # Uses pandas_gbq.read_gbq with @st.cache_data
   ```

### Reference Docs
7. Populate `references/bigquery-patterns.md`: auth setup, query patterns, caching, cost tips
8. Populate `references/kaggle-patterns.md`: auth setup, download commands, format handling

## Todo List
- [x] Write 02-eda/SKILL.md with loading + profiling instructions
- [x] Write 03-sql-cleaner/SKILL.md with template selection logic
- [x] Write clean-nulls.sql template
- [x] Write dedup.sql template
- [x] Write bigquery-connect.py wrapper
- [x] Populate references/bigquery-patterns.md
- [x] Populate references/kaggle-patterns.md
- [x] Test: CSV load → EDA report generation
- [x] Test: Kaggle download flow (with valid slug)
- [x] Test: BigQuery connection (with service account)

## Success Criteria
- `02-eda/SKILL.md` produces HTML EDA report from CSV input
- `03-sql-cleaner/SKILL.md` outputs `clean_dataset.csv` with nulls/dupes handled
- SQL templates have clear variable placeholders (no hardcoded table names)
- BigQuery connect script uses env var auth (no embedded credentials)
- Both skills < 200 lines each

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ydata-profiling slow on large datasets | Medium | Medium | Use `minimal=True` flag; warn user if >500k rows |
| Kaggle auth not configured | High | Medium | Skill checks for token first, provides setup instructions if missing |
| BigQuery auth fails | Medium | Medium | Fallback to CSV export instructions; clear error message |
| CSV encoding issues (non-UTF8) | Medium | Low | Try `encoding='latin-1'` fallback; warn user |

## Security Considerations
- BigQuery credentials via env var `GOOGLE_APPLICATION_CREDENTIALS` only — never in code
- Kaggle token via `KAGGLE_API_TOKEN` env var or `~/.kaggle/access_token` — never in SKILL.md
- `bigquery-connect.py` template must not contain real project IDs
- SQL templates must use parameterized queries (no string interpolation for values)

## Next Steps
- EDA output feeds Phase 4 (analysis planner) for question generation
- Clean dataset feeds Phase 5 (workflow gen) + Phase 6 (Streamlit deploy)

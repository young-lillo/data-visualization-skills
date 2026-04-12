# CRISP-DM Framework (Simplified for Portfolio Projects)

> Content added in Phase 4 (analysis-planner).

## Overview

CRISP-DM (Cross-Industry Standard Process for Data Mining) adapted to 4 phases for solo portfolio analytics.

## 4-Phase Portfolio Model

### Phase 1: Business Understanding
- Define the business question (what decision does this data support?)
- Identify KPIs and success metrics
- Choose industry vertical → load template from `04-analysis-planner/templates/`
- Output: `analysis-plan.md` with 5-8 questions + chart assignments

### Phase 2: Data Understanding (EDA)
- Load dataset → profile with ydata-profiling
- Identify: null rates, duplicates, data types, distributions, outliers
- Cross-reference column names against industry template expectations
- Output: `reports/eda_report.html` + column summary

### Phase 3: Data Preparation
- Apply cleaning templates based on EDA findings:
  - Nulls > 5% in key columns → `clean-nulls.sql` pattern
  - Duplicate rows → `dedup.sql` pattern
  - Type mismatches → cast in pandas
- Output: `data/processed/clean_dataset.csv`

### Phase 4: Visualization & Deploy
- Map analysis questions → chart types
- Generate Streamlit app or Metabase dashboard
- Validate with Pandera + AppTest
- Deploy to Streamlit Cloud or localhost (Metabase)

## Question Type Patterns

| Pattern | Example | Typical Chart |
|---------|---------|---------------|
| Trend over time | Monthly revenue | Line chart |
| Ranking / comparison | Top 10 products | Bar chart (horizontal) |
| Distribution | Order value spread | Histogram |
| Correlation | Price vs quantity | Scatter plot |
| Composition | Sales by region % | Pie / donut |
| Part-to-whole | Category breakdown | Treemap / stacked bar |
| Relationship matrix | Feature correlation | Heatmap |

## Success Criteria per Phase

| Phase | Done When |
|-------|-----------|
| Business Understanding | `analysis-plan.md` has 5+ questions with chart assignments |
| EDA | `eda_report.html` generated, null/dupe counts documented |
| Data Prep | `clean_dataset.csv` passes Pandera schema |
| Deploy | App renders all charts, KPIs correct, no errors |

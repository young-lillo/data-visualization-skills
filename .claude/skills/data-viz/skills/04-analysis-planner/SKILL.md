---
name: ck:data-viz-planner
description: "Generate analysis questions and chart plan for data portfolio projects.
  Use when user needs business questions, KPIs, or chart recommendations for any
  industry. Triggers on: 'analysis plan', 'business questions', 'what to analyze',
  'chart recommendations', 'KPIs'."
argument-hint: "[industry] [dataset-columns]"
metadata:
  phase: cook
  version: "1.0.0"
---

# Data-Viz Analysis Planner Skill

Load industry template, cross-reference with actual dataset columns, enrich with
dataset-specific questions. Output `analysis-plan.md`.

## Inputs

- `intake-summary.md` — industry vertical + analysis goal
- EDA column summary — actual column names + dtypes from `02-eda`

## Template Loading

Load the matching template from `templates/{vertical}.md`:

```
ecommerce → templates/ecommerce.md
banking   → templates/banking.md
healthcare → templates/healthcare.md
education  → templates/education.md
credit     → templates/credit.md
logistics  → templates/logistics.md
hr         → templates/hr.md
marketing  → templates/marketing.md
real-estate → templates/real-estate.md
```

## Column Cross-Reference Algorithm

1. Load template's "Expected Columns" list
2. Compare against actual dataset columns (case-insensitive, strip underscores/spaces)
3. For each template question, check if required columns exist:
   - **Columns match:** keep question as-is
   - **Similar name found:** adapt question to actual column name (fuzzy match)
   - **Column missing:** mark question as "⚠ requires {column} — not found in dataset"
4. Add 2-3 dataset-specific questions based on columns that don't appear in template

## Fuzzy Column Matching

Use these equivalences (see `references/industry-questions.md` for full list):

| Template Expects | Accept As |
|-----------------|-----------|
| `date` | order_date, created_at, timestamp, purchase_date |
| `revenue` | sales, amount, total, price, gmv |
| `customer_id` | user_id, client_id, buyer_id, account_id |
| `category` | product_type, segment, class, group, dept |
| `region` | country, state, city, location, territory |

## Enrichment Rules

After loading template questions, add dataset-specific questions:
- If dataset has a numeric column not in template: "What is the distribution of {col}?"
- If dataset has a datetime column: "How does {primary_metric} trend over time?"
- If dataset has a high-cardinality string column (>20 unique): "What are the top {col} values by {metric}?"
- Cap total questions at **8** (template + enrichment combined)

## Output: analysis-plan.md

Write to working directory:

```markdown
# Analysis Plan: {project_name}
Industry: {vertical} | Dataset: {source}
Generated: {date}

## Questions
1. {question} → Chart: {chart_type} | Columns: {col1}, {col2}
2. {question} → Chart: {chart_type} | Columns: {col1}, {col2}
...

## KPIs
- {kpi_name}: {formula_or_description}
- ...

## Chart Summary
| # | Chart Type | X-Axis | Y-Axis | Color/Filter |
|---|-----------|--------|--------|--------------|
| 1 | bar | category | revenue | region |
| 2 | line | date | orders | — |
```

## Next Steps

Pass `analysis-plan.md` to:
- `05-tech-stack` — for library selection based on chart types needed
- `07-deploy-streamlit` — for chart code generation

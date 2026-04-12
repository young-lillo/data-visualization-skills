---
name: ck:data-viz-intake
description: "Collect project info for data analytics portfolio. Activates during
  intake phase: asks industry, dataset source, analysis goals, and deploy target.
  Triggers on: 'start data project', 'intake', 'new analytics project'."
argument-hint: "[industry] [dataset-path]"
metadata:
  phase: intake
  version: "1.0.0"
---

# Data-Viz Intake Skill

Collect project context from user in < 5 minutes. Outputs `intake-summary.md`.

## Question Flow

Ask these 5 questions **in order**. Validate each before proceeding.

```
Q1: What is your project name?
    Default: kebab-case version of the dataset filename (e.g., "olist-ecommerce")

Q2: Which industry vertical best describes your dataset?
    Options: ecommerce | banking | healthcare | education | credit |
             logistics | hr | marketing | real-estate
    Validation: must be one of the 9 options above (case-insensitive)

Q3: What is your dataset source?
    Format options:
      - Local CSV:   ./data/orders.csv   or   /absolute/path/file.csv
      - URL CSV:     https://example.com/data.csv
      - Kaggle:      kaggle:owner/dataset-name
      - BigQuery:    bigquery:project.dataset.table
    Validation: auto-detect format (see Source Detection below)

Q4: What is your analysis goal? (1-2 sentences)
    Example: "Identify top revenue-driving products and seasonal trends"
    Default: "Explore the dataset and identify key business insights"

Q5: What is your deploy target?
    Options: streamlit (default) | metabase
    Default: streamlit
```

## Source Detection Rules

| Input Pattern | Detected As |
|--------------|-------------|
| Starts with `./`, `/`, drive letter (`C:\`) | Local CSV |
| Starts with `http://` or `https://` | URL CSV |
| Starts with `kaggle:` OR matches `^[a-z0-9-]+/[a-z0-9-]+$` | Kaggle dataset |
| Starts with `bigquery:` OR matches `\w+\.\w+\.\w+` (two dots) | BigQuery table |

Strip `kaggle:` and `bigquery:` prefixes before storing in summary.

## Industry Enum Descriptions

| Vertical | Focus Area |
|----------|-----------|
| ecommerce | Orders, products, customers, revenue, cart behavior |
| banking | Accounts, transactions, loans, fraud detection |
| healthcare | Patients, diagnoses, treatments, costs, outcomes |
| education | Students, grades, enrollment, attendance, retention |
| credit | Credit scores, loan applications, defaults, risk |
| logistics | Shipments, delivery times, routes, costs, inventory |
| hr | Employees, attrition, salary, performance, hiring |
| marketing | Campaigns, channels, conversions, ad spend, CTR |
| real-estate | Properties, prices, locations, sales velocity |

## Output: intake-summary.md

Write this file to the current working directory:

```markdown
# Intake Summary
- **Project:** {name}
- **Industry:** {vertical}
- **Dataset:** {source_type}: {path_or_slug}
- **Goal:** {free_text}
- **Deploy:** {streamlit|metabase}
- **Date:** {YYYY-MM-DD}

## Dataset Preview
- Format: {csv|parquet|bigquery}
- Estimated rows: {count or "unknown — will determine during EDA"}
- Source validated: {yes|no — {reason}}

## Suggested Next Steps
1. Run EDA profiling (02-eda)
2. Clean data per industry template (03-sql-cleaner)
3. Generate analysis questions (04-analysis-planner)
```

## Validation Rules

- **Industry:** Reject non-enum values. Show list of valid options and re-ask.
- **Dataset source:** For local paths — check if file exists (`os.path.exists`). For URLs — check format only (not connection). For Kaggle — validate slug regex. For BigQuery — validate format only.
- **Project name:** Convert to kebab-case if user provides spaces. Strip special chars.

## After Writing intake-summary.md

1. Display the summary to the user
2. Ask: "Does this look correct? Shall I proceed with EDA?"
3. **Wait for explicit approval** before activating `02-eda`

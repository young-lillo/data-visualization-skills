---
name: ck:data-viz-stack
description: "Select the right tech stack for a data analytics project. Evaluates
  dataset size, source, and deploy target to recommend libraries. Triggers on:
  'tech stack', 'what libraries', 'which tools', 'stack decision'."
argument-hint: "[deploy-target] [data-source]"
metadata:
  phase: cook
  version: "1.0.0"
---

# Data-Viz Tech Stack Skill

Evaluate project parameters and output a `stack-decision.md` with library recommendations.

## Inputs

Read from prior phase outputs:
- `intake-summary.md` — deploy target, data source type
- EDA summary — row count estimate

## Decision Tree

Evaluate in order:

```
IF deploy_target == "metabase":
    stack = [metabase, docker, postgres, psycopg2]
    skip streamlit libraries

ELIF row_count > 1_000_000:
    stack = [streamlit, pandas-gbq, bigquery, plotly, pandera]
    note: "Large dataset — BigQuery recommended even if source is CSV"

ELIF data_source == "bigquery":
    stack = [streamlit, pandas-gbq, plotly, altair, pandera]

ELSE:  # CSV / URL / Kaggle (default)
    stack = [streamlit, pandas, plotly, altair, pandera, ydata-profiling]

# Always add conditionally:
IF data_source starts with "kaggle":  add kaggle
IF row_count > 100_000:              add ydata-profiling minimal=True note
IF chart_types includes "heatmap":   altair already included
```

## Output: stack-decision.md

Write to working directory:

```markdown
# Stack Decision

## Selected Libraries
| Library | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| streamlit | >=1.28.0 | Dashboard framework | Default deploy; one-click Cloud deploy |
| pandas | >=2.0.0 | Data manipulation | Standard DataFrame library |
| plotly | >=5.17.0 | Interactive charts | Hover/zoom; native st.plotly_chart |
| altair | >=5.0.0 | Statistical charts | Declarative; great for distributions |
| pandera | >=0.18.0 | Schema validation | Lightweight, pytest-native |
| ydata-profiling | >=4.0.0 | EDA reports | Minimal HTML reports from DataFrame |

## Conditional Libraries
| Library | Include If | Version |
|---------|-----------|---------|
| pandas-gbq | BigQuery source | >=0.23.0 |
| kaggle | Kaggle source | >=1.6.0 |

## Rejected Alternatives
| Library | Reason Not Selected |
|---------|-------------------|
| matplotlib | Non-interactive; Plotly preferred for portfolio |
| great-expectations | Too heavy; Pandera sufficient for portfolio |
| dash | More complex than Streamlit for solo projects |

## requirements.txt
\`\`\`
streamlit>=1.28.0
pandas>=2.0.0
plotly>=5.17.0
altair>=5.0.0
pandera>=0.18.0
ydata-profiling>=4.0.0
# pandas-gbq>=0.23.0  # Uncomment if BigQuery source
# kaggle>=1.6.0        # Uncomment if Kaggle source
\`\`\`
```

## Next Steps

Pass `stack-decision.md` to `06-workflow-gen` for project scaffolding.

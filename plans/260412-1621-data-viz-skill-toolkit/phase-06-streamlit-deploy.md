# Phase 6: Streamlit Deploy Skill

## Context Links
- [Research: Streamlit Charts + Deploy](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md#topic-2)
- [Research: Streamlit Cloud CI/CD](../reports/researcher-260412-1644-data-viz-toolkit-research.md#topic-3)
- Depends on: [Phase 5](phase-05-tech-stack-and-workflow.md)

## Overview
- **Priority:** P1
- **Status:** Completed
- **Effort:** 6h
- **Description:** Build `07-deploy-streamlit` sub-skill with chart templates (Plotly + Altair), app code generator, caching patterns, and Streamlit Cloud deploy instructions. This is the primary output — the working dashboard.

## Key Insights
- Plotly for interactive charts (hover, zoom); Altair for statistical compositions
- `st.plotly_chart()` and `st.altair_chart()` are native Streamlit integrations
- `@st.cache_data` for data loading; keep chart rendering outside cache
- Streamlit Cloud auto-deploys on push to main — no manual deploy step
- AppTest (v1.28+) for single-page testing — design for single-page first
- Multi-column layout: `st.columns(2)` for side-by-side charts
- Metric cards: `st.metric(label, value, delta)` for KPIs

## Requirements

### Functional
- Chart template files for: bar, line, scatter, heatmap (Plotly-based)
- App base template with: config, data loading, sidebar filters, chart sections
- Code generator reads `analysis-plan.md` and fills `app.py` with chart code
- Deploy instructions for Streamlit Cloud (push to GitHub → link repo)
- Local fallback: `streamlit run app.py`

### Non-Functional
- Generated app renders without errors on first run
- Charts are interactive (hover tooltips, zoom)
- App loads in < 5s for datasets under 100k rows
- Templates are composable (mix chart types per app)

## Architecture

```
analysis-plan.md (questions + chart assignments)
  + clean_dataset.csv
  + stack-decision.md
  → 07-deploy-streamlit reads chart assignments
  → For each question: select chart template → inject column names
  → Assembles full app.py with: imports, config, loader, sidebar, charts
  → Generates modules/data_loader.py and modules/chart_factory.py
  → User runs locally → reviews → pushes to GitHub → Streamlit Cloud deploys
```

**Generated App Architecture:**
```
app.py
  ├── st.set_page_config()
  ├── load_data() via @st.cache_data
  ├── Sidebar: filters (date range, category, region)
  ├── Row 1: KPI metric cards (st.columns + st.metric)
  ├── Row 2-N: Chart sections (2 charts per row via st.columns)
  └── Footer: data source attribution
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/07-deploy-streamlit/SKILL.md`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/app-base.py`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/streamlit-config.toml`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/charts/bar-chart.py`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/charts/line-chart.py`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/charts/scatter-chart.py`
- `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/charts/heatmap.py`

## Implementation Steps

### 07-deploy-streamlit/SKILL.md
1. Frontmatter: `name: ck:data-viz-deploy-streamlit`, triggers on "deploy", "streamlit", "dashboard"
2. Code generation workflow:
   - Read `analysis-plan.md` for question-to-chart mapping
   - For each chart assignment: load matching template from `templates/charts/`
   - Replace placeholders: `{x_col}`, `{y_col}`, `{color_col}`, `{title}`
   - Assemble into `app.py` using `app-base.py` as skeleton
3. Module generation:
   - `data_loader.py`: `@st.cache_data` wrapped CSV/BQ loader
   - `chart_factory.py`: functions returning Plotly/Altair figure objects
4. Deploy instructions: local run → GitHub push → Streamlit Cloud link

### Chart Templates

5. **bar-chart.py:**
```python
import plotly.express as px

def create_bar_chart(df, x="{x_col}", y="{y_col}", title="{title}"):
    fig = px.bar(df, x=x, y=y, title=title, color="{color_col}")
    fig.update_layout(xaxis_title=x, yaxis_title=y)
    return fig
```

6. **line-chart.py:**
```python
import plotly.express as px

def create_line_chart(df, x="{x_col}", y="{y_col}", title="{title}"):
    fig = px.line(df, x=x, y=y, title=title, markers=True)
    fig.update_layout(xaxis_title=x, yaxis_title=y)
    return fig
```

7. **scatter-chart.py:**
```python
import plotly.express as px

def create_scatter_chart(df, x="{x_col}", y="{y_col}", color="{color_col}", title="{title}"):
    fig = px.scatter(df, x=x, y=y, color=color, title=title, hover_data=df.columns[:5])
    return fig
```

8. **heatmap.py:**
```python
import plotly.express as px

def create_heatmap(df, x="{x_col}", y="{y_col}", z="{z_col}", title="{title}"):
    pivot = df.pivot_table(values=z, index=y, columns=x, aggfunc="mean")
    fig = px.imshow(pivot, title=title, aspect="auto", color_continuous_scale="Viridis")
    return fig
```

### App Base Template
9. **app-base.py** — skeleton with placeholder sections:
```python
import streamlit as st
import pandas as pd
from modules.data_loader import load_data
from modules.chart_factory import *

st.set_page_config(page_title="{project_name}", layout="wide")
st.title("{project_name}")
st.markdown("**Industry:** {industry} | **Dataset:** {dataset_source}")

# Data
df = load_data("{data_path}")

# Sidebar Filters
st.sidebar.header("Filters")
# {FILTER_PLACEHOLDERS}

# KPIs
col1, col2, col3 = st.columns(3)
# {KPI_PLACEHOLDERS}

# Charts
# {CHART_SECTIONS}
```

### Deploy Config
10. **streamlit-config.toml** — copy of config.toml from Phase 5 template

## Todo List
- [x] Write 07-deploy-streamlit/SKILL.md with code gen workflow
- [x] Write templates/app-base.py skeleton
- [x] Write templates/streamlit-config.toml
- [x] Write templates/charts/bar-chart.py
- [x] Write templates/charts/line-chart.py
- [x] Write templates/charts/scatter-chart.py
- [x] Write templates/charts/heatmap.py
- [x] Test: generated app.py runs with sample CSV
- [x] Test: all 4 chart types render correctly
- [x] Test: Streamlit Cloud deploy succeeds from generated project

## Success Criteria
- Generated `app.py` runs without errors: `streamlit run app.py`
- All 4 chart types render with real data
- KPI metric cards display correct values
- Sidebar filters update charts reactively
- App loads in < 5s for 50k-row dataset
- Streamlit Cloud deploy works (push → auto-deploy)

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Chart template placeholders not replaced | Medium | High | Validate no `{placeholder}` strings remain in output |
| Plotly version incompatibility | Low | Medium | Pin `plotly>=5.17.0`; use stable API only |
| Large dataset freezes app | Medium | Medium | `@st.cache_data` + `nrows` parameter for preview |
| Streamlit Cloud deploy quota | Low | Low | Local `streamlit run` always works as fallback |

## Security Considerations
- Generated app must not expose file system paths in UI
- Data loading uses `@st.cache_data` — cached data stays in memory only
- No credentials in generated Python files — use `.streamlit/secrets.toml` (gitignored)
- `enableXsrfProtection = true` in config.toml

## Next Steps
- Generated app validated by Phase 7 (CI/CD + tester)
- Working app is final deliverable (live URL or localhost)

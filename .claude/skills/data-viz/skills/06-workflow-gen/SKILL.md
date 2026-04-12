---
name: ck:data-viz-workflow
description: "Generate project scaffold for data analytics Streamlit app. Creates
  app.py, requirements.txt, config.toml, and directory structure. Triggers on:
  'generate project', 'scaffold', 'boilerplate', 'create project structure'."
argument-hint: "[project-name]"
metadata:
  phase: cook
  version: "1.0.0"
---

# Data-Viz Workflow Generator Skill

Assemble all upstream outputs into a deployable project scaffold.

## Inputs

Read all prior outputs:
- `intake-summary.md` — project name, industry, dataset, deploy target
- `stack-decision.md` — libraries and requirements.txt content
- `analysis-plan.md` — chart assignments (question → chart type → columns)

## Generated Project Structure

```
{project-name}/
├── app.py                      # Streamlit entry point (generated)
├── requirements.txt            # From stack-decision.md
├── .streamlit/
│   └── config.toml             # Theme + server config
├── data/
│   ├── raw/                    # Original dataset goes here
│   └── processed/              # clean_dataset.csv goes here
├── reports/
│   └── eda_report.html         # From 02-eda
├── modules/
│   ├── data-loader.py          # @st.cache_data CSV/BQ loader
│   └── chart-factory.py        # Chart generation functions
└── plan.md                     # Pipeline summary with status checkboxes
```

## File Generation Instructions

### 1. requirements.txt
Copy content from `stack-decision.md` requirements block.
Uncomment conditional lines based on intake data source.

### 2. .streamlit/config.toml
```toml
[theme]
primaryColor = "#FF6B35"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
font = "sans serif"

[server]
maxUploadSize = 200
enableXsrfProtection = true

[client]
toolbarMode = "minimal"
```

### 3. modules/data-loader.py
```python
"""Data loading module with Streamlit caching."""
import streamlit as st
import pandas as pd


@st.cache_data
def load_data(path: str) -> pd.DataFrame:
    """Load CSV dataset with encoding fallback."""
    try:
        return pd.read_csv(path)
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding="latin-1")


@st.cache_data
def load_url_data(url: str) -> pd.DataFrame:
    """Load CSV from URL."""
    return pd.read_csv(url)
```

### 4. modules/chart-factory.py
```python
"""Chart generation functions using Plotly Express."""
import plotly.express as px
import pandas as pd


def bar_chart(df: pd.DataFrame, x: str, y: str, title: str, color: str = None):
    fig = px.bar(df, x=x, y=y, title=title, color=color)
    fig.update_layout(xaxis_title=x, yaxis_title=y)
    return fig


def line_chart(df: pd.DataFrame, x: str, y: str, title: str, color: str = None):
    fig = px.line(df, x=x, y=y, title=title, color=color, markers=True)
    return fig


def scatter_chart(df: pd.DataFrame, x: str, y: str, title: str, color: str = None):
    fig = px.scatter(df, x=x, y=y, color=color, title=title,
                     hover_data=df.columns[:5].tolist())
    return fig


def heatmap(df: pd.DataFrame, x: str, y: str, z: str, title: str):
    pivot = df.pivot_table(values=z, index=y, columns=x, aggfunc="mean")
    fig = px.imshow(pivot, title=title, aspect="auto", color_continuous_scale="Viridis")
    return fig
```

### 5. app.py
Generate from `analysis-plan.md` chart summary:

```python
import streamlit as st
from modules.data_loader import load_data
from modules.chart_factory import bar_chart, line_chart, scatter_chart, heatmap

st.set_page_config(page_title="{project_name}", layout="wide")
st.title("{project_name}")
st.markdown("**Industry:** {industry} | **Dataset:** {dataset_source}")

# Load data
df = load_data("data/processed/clean_dataset.csv")

# Sidebar filters
with st.sidebar:
    st.header("Filters")
    # {FILTER_PLACEHOLDERS — generate from high-cardinality categorical cols}

# KPI Metrics
st.subheader("Key Metrics")
col1, col2, col3 = st.columns(3)
# {KPI_PLACEHOLDERS — generate from analysis-plan.md KPIs}

# Charts — one section per question in analysis-plan.md
# {CHART_SECTIONS — pair charts 2-per-row using st.columns(2)}
```

For each chart in `analysis-plan.md`, generate a section:
```python
st.subheader("{question}")
col_a, col_b = st.columns(2)
with col_a:
    fig = {chart_function}(df, x="{x_col}", y="{y_col}", title="{question}")
    st.plotly_chart(fig, use_container_width=True)
```

### 6. plan.md
```markdown
# {project_name} — Pipeline Status

- [ ] Phase 1: Intake ✓ (intake-summary.md)
- [ ] Phase 2: EDA ✓ (reports/eda_report.html)
- [ ] Phase 3: Cleaning ✓ (data/processed/clean_dataset.csv)
- [ ] Phase 4: Analysis Plan ✓ (analysis-plan.md)
- [ ] Phase 5: Tech Stack ✓ (stack-decision.md)
- [ ] Phase 6: Scaffold ✓ (app.py, requirements.txt)
- [ ] Phase 7: Tests (run: pytest tests/)
- [ ] Phase 8: Deploy (push to GitHub → Streamlit Cloud)
```

## After Generating Scaffold

1. Show user the generated file tree
2. Ask: "Project scaffold ready. Run `streamlit run app.py` to preview locally. Proceed to testing?"
3. **Wait for approval** before activating `08-tester`

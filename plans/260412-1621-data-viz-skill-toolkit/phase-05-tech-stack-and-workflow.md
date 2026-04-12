# Phase 5: Tech Stack + Workflow Generation Skills

## Context Links
- [Research: Streamlit Best Practices](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md#topic-2)
- [Brainstorm — Tech Stack Decision Tree](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- Depends on: [Phase 2](phase-02-intake-skill.md), [Phase 3](phase-03-eda-and-cleaning.md), [Phase 4](phase-04-analysis-planner.md)

## Overview
- **Priority:** P1
- **Status:** Completed
- **Effort:** 5h
- **Description:** Build `05-tech-stack` (decision tree for stack selection) and `06-workflow-gen` (generate project boilerplate: plan.md, app.py, requirements.txt, .streamlit/config.toml). Bridge between analysis planning and code generation.

## Key Insights
- Decision tree: data size + use case + deploy target → stack recommendation
- Streamlit Cloud requires: `requirements.txt` + `app.py` at repo root + GitHub
- `config.toml` controls theme, upload limits, toolbar visibility
- Project boilerplate is deterministic — same inputs produce same structure
- `06-workflow-gen` is the "glue" skill that assembles all upstream outputs into a project scaffold

## Requirements

### Functional
- **05-tech-stack:** Decision tree evaluating: row count, deploy target, data source, real-time needs → outputs stack recommendation
- **06-workflow-gen:** Generate project directory with: `app.py` (shell), `requirements.txt`, `.streamlit/config.toml`, `data/`, `reports/`, `plan.md`
- `requirements.txt` must include only needed deps (conditional on stack decision)
- Generated `plan.md` summarizes full pipeline: intake → EDA → clean → analysis → deploy

### Non-Functional
- Boilerplate generation < 10s
- Generated files follow Streamlit Cloud conventions exactly
- `requirements.txt` pins minimum versions (not exact, for compatibility)

## Architecture

```
intake-summary.md + analysis-plan.md + EDA output
  → 05-tech-stack evaluates decision tree
  → Outputs: stack-decision.md (library list + justification)
  → 06-workflow-gen reads all upstream outputs
  → Generates project scaffold in CWD
  → User reviews scaffold → approves → deploy phase begins
```

**Decision Tree Logic:**
```
IF deploy_target == "metabase":
  stack = {metabase, docker, postgres}
ELIF row_count > 1_000_000:
  stack = {streamlit, pandas-gbq, bigquery, plotly}
ELIF data_source == "bigquery":
  stack = {streamlit, pandas-gbq, plotly, altair}
ELSE:
  stack = {streamlit, pandas, plotly, altair}

ALWAYS include: pandera (validation)
IF kaggle_source: include kaggle
```

**Generated Project Structure:**
```
{project-name}/
├── app.py                    # Streamlit entry (shell with imports + layout)
├── requirements.txt          # Pinned deps from stack decision
├── .streamlit/
│   └── config.toml           # Theme + server config
├── data/
│   ├── raw/                  # Original dataset
│   └── processed/            # Cleaned dataset
├── reports/
│   └── eda_report.html       # From Phase 3
├── modules/
│   ├── data_loader.py        # CSV/BQ loading with @st.cache_data
│   └── chart_factory.py      # Chart generation functions
└── plan.md                   # Generated pipeline summary
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/05-tech-stack/SKILL.md`
- `.claude/skills/data-viz/skills/06-workflow-gen/SKILL.md`

### Files to Modify
- `.claude/skills/data-viz/references/streamlit-patterns.md` — populate with config.toml template + caching patterns

## Implementation Steps

### 05-tech-stack/SKILL.md
1. Frontmatter: `name: ck:data-viz-stack`, triggers on "tech stack", "what libraries"
2. Decision tree as numbered rules (not code — agent interprets)
3. Output format: `stack-decision.md` with:
   - Selected libraries + versions
   - Justification per library (1 line each)
   - Rejected alternatives + why

### 06-workflow-gen/SKILL.md
1. Frontmatter: `name: ck:data-viz-workflow`, triggers on "generate project", "scaffold", "boilerplate"
2. Instructions to assemble project:
   - Read `intake-summary.md` for project name + industry
   - Read `stack-decision.md` for dependencies
   - Read `analysis-plan.md` for chart assignments
3. File generation templates:

   **requirements.txt template:**
   ```
   streamlit>=1.28.0
   pandas>=2.0.0
   plotly>=5.17.0
   altair>=5.0.0
   pandera>=0.18.0
   ydata-profiling>=4.0.0
   # Conditional:
   # pandas-gbq>=0.23.0  (if BigQuery)
   # kaggle>=1.6.0        (if Kaggle source)
   ```

   **config.toml template:**
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

   **app.py shell template:**
   ```python
   import streamlit as st
   st.set_page_config(page_title="{project_name}", layout="wide")
   st.title("{project_name}")
   # TODO: Generated chart sections from analysis-plan.md
   ```

4. Generate `plan.md` summarizing pipeline stages with status checkboxes

### Reference Doc
5. Populate `references/streamlit-patterns.md`:
   - `@st.cache_data` usage for CSV + BQ
   - `@st.cache_resource` for DB connections
   - Multi-column layout patterns
   - File uploader patterns
   - Metric cards + KPI display

## Todo List
- [x] Write 05-tech-stack/SKILL.md with decision tree
- [x] Write 06-workflow-gen/SKILL.md with scaffolding instructions
- [x] Define requirements.txt template (conditional deps)
- [x] Define config.toml template
- [x] Define app.py shell template
- [x] Populate references/streamlit-patterns.md
- [x] Test: decision tree produces correct stack for each scenario
- [x] Test: scaffold generates valid Streamlit project

## Success Criteria
- Decision tree handles all 4 scenarios (small CSV, large CSV, BigQuery, Metabase)
- Generated `requirements.txt` includes only needed deps
- Generated `app.py` runs without import errors (`streamlit run app.py`)
- Generated `config.toml` is valid TOML
- `references/streamlit-patterns.md` has actionable code snippets

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| requirements.txt version conflicts | Medium | Medium | Pin minimum versions only (>=), not exact |
| Generated app.py has import errors | Low | High | Template uses only standard imports; validate with `python -c "import ..."` |
| Config.toml theme looks bad | Low | Low | Use Streamlit default theme as base; user can customize |

## Security Considerations
- Generated `config.toml` enables XSRF protection by default
- No secrets in generated files — `.streamlit/secrets.toml` is gitignored and created separately
- `requirements.txt` must not pin vulnerable versions

## Next Steps
- Generated scaffold is input for Phase 6 (Streamlit deploy — fills in chart code)
- `stack-decision.md` determines which deploy skill to activate (streamlit vs metabase)

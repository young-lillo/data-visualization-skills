# Codebase Summary

## Project Structure

```
D:\VScode\claudekit\Data-Visualization/
├── .claude/                          # Agent orchestration & skills
│   ├── rules/                        # Workflow & governance rules
│   │   ├── primary-workflow.md       # Code → Test → Review → Docs
│   │   ├── development-rules.md      # Code quality, testing, security
│   │   ├── orchestration-protocol.md # Subagent delegation, context isolation
│   │   ├── documentation-management.md # Docs sync, roadmap maintenance
│   │   └── team-coordination-rules.md # Multi-agent team protocols
│   │
│   └── skills/                       # 70+ reusable skill modules
│       ├── data-viz/                 # [NEW] Data analytics portfolio toolkit
│       │   ├── SKILL.md              # Main skill metadata & workflow
│       │   ├── agents/               # Agent configs
│       │   │   └── openai.yaml       # OpenAI model specs
│       │   │
│       │   ├── references/           # Technical reference docs
│       │   │   ├── crisp-dm-framework.md
│       │   │   ├── industry-questions.md
│       │   │   ├── streamlit-patterns.md
│       │   │   ├── bigquery-patterns.md
│       │   │   ├── kaggle-patterns.md
│       │   │   └── dataset-sources.md
│       │   │
│       │   └── skills/               # 9 sub-skills (sequential workflow)
│       │       ├── 01-intake/
│       │       │   └── SKILL.md      # Collect metadata, validate inputs
│       │       │
│       │       ├── 02-eda/
│       │       │   └── SKILL.md      # Exploratory data analysis
│       │       │
│       │       ├── 03-sql-cleaner/
│       │       │   ├── SKILL.md      # Data cleaning automation
│       │       │   └── templates/    # SQL templates, connection configs
│       │       │
│       │       ├── 04-analysis-planner/
│       │       │   ├── SKILL.md      # Generate analysis questions
│       │       │   └── templates/    # 9 industry-specific templates
│       │       │       ├── ecommerce.md
│       │       │       ├── banking.md
│       │       │       ├── healthcare.md
│       │       │       ├── education.md
│       │       │       ├── credit.md
│       │       │       ├── logistics.md
│       │       │       ├── hr.md
│       │       │       ├── marketing.md
│       │       │       └── real-estate.md
│       │       │
│       │       ├── 05-tech-stack/
│       │       │   └── SKILL.md      # Select Streamlit vs Metabase
│       │       │
│       │       ├── 06-workflow-gen/
│       │       │   └── SKILL.md      # Scaffold project structure
│       │       │
│       │       ├── 07-deploy-streamlit/
│       │       │   ├── SKILL.md      # Deploy Streamlit apps
│       │       │   └── templates/    # App boilerplate, chart templates
│       │       │       ├── app-base.py
│       │       │       ├── streamlit-config.toml
│       │       │       └── charts/   # Reusable chart components
│       │       │
│       │       ├── 07-deploy-metabase/
│       │       │   ├── SKILL.md      # Deploy Metabase dashboards
│       │       │   └── templates/
│       │       │       └── docker-compose.yml
│       │       │
│       │       └── 08-tester/
│       │           ├── SKILL.md      # Generate & run tests
│       │           ├── templates/    # Test templates, CI/CD config
│       │           ├── checklists/   # Testing checklists
│       │           └── github-actions-ci.yml
│       │
│       ├── docs/                     # Documentation skill
│       ├── code-review/              # Code review automation
│       ├── test/                     # Testing framework
│       ├── deploy/                   # Deployment tooling
│       ├── git/                      # Git workflow helpers
│       ├── sequential-thinking/      # Debug & analysis
│       ├── ai-multimodal/            # Image/video/PDF processing
│       ├── preview/                  # Visual explanations (/ck:preview)
│       ├── repomix/                  # Code compaction tool
│       └── [65+ other skills]        # Various utilities & frameworks
│
├── docs/                             # [NEW] Project documentation
│   ├── project-overview-pdr.md       # Project overview & PDRs
│   ├── system-architecture.md        # Architecture diagrams & components
│   ├── codebase-summary.md           # This file
│   ├── code-standards.md             # Code style & conventions
│   └── [project-roadmap.md]          # Roadmap (if needed)
│
├── plans/                            # Project planning & tracking
│   └── reports/                      # Subagent reports
│
├── CLAUDE.md                         # Claude Code guidance & workflows
├── AGENTS.md                         # Open Code agent configuration
├── README.md                         # Project readme (if exists)
├── release-manifest.json             # Release metadata
└── .gitignore, .repomixignore       # Git & repomix config
```

## Core Components

### 1. Agent Orchestration Framework
**Location:** `.claude/rules/`

| File | Purpose | Key Concepts |
|------|---------|--------------|
| `primary-workflow.md` | Main development pipeline | Code → Test → Review → Docs |
| `development-rules.md` | Code quality standards | YAGNI, KISS, DRY, linting, testing |
| `orchestration-protocol.md` | Subagent delegation | Context isolation, sequential chaining, parallel execution |
| `documentation-management.md` | Docs synchronization | Auto-update roadmap & changelog |
| `team-coordination-rules.md` | Multi-agent teams | File ownership, git safety, communication |

**Key flows:**
- Agents spawn subagents with isolated context
- Tasks tracked via TaskList → TaskGet → TaskUpdate → TaskComplete
- Status reporting: DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT
- Context isolation prevents session history dump (explicit prompt crafting)

### 2. Data-Viz Skill Toolkit
**Location:** `.claude/skills/data-viz/`

**Master workflow:** 3 phases, 9 sub-skills, 40+ templates & references

#### Phase 1: Intake (01-intake)
- **Input:** User interaction
- **Processing:** Collect metadata (project name, industry, dataset, goal, deploy target)
- **Output:** `intake-summary.md` (YAML/Markdown)
- **Validation:** Dataset accessibility, industry enum (9 options), deploy target (streamlit|metabase)
- **User gate:** Approval required before Phase 2

#### Phase 2: Cook (auto-sequential)
1. **02-eda** → Profile dataset, generate `eda_report.html` + `column_summary.json`
2. **03-sql-cleaner** → Generate SQL transforms, output `clean_dataset.csv`
3. **04-analysis-planner** → Generate 10-20 industry-specific questions, output `analysis-plan.md`
4. **05-tech-stack** → Select Streamlit vs Metabase, output `stack-decision.md`
5. **06-workflow-gen** → Scaffold project structure + boilerplate code + plan.md

- **User gate:** Approval required before Phase 3

#### Phase 3: Test & Deploy
1. **08-tester** → Generate unit tests, data quality checks (Pandera), GitHub Actions CI/CD
2. **07-deploy-streamlit** OR **07-deploy-metabase** → Deploy and return live URL

#### Supporting References
- `crisp-dm-framework.md` — 4-phase analytics methodology
- `industry-questions.md` — Cross-industry analysis patterns
- `streamlit-patterns.md` — Caching, layout, state management
- `bigquery-patterns.md` — Auth, query optimization, cost control
- `kaggle-patterns.md` — API auth, dataset download, format handling
- `dataset-sources.md` — CSV, Kaggle, BigQuery, public dataset registry

### 3. Industry Templates
**Location:** `.claude/skills/data-viz/skills/04-analysis-planner/templates/`

9 templates covering major verticals:
- `ecommerce.md` — RFM, product affinity, churn prediction
- `banking.md` — Customer segmentation, risk assessment, loan defaults
- `healthcare.md` — Patient outcomes, treatment effectiveness, resource utilization
- `education.md` — Student performance, retention, learning patterns
- `credit.md` — Default prediction, risk scoring, collection strategies
- `logistics.md` — Route optimization, delivery performance, demand forecasting
- `hr.md` — Employee retention, performance, compensation analysis
- `marketing.md` — Campaign effectiveness, attribution, customer lifetime value
- `real-estate.md` — Price prediction, market trends, investment analysis

Each template defines:
- Dataset assumptions (row counts, column types)
- 10-15 prioritized analysis questions
- Key metrics and KPIs
- Visualization recommendations

### 4. Deployment Templates

#### Streamlit Deployment
**Location:** `.claude/skills/data-viz/skills/07-deploy-streamlit/templates/`

- `app-base.py` — Streamlit app boilerplate (data loading, caching, layout)
- `streamlit-config.toml` — Configuration (theme, layout, server settings)
- `charts/` — Reusable chart components
  - `bar-chart.py`
  - `line-chart.py`
  - `scatter-chart.py`
  - `heatmap.py`

#### Metabase Deployment
**Location:** `.claude/skills/data-viz/skills/07-deploy-metabase/templates/`

- `docker-compose.yml` — Full Metabase stack with PostgreSQL

### 5. Testing Framework
**Location:** `.claude/skills/data-viz/skills/08-tester/`

- `SKILL.md` — Test generation and execution strategy
- `templates/`
  - `pandera-schema.py` — Data quality validation schema
  - `github-actions-ci.yml` — Automated CI/CD workflow
- `checklists/`
  - `streamlit-checklist.md` — Pre-deployment validation
  - `data-quality-checklist.md` — Data integrity verification

## Key Technologies

### Data Processing & Analysis
- **Pandas** — Data manipulation and cleaning
- **NumPy** — Numerical computing
- **SQLAlchemy** — SQL abstraction and ORM
- **Pandera** — Data validation schemas

### Visualization & Apps
- **Streamlit** — Interactive Python web apps
- **Plotly** — Interactive charts
- **Metabase** — Business intelligence dashboards

### Data Sources
- **BigQuery** (google-cloud-bigquery) — Cloud data warehouse
- **Kaggle** (kaggle API) — Dataset marketplace
- **CSV/Pandas** — Local and remote files

### Infrastructure & Deployment
- **Docker/Docker Compose** — Containerization (Metabase)
- **Streamlit Cloud** — App hosting
- **GitHub Actions** — CI/CD automation
- **Git** — Version control

### Development & Testing
- **pytest** — Unit testing
- **Python** — Primary language
- **YAML** — Configuration files
- **Markdown** — Documentation

## Data Flow Architecture

```
User Input (intake-summary.md)
    ↓
EDA Analysis (eda_report.html)
    ↓
Data Cleaning (clean_dataset.csv)
    ↓
Analysis Planning (analysis-plan.md + questions)
    ↓
Tech Stack Selection (stack-decision.md)
    ↓
Project Scaffolding (boilerplate code)
    ├─→ Code generation (app.py, requirements.txt)
    ├─→ CI/CD generation (github-actions.yml)
    └─→ Test generation (test_*.py)
    ↓
Testing & Validation (Pandera, pytest)
    ↓
Deployment (Streamlit Cloud or Metabase Docker)
    ↓
Live URL (streamlit.app or localhost:3000)
```

## Skill Activation Patterns

### Main Skill Entry Point
```bash
/ck:data-viz ecommerce /path/to/dataset.csv
```

### Sub-Skill Activation (Sequential)
Within Phase 2 cook, sub-skills activate automatically:
1. `/ck:data-viz-eda`
2. `/ck:data-viz-cleaner`
3. `/ck:data-viz-planner`
4. `/ck:data-viz-stack`
5. `/ck:data-viz-workflow`

### Deploy Sub-Skills (Conditional)
- If streamlit: `/ck:data-viz-deploy-streamlit`
- If metabase: `/ck:data-viz-deploy-metabase`

### Test Sub-Skill
- `/ck:data-viz-tester` (before deploy)

## Configuration Files

### `.claude/skills/data-viz/agents/openai.yaml`
Defines OpenAI model specs for sub-skills (temperature, max_tokens, etc.)

### `.repomixignore`
Excludes certain files from codebase compaction (e.g., large binaries, node_modules)

### Release Manifest
`release-manifest.json` — Lists all available skills with metadata (author, version, description)

## Extension Points

### 1. Add New Industry Template
1. Create `.claude/skills/data-viz/skills/04-analysis-planner/templates/{industry}.md`
2. Define dataset assumptions and 10-15 questions
3. Skill auto-discovers via file scanning

### 2. Add New Deployment Target
1. Create `.claude/skills/data-viz/skills/07-deploy-{target}/SKILL.md`
2. Implement Phase 3 interface (input → output → live URL)
3. Register in main skill's Phase 3 routing

### 3. Add New Data Source
1. Extend `01-intake/SKILL.md` validation for new source pattern
2. Add data loading code to `02-eda/SKILL.md`
3. Update `references/dataset-sources.md` documentation

### 4. Add New Analysis Pattern
1. Add reference doc to `references/`
2. Include pattern in relevant industry templates
3. Update CRISP-DM documentation if needed

## Documentation Structure

**New docs directory (`./docs/`)** established with:
- `project-overview-pdr.md` — Project vision, requirements, acceptance criteria, success metrics
- `system-architecture.md` — Component architecture, data flow, integration points
- `codebase-summary.md` — This file: structure, components, technologies
- `code-standards.md` — Code style, naming, testing, security conventions (to be created)

**Existing docs preserved:**
- `.claude/rules/*.md` — Governance and workflow rules
- `.claude/skills/{skill}/SKILL.md` — Individual skill documentation
- `.claude/skills/data-viz/references/*.md` — Technical reference guides
- `.claude/skills/data-viz/skills/*/templates/*.md` — Industry & deployment templates

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total skills available | 70+ |
| Data-Viz sub-skills | 9 |
| Industry templates | 9 |
| Technical references | 6 |
| Deployment targets | 2 (Streamlit, Metabase) |
| Data source types | 4 (CSV, URL, Kaggle, BigQuery) |
| Workflow phases | 3 (Intake, Cook, Test/Deploy) |
| Orchestration rules | 5 files |

---

**Last updated:** 2026-04-12
**Maintained by:** docs-manager subagent

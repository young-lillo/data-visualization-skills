# System Architecture

## Overview

The Data-Visualization project is built on two layers:

1. **Agent Orchestration Framework** — Multi-agent delegation, task management, context isolation
2. **Data-Viz Skill Toolkit** — Specialized analytics workflow automation (intake → analysis → deployment)

## Layer 1: Agent Orchestration Framework

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRIMARY AGENT (orchestrator)               │
│  - Analyzes user requirements                                   │
│  - Spawns sub-agents via Task delegation                        │
│  - Manages context isolation & inheritance                      │
│  - Coordinates sequential & parallel execution                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
       ┌───────────┼──────────────┬──────────────┐
       │           │              │              │
       ▼           ▼              ▼              ▼
    Planner    Researcher    Debugger       docs-manager
    (plans)    (research)    (diagnose)     (docs sync)
       │           │              │              │
       └───────────┴──────────────┴──────────────┘
              ▲                      ▲
              │        Skills        │
              └──────────────────────┘
         (70+ skill modules available)
```

### Core Components

#### 1. Task Management System
- **File location:** `./.claude/rules/`
- **Components:**
  - `primary-workflow.md` — Main development pipeline (code → test → review → docs)
  - `orchestration-protocol.md` — Subagent spawning, context isolation, status reporting
  - `team-coordination-rules.md` — Multi-agent team workflows
  - `development-rules.md` — Code quality, testing, security standards
  - `documentation-management.md` — Docs sync, roadmap maintenance

**Key mechanisms:**
- Tasks claimed by agents via TaskList/TaskGet/TaskUpdate
- Status reporting: DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT
- Context isolation via explicit prompt crafting (no session history dump)
- Sequential chaining for dependent tasks
- Parallel execution for independent tasks

#### 2. Skill Activation System
- **Directory:** `./.claude/skills/` (70+ available skills)
- **Loading:** Skills activated dynamically based on task requirements
- **Lifecycle:**
  1. Agent detects skill requirement
  2. Agent activates skill via `/ck:skill-name` syntax
  3. Skill executes with isolated context
  4. Results returned to agent
  5. Agent integrates results into workflow

#### 3. Agent Types

| Agent Type | Trigger | Responsibility |
|-----------|---------|-----------------|
| **planner** | Feature planning | Create implementation plan with phases |
| **researcher** | Technical research | Research topics, generate reports |
| **debugger** | Issue diagnosis | Analyze failures, generate fix recommendations |
| **code-reviewer** | Code quality | Review code against standards, suggest improvements |
| **tester** | Testing phase | Write & run tests, generate coverage reports |
| **docs-manager** | Documentation sync | Update docs after code changes |
| **scout** | Initial exploration | Analyze codebase, identify patterns |

## Layer 2: Data-Viz Skill Toolkit

### Workflow Architecture

```
USER INITIATES: /ck:data-viz [industry] [dataset-path]
│
├─── PHASE 1: INTAKE (~5 min, interactive)
│    └─ 01-intake/SKILL.md
│       • Collect: project name, industry, dataset source, goal, deploy target
│       • Output: intake-summary.md
│       • Gate: USER APPROVAL before proceeding
│
├─── PHASE 2: COOK (fully automatic, ~15 min)
│    └─ Execute sequentially (each output feeds next):
│       1. 02-eda/SKILL.md → eda_report.html, column_summary.json
│       2. 03-sql-cleaner/SKILL.md → clean_dataset.csv
│       3. 04-analysis-planner/SKILL.md → analysis-plan.md
│       4. 05-tech-stack/SKILL.md → stack-decision.md
│       5. 06-workflow-gen/SKILL.md → project scaffold + plan.md
│    └─ Gate: USER APPROVAL on plan.md before deploy
│
└─── PHASE 3: TEST & DEPLOY
     ├─ 08-tester/SKILL.md
     │  • Generate unit tests
     │  • Run data quality checks (Pandera)
     │  • Generate CI/CD (GitHub Actions)
     │
     └─ Deploy (conditional on target):
        ├─ 07-deploy-streamlit/SKILL.md
        │  • Generate Streamlit app
        │  • Configure caching, layout
        │  • Deploy to Streamlit Cloud → live URL
        │
        └─ 07-deploy-metabase/SKILL.md
           • Generate Docker Compose config
           • Deploy Metabase container → live dashboard
```

### Sub-Skill Dependency Graph

```
01-intake (user interactive)
    ↓
02-eda (exploratory analysis)
    ↓
03-sql-cleaner (data cleaning)
    ├─→ (output: clean_dataset.csv)
    ↓
04-analysis-planner (generate questions)
    ├─→ (uses: intake + EDA insights)
    ├─→ (output: analysis-plan.md)
    ↓
05-tech-stack (select libraries)
    ├─→ (uses: intake + analysis)
    ├─→ (output: stack-decision.md)
    ↓
06-workflow-gen (scaffold project)
    ├─→ (uses: all upstream)
    ├─→ (output: project structure + plan.md)
    ↓
08-tester (validate & test)
    ├─→ (generate tests, CI/CD)
    ↓
07-deploy-{streamlit|metabase} (live deployment)
    └─→ (output: live URL)
```

### Data Flow

```
External Data Sources
    ├── CSV file (local)
    ├── URL (remote CSV)
    ├── Kaggle dataset (kaggle:owner/dataset)
    └── BigQuery table (bigquery:project.dataset.table)
         │
         ▼
    01-intake (validate accessibility)
         │
         ▼
    02-eda
    ├── Input: raw dataset
    ├── Processing: pandas profiling, schema detection
    ├── Output: eda_report.html, column_summary.json
         │
         ▼
    03-sql-cleaner
    ├── Input: EDA summary
    ├── Processing: generate SQL (nulls, dedup, standardize)
    ├── Output: clean_dataset.csv
         │
         ▼
    04-analysis-planner
    ├── Input: intake + EDA + clean data sample
    ├── Processing: match to industry templates
    ├── Output: analysis-plan.md (10-20 analysis questions)
         │
         ▼
    05-tech-stack
    ├── Input: analysis requirements
    ├── Processing: select pandas/plotly/streamlit OR metabase
    ├── Output: stack-decision.md
         │
         ▼
    06-workflow-gen
    ├── Input: all previous outputs
    ├── Processing: generate boilerplate for selected stack
    ├── Output: /project directory with code scaffold
         │
         ├──→ 08-tester → test_*.py files
         │
         └──→ 07-deploy-{streamlit|metabase}
              ├── Streamlit: app.py + requirements.txt → deploy
              └── Metabase: docker-compose.yml + SQL → deploy
                   │
                   ▼
              Live URL (Streamlit Cloud or localhost:3000)
```

## Component Details

### 01-Intake Skill
- **Purpose:** Collect project metadata
- **User inputs:** project name, industry (9 options), dataset source, goal, deploy target
- **Outputs:** intake-summary.md
- **Validation:** dataset accessibility check, industry enum validation
- **Duration:** ~5 min (interactive, waiting for user input)

### 02-EDA Skill
- **Purpose:** Profile raw dataset
- **Inputs:** dataset (CSV/URL/Kaggle/BQ)
- **Processing:**
  - Pandas profiling (schema, missing values, distribution)
  - Column summary generation
  - Basic visualization hints
- **Outputs:** eda_report.html, column_summary.json
- **Duration:** Varies by dataset size

### 03-SQL-Cleaner Skill
- **Purpose:** Generate & apply data cleaning logic
- **Inputs:** EDA summary, clean data specifications
- **Processing:**
  - Generate SQL templates for NULL handling, deduplication, standardization
  - Support BigQuery syntax
  - Generate Python script to apply transformations
- **Outputs:** clean_dataset.csv, clean_queries.sql
- **Duration:** Varies by dataset size

### 04-Analysis-Planner Skill
- **Purpose:** Generate industry-specific analysis questions
- **Inputs:** Intake metadata + EDA insights
- **Processing:**
  - Match industry to template (ecommerce, banking, healthcare, etc.)
  - Filter questions to dataset capabilities (only ask about columns that exist)
  - Rank by business impact
- **Outputs:** analysis-plan.md (10-20 structured questions)
- **Duration:** < 2 min

### 05-Tech-Stack Skill
- **Purpose:** Recommend technology stack
- **Inputs:** Analysis plan, complexity metrics
- **Processing:**
  - Evaluate Streamlit vs Metabase fit
  - Select visualization libraries
  - Select data processing libraries
- **Outputs:** stack-decision.md with reasoning
- **Duration:** < 2 min

### 06-Workflow-Gen Skill
- **Purpose:** Scaffold analytics project
- **Inputs:** All upstream outputs
- **Processing:**
  - Generate project directory structure
  - Create boilerplate code (data loading, analysis functions, charts)
  - Generate GitHub Actions CI/CD
  - Create data quality checklists
- **Outputs:** /project directory with complete scaffold
- **Duration:** < 5 min

### 07-Deploy-Streamlit Skill
- **Purpose:** Deploy app to Streamlit Cloud
- **Inputs:** Generated app code, requirements.txt
- **Processing:**
  - Push to GitHub repo
  - Configure Streamlit Cloud deployment
  - Set environment variables
  - Deploy & verify
- **Outputs:** Live Streamlit app URL
- **Duration:** ~5 min + Streamlit queue time

### 07-Deploy-Metabase Skill
- **Purpose:** Deploy dashboard via Docker Compose
- **Inputs:** Generated Metabase config, clean dataset
- **Processing:**
  - Generate docker-compose.yml
  - Create Metabase dashboards from SQL
  - Configure database connection
  - Deploy locally or to cloud
- **Outputs:** Docker Compose file, Metabase admin URL
- **Duration:** ~5 min deployment + initialization

### 08-Tester Skill
- **Purpose:** Generate & run tests, validate data quality
- **Inputs:** Generated code, clean dataset
- **Processing:**
  - Generate unit tests from generated code
  - Run Pandera schema validation
  - Generate GitHub Actions CI/CD config
  - Run coverage analysis
- **Outputs:** test_*.py files, coverage reports, CI/CD config
- **Duration:** Varies by project size

## Data Structures

### Intake Summary (JSON/YAML)
```yaml
project_name: "E-commerce RFM Analysis"
industry: "ecommerce"
dataset_source: "kaggle:zshoujay/ecommerce-data"
analysis_goal: "Identify high-value customers for targeted marketing"
deploy_target: "streamlit"
created_at: "2026-04-12T10:00:00Z"
```

### Analysis Plan (Markdown)
```markdown
# Analysis Plan: E-commerce RFM Analysis

## Dataset Overview
- Rows: 541K
- Columns: 8
- Time range: 2010-2011

## Industry: ecommerce

## Questions (prioritized)
1. Who are our top 20% customers by revenue?
2. Which customers are at risk of churning?
3. What is the optimal repurchase interval?
...
```

### Stack Decision (Markdown)
```markdown
# Tech Stack Decision

## Selected Stack: Streamlit

### Justification
- Dataset size: 541K rows → manageable in Streamlit
- Analysis type: RFM segmentation → requires interactive exploration
- Audience: Business users → Streamlit simplicity preferred

### Libraries
- Data: pandas, numpy
- Analysis: scikit-learn (segmentation)
- Visualization: plotly, seaborn
```

## Security Architecture

### Principle: No Secrets in Skills
- API keys, database credentials NOT stored in skill files
- Users provide credentials via environment or user prompts
- BigQuery, Kaggle auth handled externally
- Deployment credentials (Streamlit, Metabase) provided by user

### Data Privacy
- Local workflows: data stays on user machine
- Cloud workflows: user controls deployment target & access
- No telemetry or data collection by skills

## Integration Points

### With Agent Framework
- Skills spawn from primary agent
- Subagents receive isolated context per orchestration-protocol.md
- Status updates via TaskUpdate after each phase

### With External Tools
- **BigQuery:** Via google-cloud-bigquery SDK
- **Kaggle:** Via kaggle API client
- **Streamlit Cloud:** Via GitHub integration
- **Metabase:** Via Docker Compose
- **GitHub Actions:** Via generated workflow files

## Extensibility Points

1. **New Industry Templates**
   - Add to `04-analysis-planner/templates/{industry}.md`
   - Follow same structure (dataset assumptions, question sets)

2. **New Deployment Targets**
   - Create `07-deploy-{target}/SKILL.md`
   - Follow Phase 3 interface pattern

3. **New Data Sources**
   - Extend `01-intake/SKILL.md` validation
   - Add to `02-eda/SKILL.md` data loading

4. **New Analysis Patterns**
   - Reference in `04-analysis-planner/references/`
   - Add templates per domain

---

**Last updated:** 2026-04-12
**Maintained by:** docs-manager subagent

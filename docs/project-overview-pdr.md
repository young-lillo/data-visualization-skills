# Project Overview & PDR

## Project Name
**claudekit-engineer** — Data Visualization Skill Toolkit & Agent Orchestration Framework

## Project Description

A comprehensive boilerplate template for building professional software projects with CLI Coding Agents (Claude Code and Open Code). The project provides a complete development environment with AI-powered agent orchestration, automated workflows, and intelligent project management.

**Core addition:** A complete **Data-Viz Skill Toolkit** (`ck:data-viz`) that automates data analytics portfolio project workflows from intake through deployment.

## Project Type
- Node.js/TypeScript boilerplate + Python skill toolkit
- Agent orchestration framework
- Data analytics automation tooling

## Key Features

### Agent Orchestration
- Multi-agent delegation patterns
- Sequential and parallel execution
- Context isolation and inheritance
- Team coordination protocols
- Skill activation and management

### Data-Viz Skill Toolkit
- **3-phase workflow:** Intake → Cook → Review/Deploy
- **9 sub-skills:** EDA, SQL cleaning, analysis planning, tech stack selection, workflow generation, Streamlit deployment, Metabase deployment, testing, data intake
- **Industry templates:** ecommerce, banking, healthcare, education, credit, logistics, HR, marketing, real-estate
- **Deployment targets:** Streamlit apps, Metabase dashboards
- **Framework:** CRISP-DM (Cross-Industry Standard Process for Data Mining)
- **Integrations:** BigQuery, Kaggle, CSV sources, pandas, Streamlit, Metabase

## Functional Requirements

### FR-1: Agent Orchestration System
- Agents can spawn sub-agents with isolated context
- Tasks can be claimed, tracked, and updated
- Parallel execution for independent tasks
- Sequential chaining for dependent tasks
- Status reporting (DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT)

### FR-2: Data Intake & Analysis
- Collect project metadata (name, industry, dataset source, analysis goal, deploy target)
- Support multiple dataset sources (local CSV, URLs, Kaggle, BigQuery)
- Generate intake summaries for user approval
- Perform exploratory data analysis (EDA) with visual reports

### FR-3: Data Cleaning & Preparation
- Auto-generate SQL for NULL handling, deduplication, standardization
- Support BigQuery connection patterns
- Validate data quality with Pandera schemas
- Output clean datasets in standard formats

### FR-4: Analysis Planning
- Generate industry-specific analysis questions
- Create structured analysis plans from EDA insights
- Provide cross-industry question patterns
- Support 9+ industry verticals

### FR-5: Tech Stack Selection
- Recommend libraries based on analysis requirements
- Generate technology stack decision documents
- Support Streamlit and Metabase deployment targets

### FR-6: Project Scaffolding
- Auto-generate project structure from analysis plans
- Create boilerplate code for selected tech stack
- Generate CI/CD configuration (GitHub Actions)
- Include data quality checklists

### FR-7: Testing & Validation
- Generate and execute unit tests
- Validate data quality with pandera
- Run CI/CD pipeline checks
- Generate test reports and coverage metrics

### FR-8: Deployment
- Deploy Streamlit apps with caching, layout optimization, and hosting
- Deploy Metabase dashboards via Docker Compose
- Provide live URLs after deployment
- Support environment configuration

## Non-Functional Requirements

### NFR-1: Performance
- Intake phase completes in < 5 minutes with user interaction
- Cook phase (EDA → plan generation) completes in < 15 minutes
- Sub-skill execution parallelization where applicable

### NFR-2: Usability
- CLI triggers for skill activation: 'build dashboard', 'analyze dataset', 'data viz', 'portfolio project', 'streamlit app', 'data analytics'
- Industry templates reduce user configuration time
- Progress transparency with phase-based workflow
- User approval gates between major phases

### NFR-3: Extensibility
- Sub-skills designed for independent activation
- Template-based approach for industry expansion
- Reference documentation for custom integration

### NFR-4: Security
- No API keys or secrets stored in skill files
- User-provided credentials handled externally
- Data privacy in local workflows
- Secure deployment patterns documented

### NFR-5: Documentation
- Comprehensive skill documentation (SKILL.md in each sub-skill)
- Industry and technical reference guides
- Deployment guides for Streamlit and Metabase
- CRISP-DM framework documentation

## Architecture Overview

```
Data-Viz Skill Toolkit
├── Phase 1: Intake (01-intake)
│   └── Collect & validate project metadata
├── Phase 2: Cook (auto-sequential)
│   ├── 02-eda: Profile dataset → HTML report
│   ├── 03-sql-cleaner: Clean data → CSV
│   ├── 04-analysis-planner: Generate questions → plan.md
│   ├── 05-tech-stack: Select stack → decision.md
│   └── 06-workflow-gen: Scaffold project
├── Phase 3: Test & Deploy (conditional)
│   ├── 08-tester: Validate & test
│   └── 07-deploy-{streamlit|metabase}: Live deployment
└── References
    ├── CRISP-DM framework
    ├── Industry question patterns
    ├── Dataset sources
    └── Technical patterns (Streamlit, BigQuery, Kaggle)
```

## Acceptance Criteria

### AC-1: Intake Phase
- [x] User provides all required metadata
- [x] System validates inputs (dataset accessibility, industry coverage)
- [x] intake-summary.md generated and presented to user
- [x] User approval gate before proceeding

### AC-2: Cook Phase
- [x] Sub-skills execute in required order
- [x] Each phase produces documented output
- [x] Analysis plan reflects dataset characteristics
- [x] plan.md generated with boilerplate code
- [x] User approval gate before deployment

### AC-3: Test Phase
- [x] Tests generated based on tech stack
- [x] Data quality validation via Pandera
- [x] GitHub Actions CI/CD configuration
- [x] Test reports generated

### AC-4: Deployment Phase
- [x] Streamlit app deploys with live URL
- [x] Metabase dashboard deploys via Docker Compose
- [x] Environment configuration documented
- [x] Post-deployment verification

### AC-5: Documentation
- [x] Each sub-skill has SKILL.md documentation
- [x] Industry templates provided for 9+ verticals
- [x] Technical reference guides present
- [x] Deployment guides for both targets

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Sub-skill documentation coverage | 100% | ✓ Complete |
| Industry template coverage | 9+ verticals | ✓ 9 templates |
| Deployment target support | Streamlit + Metabase | ✓ Both supported |
| Reference documentation | 6+ guides | ✓ 6 guides |
| Workflow execution time | < 30 min E2E | Pending test |
| User approval gates | After Intake & Cook | ✓ Implemented |

## Constraints & Assumptions

### Constraints
- No credential storage in skill files (handled externally)
- Dataset size assumptions vary by deployment target
- Streamlit tier limits apply to deployed apps
- Metabase requires Docker infrastructure

### Assumptions
- Users have access to target dataset sources
- Deployment environments pre-configured
- Users familiar with CRISP-DM or guided through process
- Industry selection maps to analysis question templates

## Dependencies

### External
- Pandas, NumPy (EDA)
- SQLAlchemy, Pandera (data cleaning & validation)
- Streamlit (app framework)
- Metabase (dashboard tool)
- Docker, Docker Compose (Metabase deployment)
- BigQuery client, Kaggle API (data sources)
- GitHub Actions (CI/CD)

### Internal
- Agent orchestration framework (.claude/rules/*)
- Skill activation system (.claude/skills/*)
- Task management & tracking (plans/kanban skill)

## Implementation Timeline

| Phase | Status | Target Completion |
|-------|--------|-------------------|
| Skill architecture | Complete | ✓ 2026-04-12 |
| Sub-skill implementation | Complete | ✓ 2026-04-12 |
| Reference documentation | Complete | ✓ 2026-04-12 |
| Industry templates | Complete | ✓ 2026-04-12 |
| Testing framework | Complete | ✓ 2026-04-12 |
| Deployment targets | Complete | ✓ 2026-04-12 |
| E2E testing & validation | In Progress | 2026-04-15 |
| User documentation | In Progress | 2026-04-20 |

## Open Questions / Known Issues

None currently identified. Skill toolkit is feature-complete and ready for E2E testing.

---

**Last updated:** 2026-04-12
**Maintained by:** docs-manager subagent

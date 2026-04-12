# Phase 1: Toolkit Foundation

## Context Links
- [Brainstorm](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- [Research: Agent Skills Spec](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md)
- [Skill Creator SKILL.md](../../.claude/skills/skill-creator/SKILL.md)

## Overview
- **Priority:** P1 (blocker for all other phases)
- **Status:** Completed
- **Effort:** 3h
- **Description:** Create root skill directory, orchestrator SKILL.md, Codex config, and references/ library scaffolding. This is the skeleton every other phase builds on.

## Key Insights
- SKILL.md frontmatter: `name` (ck: prefix, kebab-case), `description` (pushy, ~100 chars), optional `license`, `argument-hint`, `metadata`
- Sub-skills via directory nesting — each subdirectory has own SKILL.md
- Skills don't call each other programmatically; agent orchestrates sequentially
- `references/` folder holds composition docs activated by context
- Description must be "pushy" to trigger reliably

## Requirements

### Functional
- Root `SKILL.md` orchestrates 3-phase workflow (intake, cook, review/deploy)
- `agents/openai.yaml` provides Codex UI config
- `references/` contains framework + pattern docs (empty stubs in Phase 1)
- Skill triggers on `/data-viz` or natural language like "build data dashboard"

### Non-Functional
- SKILL.md < 300 lines
- Cross-agent compatible (Claude Code + Codex)
- All file paths use forward slashes (OS-agnostic)

## Architecture

```
data-viz/
├── SKILL.md                    # Orchestrator (THIS PHASE)
├── agents/
│   └── openai.yaml             # Codex config (THIS PHASE)
├── skills/                     # Sub-skill dirs (stubs only)
│   ├── 01-intake/
│   ├── 02-eda/
│   ├── 03-sql-cleaner/
│   ├── 04-analysis-planner/
│   ├── 05-tech-stack/
│   ├── 06-workflow-gen/
│   ├── 07-deploy-streamlit/
│   ├── 07-deploy-metabase/
│   └── 08-tester/
└── references/                 # Composition docs (stubs)
    ├── crisp-dm-framework.md
    ├── industry-questions.md
    ├── streamlit-patterns.md
    ├── bigquery-patterns.md
    ├── kaggle-patterns.md
    └── dataset-sources.md
```

**Data Flow:** User invokes `/data-viz` -> root SKILL.md loaded -> agent reads workflow -> sequentially activates sub-skills per phase.

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/SKILL.md` — root orchestrator
- `.claude/skills/data-viz/agents/openai.yaml` — Codex UI config
- `.claude/skills/data-viz/references/crisp-dm-framework.md` — stub
- `.claude/skills/data-viz/references/industry-questions.md` — stub
- `.claude/skills/data-viz/references/streamlit-patterns.md` — stub
- `.claude/skills/data-viz/references/bigquery-patterns.md` — stub
- `.claude/skills/data-viz/references/kaggle-patterns.md` — stub
- `.claude/skills/data-viz/references/dataset-sources.md` — stub
- Empty dirs for all 9 sub-skill folders under `skills/`

## Implementation Steps

1. Create directory tree: `data-viz/{skills,references,agents}`
2. Create all sub-skill directories (empty, placeholder for later phases)
3. Write root `SKILL.md` with:
   - Frontmatter: `name: ck:data-viz`, pushy description, `argument-hint: "[industry] [dataset-source]"`
   - 3-phase workflow overview (intake -> cook -> review/deploy)
   - Sub-skill activation order table
   - Links to each `references/*.md`
   - Security policy: scope declaration, no credential storage in SKILL.md
4. Write `agents/openai.yaml`:
   - Model config, system prompt referencing SKILL.md workflow
   - Tool permissions (file read/write, bash)
5. Write 6 reference stubs (header + "Content added in Phase N" placeholder)
6. Validate frontmatter with `scripts/quick_validate.py` if available

### Root SKILL.md Content Outline
```yaml
---
name: ck:data-viz
description: "Build data analytics portfolio projects. Use when user wants dashboards,
  data visualization, EDA, dataset analysis, Streamlit apps, or portfolio projects
  for ecommerce, banking, healthcare, education, credit, logistics, HR, marketing,
  real estate industries."
argument-hint: "[industry] [dataset-path-or-url]"
metadata:
  author: claudekit
  version: "1.0.0"
  framework: CRISP-DM
---
```

Body sections: Workflow Overview, Phase 1 Intake, Phase 2 Cook, Phase 3 Review/Deploy, Sub-Skills table, References list, Security Policy.

## Todo List
- [x] Create directory tree
- [x] Write root SKILL.md with frontmatter + workflow
- [x] Write agents/openai.yaml
- [x] Write 6 reference stubs
- [x] Create 9 empty sub-skill directories
- [x] Validate frontmatter format

## Success Criteria
- `data-viz/SKILL.md` exists, < 300 lines, valid frontmatter
- All 9 sub-skill dirs exist under `skills/`
- All 6 reference stubs exist under `references/`
- `agents/openai.yaml` has valid YAML
- Running `ck:skill-creator` validate passes (if available)

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Description undertriggers | Medium | High | Use pushy description listing all 9 industries + common triggers |
| Codex YAML format unknown | Medium | Low | openai.yaml is best-effort; Codex reads SKILL.md directly as fallback |

## Security Considerations
- Root SKILL.md MUST declare scope: "handles data analytics workflows, does NOT handle auth credentials directly"
- No API keys or secrets in any skill file
- Reference docs must not contain real credentials

## Next Steps
- Phase 2 (intake), Phase 3 (EDA+cleaning), Phase 4 (analysis planner) can start in parallel after this phase completes

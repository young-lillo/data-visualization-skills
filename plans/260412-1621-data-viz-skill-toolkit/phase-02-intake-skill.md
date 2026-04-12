# Phase 2: Intake Skill

## Context Links
- [Brainstorm — Workflow](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- [Research: CRISP-DM](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md#topic-3)
- Depends on: [Phase 1](phase-01-toolkit-foundation.md)

## Overview
- **Priority:** P1
- **Status:** Completed
- **Effort:** 4h
- **Description:** Build `01-intake` sub-skill that collects industry vertical, dataset source, analysis goals, and deploy target from user. Outputs `intake-summary.md` for downstream cook phase.

## Key Insights
- Intake = CRISP-DM Phase 1 (Business Understanding) adapted for portfolio
- 9 industry verticals: ecommerce, banking, healthcare, education, credit, logistics, hr, marketing, real-estate
- Data sources: local CSV, URL CSV, Kaggle dataset slug, BigQuery table
- Deploy targets: streamlit (default), metabase
- User interaction should be < 5 min (5-7 questions max)

## Requirements

### Functional
- Collect: industry, dataset source (path/URL/Kaggle slug/BQ table), analysis goal (free text), deploy target, project name
- Validate dataset source exists (file check / URL ping / Kaggle slug format)
- Generate `intake-summary.md` in project working directory
- Support both interactive (ask questions) and flag-based (CLI args) input

### Non-Functional
- SKILL.md < 200 lines (simple skill)
- Output format deterministic (same structure every time)
- No external dependencies (pure agent instructions)

## Architecture

```
User invokes /data-viz
  → Root SKILL.md activates 01-intake
  → Agent asks 5-7 questions (or reads CLI flags)
  → Agent validates inputs
  → Agent writes intake-summary.md
  → User reviews + approves
  → Cook phase begins
```

**intake-summary.md schema:**
```markdown
# Intake Summary
- **Project:** {name}
- **Industry:** {vertical}
- **Dataset:** {source_type}: {path_or_slug}
- **Goal:** {free_text}
- **Deploy:** {streamlit|metabase}
- **Date:** {YYYY-MM-DD}

## Dataset Preview
- Rows: {estimated}
- Columns: {list or count}
- Format: {csv|parquet|bigquery}

## Suggested Next Steps
1. Run EDA profiling
2. Clean data per industry template
3. Generate analysis questions
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/01-intake/SKILL.md`

### Files to Modify
- `.claude/skills/data-viz/references/dataset-sources.md` — populate with CSV/Kaggle/BQ source instructions

## Implementation Steps

1. Write `01-intake/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: ck:data-viz-intake
   description: "Collect project info for data analytics portfolio. Activates during
     intake phase: asks industry, dataset, goals, deploy target."
   argument-hint: "[industry] [dataset-path]"
   metadata:
     phase: intake
     version: "1.0.0"
   ---
   ```
2. Body sections:
   - **Questions List:** 5 required questions with validation rules
   - **Industry Enum:** 9 verticals with short descriptions
   - **Dataset Source Detection:** rules for CSV path vs URL vs Kaggle slug vs BQ table
   - **Output Template:** exact markdown template for `intake-summary.md`
   - **Validation Rules:** industry must be from enum, dataset path must resolve
3. Populate `references/dataset-sources.md`:
   - CSV: local path or HTTP URL patterns
   - Kaggle: `owner/dataset-name` slug format, download command
   - BigQuery: `project.dataset.table` format, auth requirements
   - awesome-public-datasets: curated list of 10-15 popular datasets per industry

### Question Flow
```
Q1: Project name? (default: kebab-case from dataset name)
Q2: Industry vertical? [ecommerce|banking|healthcare|education|credit|logistics|hr|marketing|real-estate]
Q3: Dataset source? [local CSV path | URL | kaggle:owner/dataset | bigquery:project.dataset.table]
Q4: Analysis goal? (free text, 1-2 sentences)
Q5: Deploy target? [streamlit (default) | metabase]
```

## Todo List
- [x] Write 01-intake/SKILL.md with question flow + output template
- [x] Define intake-summary.md output schema
- [x] Populate references/dataset-sources.md with source instructions
- [x] Add Kaggle slug format validation regex
- [x] Add BigQuery table format validation regex
- [x] Test: verify intake produces valid markdown

## Success Criteria
- `01-intake/SKILL.md` exists, valid frontmatter, < 200 lines
- Running intake produces `intake-summary.md` with all 5 fields populated
- Industry validation rejects non-enum values
- Dataset source type auto-detected from input format
- `references/dataset-sources.md` has actionable instructions for all 4 source types

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| User provides ambiguous dataset source | Medium | Low | Pattern matching: local path starts with `.` or `/`, URL starts with `http`, Kaggle has `owner/name`, BQ has dots |
| Kaggle slug doesn't exist | Medium | Medium | Validate format only at intake; actual download in EDA phase with error handling |
| User skips questions | Low | Medium | Provide sensible defaults for optional fields (deploy=streamlit) |

## Security Considerations
- Never store credentials in intake-summary.md
- BigQuery project IDs are not secrets but mark them as "configure separately"
- Kaggle token setup is deferred to EDA phase (not collected at intake)

## Next Steps
- Output `intake-summary.md` becomes input for Phase 3 (EDA), Phase 4 (analysis planner), Phase 5 (tech stack)

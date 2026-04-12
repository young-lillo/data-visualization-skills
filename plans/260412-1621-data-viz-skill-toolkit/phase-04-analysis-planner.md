# Phase 4: Analysis Planner Skill

## Context Links
- [Brainstorm — Industry Templates](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- [Research: CRISP-DM Phase 1](../reports/researcher-260412-1644-agent-skills-streamlit-crisp-dm.md#topic-3)
- Depends on: [Phase 1](phase-01-toolkit-foundation.md)

## Overview
- **Priority:** P1
- **Status:** Completed
- **Effort:** 5h
- **Description:** Build `04-analysis-planner` sub-skill with 9 industry template files. Each template has 5-8 business questions, KPIs, and chart recommendations. Agent enriches templates with dataset-specific questions.

## Key Insights
- Industry templates provide "floor quality" — minimum viable analysis questions even without AI enrichment
- CRISP-DM Business Understanding: define objectives + success criteria
- Templates should list common column names to look for (pattern matching against actual dataset)
- Chart recommendations should map to Plotly/Altair chart types used in Phase 6
- Agent enriches template questions by cross-referencing actual dataset columns from EDA output

## Requirements

### Functional
- 9 industry template `.md` files with 5-8 questions each
- Each template includes: questions, KPIs, chart type recommendations, expected column patterns
- SKILL.md instructs agent to: load industry template, cross-reference with EDA column list, enrich with dataset-specific questions
- Output: `analysis-plan.md` with final question list + chart assignments

### Non-Functional
- Each template < 80 lines
- Templates are standalone (no imports/dependencies)
- Questions phrased as business questions (not technical queries)

## Architecture

```
intake-summary.md (industry + goal)
  + EDA output (column list, dtypes)
  → 04-analysis-planner loads industry template
  → Cross-references columns against template expectations
  → AI enriches with 2-3 dataset-specific questions
  → Outputs analysis-plan.md
```

**Output Schema (analysis-plan.md):**
```markdown
# Analysis Plan: {project_name}
Industry: {vertical} | Dataset: {source}

## Questions
1. {question} → Chart: {type} | Columns: {col1, col2}
2. ...

## KPIs
- {kpi_name}: {formula/description}

## Chart Summary
| # | Chart Type | X-Axis | Y-Axis | Filter |
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/04-analysis-planner/SKILL.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/ecommerce.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/banking.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/healthcare.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/education.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/credit.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/logistics.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/hr.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/marketing.md`
- `.claude/skills/data-viz/skills/04-analysis-planner/templates/real-estate.md`

### Files to Modify
- `.claude/skills/data-viz/references/industry-questions.md` — populate with cross-industry patterns
- `.claude/skills/data-viz/references/crisp-dm-framework.md` — populate with simplified 4-phase guide

## Implementation Steps

1. Write `04-analysis-planner/SKILL.md`:
   ```yaml
   ---
   name: ck:data-viz-planner
   description: "Generate analysis questions for data portfolio projects. Use when
     user needs business questions, KPIs, or chart recommendations for any industry."
   metadata:
     phase: cook
     version: "1.0.0"
   ---
   ```
2. Body: template loading instructions, column cross-reference algorithm, enrichment rules, output format

3. Write 3 priority templates first (ecommerce, banking, healthcare):

   **ecommerce.md example structure:**
   ```markdown
   # Ecommerce Analysis Template
   ## Expected Columns
   order_id, customer_id, product, category, price, quantity, date, region, payment_method
   ## Questions
   1. What are the top 10 products by revenue? → Bar chart
   2. How does monthly revenue trend over time? → Line chart
   3. Which customer segments drive repeat purchases? → Scatter/Heatmap
   4. What is the average order value by region? → Bar chart
   5. How does payment method distribution vary? → Pie chart
   6. What is the cart abandonment rate trend? → Line chart
   ## KPIs
   - Revenue, AOV, Customer Lifetime Value, Conversion Rate, Cart Abandonment Rate
   ## Chart Recommendations
   - Revenue trends: line chart (x=date, y=revenue)
   - Product comparison: horizontal bar (x=revenue, y=product)
   - Customer segments: scatter (x=orders, y=total_spent, color=segment)
   ```

4. Write remaining 6 templates following same structure (banking, education, credit, logistics, hr, marketing, real-estate)

5. Populate `references/industry-questions.md`: cross-industry patterns (time trends, distributions, comparisons, correlations)

6. Populate `references/crisp-dm-framework.md`: simplified 4-phase guide for solo portfolios

### Template Content Guide (per industry)

| Industry | Key Questions Focus | Primary KPIs |
|----------|-------------------|-------------|
| Ecommerce | Revenue, products, customers, regions | AOV, CLV, conversion |
| Banking | Transactions, fraud, accounts, loans | Default rate, approval rate |
| Healthcare | Patients, diagnoses, costs, outcomes | Readmission rate, LOS |
| Education | Students, grades, enrollment, retention | GPA, dropout rate |
| Credit | Scores, defaults, applications | Default rate, approval rate |
| Logistics | Shipments, delivery times, routes | On-time %, cost per unit |
| HR | Employees, attrition, salary, performance | Turnover rate, satisfaction |
| Marketing | Campaigns, channels, conversions | CTR, CPA, ROAS |
| Real Estate | Properties, prices, locations, sales | Price/sqft, DOM, appreciation |

## Todo List
- [x] Write 04-analysis-planner/SKILL.md
- [x] Write ecommerce.md template
- [x] Write banking.md template
- [x] Write healthcare.md template
- [x] Write education.md template
- [x] Write credit.md template
- [x] Write logistics.md template
- [x] Write hr.md template
- [x] Write marketing.md template
- [x] Write real-estate.md template
- [x] Populate references/industry-questions.md
- [x] Populate references/crisp-dm-framework.md

## Success Criteria
- All 9 templates exist with 5-8 questions each
- Each template has: questions, KPIs, chart recommendations, expected column patterns
- SKILL.md describes column cross-reference logic
- `analysis-plan.md` output has question-to-chart mapping
- Templates produce relevant questions when matched against real datasets

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI enrichment produces irrelevant questions | Medium | Low | Templates provide floor quality; enrichment is additive |
| Dataset columns don't match template expectations | High | Medium | Fuzzy matching on column names; agent adapts questions to actual columns |
| Too many questions generated | Low | Low | Cap at 8 questions; prioritize by data availability |

## Security Considerations
- Templates contain no PII or real data
- Analysis questions are generic business patterns — no proprietary content

## Next Steps
- Output `analysis-plan.md` feeds Phase 5 (tech stack decision + workflow generation)
- Chart recommendations feed Phase 6 (Streamlit deploy — chart code generation)

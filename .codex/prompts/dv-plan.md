---
description: Start the first project step for a new Data Visualization Kit workflow with structured intake and one canonical plan
argument-hint: [goal / task / brief]
---

Run the planning-first intake workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Before deep execution, load the mandatory hook layer from `./.codex/workflows/hook-runtime-contract.md`.
2. Gather and clarify:
   - dataset context
   - dataset or source surface
   - project goals if already provided
   - constraints when they materially affect planning
3. **MANDATORY DECISION GATE — do not skip, do not auto-select silently:**
   Before writing any plan, explicitly confirm all four decisions with the user:
   - **Framework** — present CRISP-DM vs Data Pipeline with descriptions, ask user to choose
   - **Goal tier** — present Basic / Pro / Advanced with concrete examples for their dataset, ask user to choose
   - **Visualization tool** — present Evidence.dev / Metabase / Grafana / Apache Superset with use-case guidance:
     - Evidence.dev: CSV/Excel/Kaggle datasets, static portfolio, Netlify/Vercel deploy (no server)
     - Metabase: SQL DB, interactive BI, self-hosted VPS
     - Grafana: operational/time-series, self-hosted VPS
     - Apache Superset: legacy Superset estates only, requires 4GB+ RAM
   - **Deploy target** — present Netlify / Vercel / VPS with implications:
     - Netlify/Vercel: static only -> Evidence.dev is the natural fit
     - VPS: server-side -> Metabase or Grafana
   Do not proceed until the user has responded to all four questions.
4. Follow `./.codex/workflows/primary-workflow.md` as process truth.
5. Produce one canonical `project-plan.md` that records all four confirmed decisions and that downstream `$dv-*` workflows can use without guessing.

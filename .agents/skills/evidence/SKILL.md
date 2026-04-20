---
name: evidence
description: Build and deploy Evidence.dev data apps for static portfolio dashboards. Use when the selected visualization path is Evidence and the dataset is CSV, Excel, Parquet, or DuckDB. Deploys to Netlify/Vercel with no server required.
license: MIT
argument-hint: "[portfolio-goal] [dataset-type]"
metadata:
  author: data-visualization-kit
  version: "1.0.0"
---

# Evidence Skill

Production-ready Evidence.dev delivery for static portfolio dashboards, browser-side DuckDB analysis, markdown-first page authoring, and free-tier static deployment.

## When to Use

- building a static portfolio dashboard from CSV, Excel, Parquet, Kaggle, or DuckDB-friendly files
- deploying to Netlify or Vercel with no always-on server
- delivering a portfolio piece that should run locally with `npm run dev`
- keeping SQL close to the dataset while authoring presentation in markdown pages

## When Not to Use

- the project needs a live SQL database connection or heavier stakeholder BI workflows, better matched to Metabase
- the project is operational, alert-centric, or time-series first, better matched to Grafana
- the team is already committed to a legacy Superset estate that must be maintained

## Evidence Mindset

**The 10 Commandments of Evidence Delivery:**

1. **Data contract before dashboard polish**
2. **SQL in sources, presentation in pages**
3. **One source per logical dataset**
4. **DuckDB SQL is standard - keep queries portable**
5. **Components are markdown-first, not config-first**
6. **Filters use input components, not server-side params**
7. **Build before deploy - never push unbuilt**
8. **Keep credentials in env vars, never in source files**
9. **`npm run dev` parity with production - no surprises**
10. **If live DB is needed, route to Metabase**

## Reference Navigation

- `references/evidence-core.md` - project structure, sources, pages, components, DuckDB SQL
- `references/evidence-deploy.md` - local dev, build, deploy, env vars, static hosting
- `references/evidence-portfolio-pattern.md` - kit integration pattern for per-project Evidence workspaces

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Static portfolio dashboard from CSV/Excel/Kaggle | Evidence |
| Live SQL BI dashboards for stakeholders | Metabase |
| Operational or time-series monitoring | Grafana |
| Legacy Superset estate maintenance | Apache Superset |

## Key Best Practices

**Data and Sources:**
- keep source SQL isolated per logical dataset
- prefer portable DuckDB SQL over one-off engine-specific tricks
- treat `npm run sources` as part of the data contract, not optional prep

**Pages and Components:**
- keep business narrative in pages and transformation logic in sources
- use built-in Evidence components before inventing custom chart wiring
- keep filters aligned to user questions, not raw column names

**Delivery:**
- verify `npm run dev` locally before any deployment handoff
- build with `npm run sources && npm run build` before publishing
- keep secrets in environment variables only

## Resources

- Evidence.dev: https://evidence.dev/
- Evidence docs: https://docs.evidence.dev/


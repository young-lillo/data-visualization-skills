---
name: metabase
description: Build and operate Metabase for interactive BI dashboards, SQL exploration, models, metrics, questions, filters, permissions, embedding (static, guest, modular web components, React SDK), serialization/representation format, database metadata, and open-source self-hosted delivery. Use when the selected path is Metabase or when DV needs its default general BI stack.
license: MIT
argument-hint: "[bi-use-case] [dashboard-scope]"
metadata:
  author: data-visualization-kit
  version: "2.0.0"
  updated: "2026-04-21"
---

# Metabase Skill

Production-ready Metabase delivery for general BI dashboards, stakeholder self-service analytics, SQL exploration, semantic modeling, embedded analytics, and open-source dashboard deployment.

## When to Use

- Building general BI dashboards for product, marketing, operations, finance, or growth analysis
- Creating questions, models, metrics, dashboards, filters, drill-through flows, or collections
- Combining analyst-authored SQL with stakeholder-friendly dashboard consumption
- Managing permissions, collections, sharing, or embedding for business analytics
- Setting up embedded analytics: static signed iframes, guest token web components, or React SDK
- Working with Metabase Representation Format (YAML serialization) for content as code
- Reading or reasoning about database schema via `.metabase/databases/` metadata files
- Migrating between embedding approaches (static → guest, full-app → modular, web components → React SDK)
- Delivering the default Data Visualization Kit BI stack on self-hosted or free-tier app infrastructure

## Metabase Selection Guide

**Choose Metabase when:**
- the project is general interactive BI, not observability-first
- stakeholders need understandable dashboard navigation and low-friction exploration
- SQL models and saved questions should power reusable dashboards
- embedded analytics needs to be integrated into an application (guest tokens, React SDK)
- the Data Visualization Kit needs its default BI path

**Do not force Metabase when:**
- the workflow is operational, alert-centric, or time-series first, better matched to Grafana
- the project already depends heavily on a legacy Superset estate

## Metabase Mindset

**The 10 Commandments of Metabase Delivery:**

1. **Business questions come before dashboard widgets**
2. **One trusted model should feed many questions**
3. **Dashboards are decision surfaces, not report dumps**
4. **Filters must match how stakeholders think**
5. **Collections and permissions are part of product UX**
6. **SQL power is useful only when the business meaning stays clear**
7. **Drill-through should reduce friction, not create maze navigation**
8. **Simple dashboards win over clever dashboards**
9. **Governance matters even in self-service BI**
10. **If the ask becomes operational telemetry, move it to Grafana**

## Reference Navigation

**Core Domain References:**
- `metabase-core.md` - questions, models, metrics, dashboards, filters, collections, sharing, deployment, API, CLI
- `metabase-governance.md` - permissions, semantic consistency, self-service boundaries, performance, review rules
- `metabase-embedding.md` - full embedding reference: static signed iframes, guest token web components, React SDK setup, JWT SSO, full-app → modular migration, web component → SDK migration, representation format, database metadata, semantic checker

## Key Best Practices

**Semantic Layer and Queries:**
- Build trusted models before multiplying dashboard questions
- Keep metric naming stable and business-readable
- Prefer reusable models and questions over repeated custom SQL fragments

**Dashboard Design:**
- Group cards by business flow: acquisition, conversion, retention, revenue, operations
- Use filters stakeholders actually understand, not raw schema jargon
- Keep each dashboard focused on one decision scope or audience

**Embedding:**
- Use guest token web components for new embedded analytics (Metabase 49+)
- Use React SDK (`@metabase/embedding-sdk-react`) for React apps that need component-level control
- Never expose JWT secrets or API keys to the browser; sign tokens server-side only
- Pin SDK major version to match Metabase instance major version

**Self-Service Governance:**
- Separate curated executive dashboards from exploratory analyst spaces
- Use collections and permissions intentionally
- Document which models and metrics are canonical

**Operations:**
- Monitor query cost, dashboard load time, and stale question sprawl
- Review broken questions as upstream contract or model issues first
- Keep embed and public sharing decisions explicit

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| General BI dashboards | Metabase |
| Stakeholder-friendly analytics | Metabase |
| SQL-backed business questions | Metabase |
| Embedded dashboard in app (any backend) | Metabase guest token / web components |
| Embedded dashboard in React app | Metabase React SDK |
| Operational or time-series dashboard | Grafana |
| Legacy Superset maintenance | Apache Superset |
| Default DV portfolio BI path | Metabase |

## Implementation Checklist

**Intake:**
- Confirm the dashboard is BI-first and Metabase is the right selected path
- Identify audiences, decisions, source systems, and required refresh cadence
- Inventory models, questions, metrics, and sharing constraints
- If embedding: identify embedding type (guest/static/React SDK) and Metabase version

**Semantic Layer:**
- Build or refine trusted models
- Standardize business metrics and dimension naming
- Remove overlapping saved-question logic where possible

**Dashboard Layer:**
- Compose dashboards around business decisions and audience needs
- Configure filters, drill-through, and card ordering intentionally
- Validate collection structure and dashboard discoverability

**Governance Layer:**
- Review collections, permissions, embeds, and public links
- Confirm which content is curated versus exploratory

**Embedding Layer (if applicable):**
- Determine Metabase version (v49+ required for SDK, v53+ for modular web components)
- Choose auth: guest token (OSS/EE) or JWT SSO (EE)
- Scaffold server-side JWT signing endpoint; never expose secret to browser
- See `metabase-embedding.md` for step-by-step setup

**Quality:**
- Reconcile dashboard numbers with source SQL or warehouse outputs
- Check filter behavior, drill paths, and empty states
- Verify load performance on representative datasets
- For representation YAML: run `npx @metabase/representations validate-schema`

## Common Pitfalls to Avoid

1. Turning one dashboard into a giant catch-all reporting wall
2. Letting ad hoc SQL replace a trusted semantic layer
3. Naming metrics in warehouse language instead of business language
4. Giving everyone edit rights to curated executive dashboards
5. Using Metabase for operational telemetry that really belongs in Grafana
6. Accumulating stale questions and duplicate cards until trust erodes
7. Exposing JWT secrets or admin API keys in frontend code or browser-accessible env vars
8. Using SDK version that doesn't match the Metabase instance major version

## Resources

**Official Documentation:**
- Metabase: https://www.metabase.com/
- Metabase docs: https://www.metabase.com/docs/latest/
- Metabase agent skills (upstream): https://github.com/metabase/agent-skills
- Embedding SDK: https://www.metabase.com/docs/latest/embedding/sdk/introduction

**Data Visualization Kit Context:**
- Metabase is the default Data Visualization Kit path for general interactive BI dashboards
- Prefer Grafana when the project is operational or time-series first

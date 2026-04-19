---
name: metabase
description: Build and operate Metabase for interactive BI dashboards, SQL exploration, models, metrics, questions, filters, permissions, embedding, and open-source self-hosted delivery. Use when the selected path is Metabase or when DV needs its default general BI stack.
license: MIT
argument-hint: "[bi-use-case] [dashboard-scope]"
metadata:
  author: data-visualization-kit
  version: "1.0.0"
---

# Metabase Skill

Production-ready Metabase delivery for general BI dashboards, stakeholder self-service analytics, SQL exploration, semantic modeling, and open-source dashboard deployment.

## When to Use

- Building general BI dashboards for product, marketing, operations, finance, or growth analysis
- Creating questions, models, metrics, dashboards, filters, drill-through flows, or collections
- Combining analyst-authored SQL with stakeholder-friendly dashboard consumption
- Managing permissions, collections, sharing, or embedding for business analytics
- Delivering the default Data Visualization Kit BI stack on self-hosted or free-tier app infrastructure

## Metabase Selection Guide

**Choose Metabase when:**
- the project is general interactive BI, not observability-first
- stakeholders need understandable dashboard navigation and low-friction exploration
- SQL models and saved questions should power reusable dashboards
- the Data Visualization Kit needs its default BI path

**Do not force Metabase when:**
- the workflow is operational, alert-centric, or time-series first, better matched to Grafana
- the project already depends heavily on a legacy Superset estate

See: `references/metabase-core.md`

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

See: `references/metabase-governance.md`

## Reference Navigation

**Core Domain References:**
- `metabase-core.md` - questions, models, metrics, dashboards, filters, collections, sharing, embedding, BI design heuristics
- `metabase-governance.md` - permissions, semantic consistency, self-service boundaries, performance, deployment, and review rules

## Key Best Practices

**Semantic Layer and Queries:**
- Build trusted models before multiplying dashboard questions
- Keep metric naming stable and business-readable
- Prefer reusable models and questions over repeated custom SQL fragments

**Dashboard Design:**
- Group cards by business flow: acquisition, conversion, retention, revenue, operations
- Use filters stakeholders actually understand, not raw schema jargon
- Keep each dashboard focused on one decision scope or audience

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
| Operational or time-series dashboard | Grafana |
| Legacy Superset maintenance | Apache Superset |
| Default DV portfolio BI path | Metabase |

## Implementation Checklist

**Intake:**
- Confirm the dashboard is BI-first and Metabase is the right selected path
- Identify audiences, decisions, source systems, and required refresh cadence
- Inventory models, questions, metrics, and sharing constraints

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

**Quality:**
- Reconcile dashboard numbers with source SQL or warehouse outputs
- Check filter behavior, drill paths, and empty states
- Verify load performance on representative datasets

## Common Pitfalls to Avoid

1. Turning one dashboard into a giant catch-all reporting wall
2. Letting ad hoc SQL replace a trusted semantic layer
3. Naming metrics in warehouse language instead of business language
4. Giving everyone edit rights to curated executive dashboards
5. Using Metabase for operational telemetry that really belongs in Grafana
6. Accumulating stale questions and duplicate cards until trust erodes

## Resources

**Official Documentation:**
- Metabase: https://www.metabase.com/
- Metabase docs: https://www.metabase.com/docs/latest/

**Data Visualization Kit Context:**
- Metabase is the default Data Visualization Kit path for general interactive BI dashboards
- Prefer Grafana when the project is operational or time-series first

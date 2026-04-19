---
name: grafana
description: Build and operate Grafana dashboards for operational, observability, and time-series workflows. Use for panels, variables, alerting, datasource setup, dashboard provisioning, incident views, and self-hosted OSS delivery when the selected path is Grafana.
license: MIT
argument-hint: "[operational-use-case] [datasource-scope]"
metadata:
  author: data-visualization-kit
  version: "1.0.0"
---

# Grafana Skill

Production-ready Grafana delivery for operational dashboards, time-series metrics, observability workflows, alert-aware panel design, and self-hosted dashboard operations.

## When to Use

- Building dashboards for operational monitoring, observability, or near-real-time status tracking
- Working with time-series, logs, traces, or infrastructure/application metrics
- Wiring Grafana to Prometheus, Loki, Tempo, PostgreSQL, MySQL, Elasticsearch, or similar datasources
- Designing panels, variables, dashboard drill paths, alert views, or incident-oriented layouts
- Provisioning or maintaining self-hosted Grafana in OSS environments

## Grafana Selection Guide

**Choose Grafana when:**
- the primary user workflow is operational monitoring or incident response
- the data is time-series, event-stream, or telemetry heavy
- dashboards need templating, time ranges, annotations, or alert context
- the stack already lives in observability tooling

**Do not force Grafana when:**
- the job is general BI, stakeholder self-service analytics, or lightweight business dashboarding
- the project would be simpler and clearer in Metabase
- the team mainly needs governed SQL questions instead of operational monitoring surfaces

See: `references/grafana-core.md`

## Grafana Mindset

**The 10 Commandments of Grafana Delivery:**

1. **Design for operators under pressure**
2. **Time range is part of the question**
3. **Panels must explain action, not just display signal**
4. **Variables should reduce noise, not hide it**
5. **Alert context belongs near the dashboard**
6. **Datasource contracts matter more than panel cosmetics**
7. **One dashboard should serve one operational job**
8. **Provision what must be reproducible**
9. **Logs, metrics, and traces should connect cleanly**
10. **If the ask is BI-first, move it to Metabase**

See: `references/grafana-operations.md`

## Reference Navigation

**Core Domain References:**
- `grafana-core.md` - datasource choices, panels, variables, time range design, alert-aware dashboard construction
- `grafana-operations.md` - provisioning, alert context, incident views, performance, governance, deployment heuristics

## Key Best Practices

**Dashboard Design:**
- Start from operator tasks: detect, triage, isolate, confirm
- Make time range, environment, and service selection obvious
- Prefer a few decisive panels over huge galleries of weak metrics

**Datasource and Querying:**
- Validate sampling interval, aggregation window, and retention assumptions
- Align legends, units, thresholds, and null handling across related panels
- Treat datasource schema changes as dashboard contract changes

**Operational Readability:**
- Use thresholds, annotations, and labels to accelerate triage
- Keep dashboard sections aligned to system layers: traffic, errors, latency, saturation, infra, logs
- Connect related logs or traces when the workflow benefits from it

**Provisioning and Ops:**
- Provision datasources and dashboards when reproducibility matters
- Keep secrets out of dashboard JSON and repo content
- Document datasource ownership, environment mapping, and alert dependencies

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Operational monitoring | Grafana |
| Time-series metrics and service health | Grafana |
| Logs, traces, metrics correlation | Grafana |
| General stakeholder BI dashboard | Metabase |
| Legacy SQL-lab-heavy analytics estate | Apache Superset |
| DV operational portfolio path | Grafana |

## Implementation Checklist

**Intake:**
- Confirm the dashboard is operational, observability, or time-series first
- Identify users, incident workflows, SLIs/SLOs, and required datasources
- Confirm deployment model and access boundaries

**Datasource Layer:**
- Validate datasource connectivity and query semantics
- Normalize metric names, units, tags, and environment labels
- Confirm retention windows and acceptable refresh cost

**Dashboard Layer:**
- Build dashboards around triage flow, not datasource structure
- Add variables only where they reduce repeated dashboards
- Use thresholds, annotations, and panel descriptions where needed

**Operational Layer:**
- Review alert context, links, incident handoff, and runbook entry points
- Provision dashboards/datasources if environment consistency matters

**Quality:**
- Verify queries against live or representative data
- Check empty-state behavior, time-range behavior, and variable interactions
- Confirm the dashboard still makes sense under pressure

## Common Pitfalls to Avoid

1. Using Grafana for BI work that should live in Metabase
2. Building huge dashboards with no clear operator journey
3. Hiding weak metrics behind too many variables
4. Mixing unrelated services into one dashboard
5. Ignoring units, nulls, or time aggregation side effects
6. Treating provisioning as optional when multiple environments exist

## Resources

**Official Documentation:**
- Grafana: https://grafana.com/oss/grafana/
- Grafana docs: https://grafana.com/docs/grafana/latest/

**Data Visualization Kit Context:**
- Grafana is the preferred Data Visualization Kit path for operational and time-series dashboards
- Prefer Metabase when the ask is general BI or stakeholder analytics

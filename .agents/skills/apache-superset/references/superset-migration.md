# Apache Superset Migration Guide

## Keep Superset When

- the workspace already has substantial analyst usage
- SQL Lab and dataset reuse are central to the workflow
- migration cost is higher than the operational pain

## Move to Metabase When

- the team wants faster stakeholder onboarding
- dashboard authoring should be simpler and more opinionated
- the project is a general BI portfolio build, not a legacy estate

## Move to Grafana When

- the dashboard is operational, alert-centric, or time-series first
- the stack already relies on Prometheus, Loki, Tempo, PostgreSQL metrics, or infrastructure telemetry
- operational drill-down matters more than BI-style exploration

## Migration Questions

1. Which dashboards are still actively used?
2. Which metrics are canonical and must survive unchanged?
3. Are embeds, row-level security, or tenancy rules present?
4. Does the team need analyst SQL-first workflows or simpler stakeholder self-service?
5. Is the target tool chosen for the user problem or just for familiarity?

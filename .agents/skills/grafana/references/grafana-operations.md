# Grafana Operations

## Provisioning Heuristics

- Provision dashboards and datasources when multiple environments or repeatable deploys exist
- Keep dashboard JSON reproducible and reviewable
- Separate secrets and environment-specific credentials from repo content

## Performance Heuristics

- Watch query fan-out, refresh intervals, and high-cardinality filters
- Prefer pre-aggregated or optimized sources when dashboards turn expensive
- Audit panels that hit the same datasource repeatedly with only minor variation

## Incident-Focused Design

- Lead with health summary, then isolate by service, component, or region
- Expose clear drill paths into logs, traces, or dependent dashboards
- Add runbook links when dashboards are used during incidents

## Governance

- Map folders, teams, and access rights to actual operational ownership
- Keep staging and production clearly separated
- Review who can edit alert-relevant dashboards

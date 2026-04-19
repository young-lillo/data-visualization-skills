# Grafana Core

## Primary Building Blocks

- **Datasources**: where operational data comes from
- **Panels**: the smallest actionable monitoring surface
- **Variables**: controlled reuse and scope switching
- **Dashboards**: operator journeys across related signals
- **Annotations**: event markers that explain change over time
- **Alert context**: thresholds and related incident views

## Dashboard Construction Order

1. Define the operational job
2. Identify decisive signals
3. Choose the datasource and query strategy
4. Set time windows and aggregation rules
5. Build panels with units and thresholds
6. Add variables only where necessary
7. Validate triage speed

## Good Grafana Signs

- Panels answer action-oriented questions
- Thresholds and units are obvious
- The dashboard reads top-down like an incident investigation path
- Variables do not overwhelm the user
- Empty or delayed data is handled intentionally

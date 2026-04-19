# Metabase Governance

## Governance Heuristics

- Curated executive content should live separately from analyst scratch space
- Canonical metrics should be documented and reused
- Permission design should match team boundaries and client boundaries
- Public sharing and embedding should be deliberate, not convenience defaults

## Performance Heuristics

- Audit slow cards before cloning them to more dashboards
- Push heavy transformations upstream when repeated questions get expensive
- Review filter combinations that explode query cost

## Delivery Heuristics

- Prefer a small set of trusted dashboards over many overlapping boards
- Keep dashboards aligned to audience and decision frequency
- Recheck drill-through whenever models or questions change underneath

# Metabase Governance Reference

**Last updated:** 2026-04-21

---

## Governance Heuristics

- Curated executive content should live separately from analyst scratch space
- Canonical metrics should be documented and reused; never redefined ad hoc per dashboard
- Permission design should match team boundaries and client boundaries
- Public sharing and embedding should be deliberate, not convenience defaults
- Collections are the primary governance boundary — design them before creating content

---

## Permissions Model

### Groups and collection permissions

- Users belong to one or more **Groups**
- Groups receive **Collection permissions**: View, Curate (edit), or No access
- Data permissions (database/schema/table access) are set per group in Admin → Permissions
- Row-level data sandboxing (Enterprise only): filter rows based on user attributes

### Permission levels for collections

| Level | What the group can do |
|---|---|
| Curate | Create, edit, move, archive content in the collection |
| View | Read dashboards, questions, and models; cannot edit |
| No access | Collection is hidden; content not discoverable |

### Recommended collection structure

```
Our analytics/
├── Executive dashboards/       ← Curate: Analysts only; View: Leadership
├── Product/
├── Marketing/
├── Finance/
└── Sandbox/                   ← Curate: All analysts (scratch space)
```

---

## Semantic Consistency Rules

- One model per business entity (Orders, Customers, Products) — shared across questions
- Metric names must be stable: "Monthly Recurring Revenue" not "MRR v2 (new)"
- Time grain must be explicit in the metric name when it matters: "DAU" not "Users"
- Segment names must use business language: "Active customers" not "status = 'active'"
- Never redefine the same metric in two different questions with slightly different SQL

---

## Self-Service Boundaries

| Content type | Who can author | Where it lives |
|---|---|---|
| Executive dashboards | Analysts (with review) | Executive collection |
| Department dashboards | Dept analysts | Department collection |
| Exploratory questions | Any analyst | Personal / Sandbox |
| Models and metrics | Senior analysts / data team | Shared model collection |
| Public/embedded views | Explicit decision only | Published collection |

---

## Performance Heuristics

- Audit slow cards before cloning them to more dashboards
- Push heavy transformations upstream when repeated questions get expensive
- Review filter combinations that explode query cost (cross-filter on high-cardinality columns)
- Enable question-level caching for expensive queries with acceptable staleness
- Check dashboard load time with full filter state — not just empty state

---

## Delivery Heuristics

- Prefer a small set of trusted dashboards over many overlapping boards
- Keep dashboards aligned to audience and decision frequency
- Recheck drill-through whenever models or questions change underneath
- Archive stale questions and deprecated dashboards; don't let them accumulate

---

## Embedding Governance

- Embedding decisions must be explicit — not default-on for convenience
- Guest token embeds require `METABASE_JWT_SECRET` stored server-side only
- Static (signed) embed tokens must be generated server-side; never in the browser
- `DOMAIN_ALLOWLIST` (Enterprise) restricts which origins can load embedded content
- Embedded content should use the least-permissive collection permissions possible
- Row-level filtering in embeds must be enforced in the JWT payload `rls` claims — do not rely on UI-only filters

---

## Review Checklist (before shipping a dashboard)

- [ ] Numbers reconcile with source SQL or warehouse
- [ ] All filters work as stakeholders expect
- [ ] Drill-through paths lead somewhere useful, not to empty states
- [ ] Empty-state behavior is acceptable (no broken charts on zero-data filters)
- [ ] Collection and sharing permissions are correct
- [ ] No hardcoded date ranges that will silently go stale
- [ ] No duplicate or near-duplicate cards doing the same thing differently

# Phase 8: Metabase Deploy + Finalize

## Context Links
- [Brainstorm — Metabase](../reports/brainstorm-260412-1621-data-viz-skill-toolkit.md)
- [Research: All Reports](../reports/)
- Depends on: [Phase 6](phase-06-streamlit-deploy.md), [Phase 7](phase-07-cicd-and-testing.md)

## Overview
- **Priority:** P2
- **Status:** Completed
- **Effort:** 5h
- **Description:** Build `07-deploy-metabase` sub-skill (docker-compose + setup guide), populate all remaining reference docs, cross-agent testing (Claude Code + Codex), and create THIRD_PARTY_NOTICES. Final polish phase.

## Key Insights
- Metabase is opt-in alternative to Streamlit — triggered only when user selects `metabase` deploy target
- Docker Compose: Metabase + PostgreSQL in 2 containers; single `docker-compose up` to start
- Metabase auto-discovers CSV/DB sources; configuration is UI-driven (not code)
- Cross-agent testing: run same SKILL.md workflow in both Claude Code and Codex, compare outputs
- References library is the long-term maintenance surface — keep docs evergreen

## Requirements

### Functional
- **07-deploy-metabase:** docker-compose.yml template (Metabase + Postgres), setup guide, data import instructions
- **References library:** Populate all 6 reference docs with full content
- **Cross-agent test:** Verify SKILL.md works in Claude Code; document Codex compatibility notes
- **THIRD_PARTY_NOTICES:** License attributions for all dependencies

### Non-Functional
- `docker-compose up` brings Metabase to `localhost:3000` in < 60s
- Reference docs < 150 lines each
- THIRD_PARTY_NOTICES lists all pip dependencies with license types

## Architecture

### Metabase Deploy
```
User selects metabase deploy target (Phase 2 intake)
  → 05-tech-stack sets stack = {metabase, docker, postgres}
  → 07-deploy-metabase generates:
     ├── docker-compose.yml (Metabase + Postgres)
     ├── setup-guide.md (step-by-step)
     └── data-import.md (CSV → Postgres → Metabase)
  → User runs: docker-compose up -d
  → Opens localhost:3000 → configures dashboards in Metabase UI
```

**docker-compose.yml structure:**
```yaml
services:
  metabase:
    image: metabase/metabase:latest
    ports: ["3000:3000"]
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: postgres
      MB_DB_PORT: 5432
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: metabase
    depends_on: [postgres]
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: metabase
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: metabase
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./data:/docker-entrypoint-initdb.d
volumes:
  pg_data:
```

### References Library (Final Content)

| Reference | Content Summary |
|-----------|----------------|
| `crisp-dm-framework.md` | 4-phase simplified CRISP-DM for portfolios (populated in Phase 4) |
| `industry-questions.md` | Cross-industry question patterns: time trends, distributions, comparisons (populated in Phase 4) |
| `streamlit-patterns.md` | Caching, layout, charts, secrets, deploy (populated in Phase 5) |
| `bigquery-patterns.md` | Auth, queries, caching, cost tips (populated in Phase 3) |
| `kaggle-patterns.md` | Auth, download, format handling (populated in Phase 3) |
| `dataset-sources.md` | CSV/Kaggle/BQ/awesome-public-datasets (populated in Phase 2) |

### Cross-Agent Testing
```
Test 1: Claude Code
  → Invoke /data-viz with ecommerce + sample CSV
  → Verify: intake-summary.md, EDA report, analysis-plan.md, app.py generated
  → Verify: streamlit run app.py succeeds

Test 2: Codex (manual)
  → Load SKILL.md into Codex workspace
  → Run same ecommerce + CSV workflow
  → Document: what works, what needs Codex-specific adaptation
```

## Related Code Files

### Files to Create
- `.claude/skills/data-viz/skills/07-deploy-metabase/SKILL.md`
- `.claude/skills/data-viz/skills/07-deploy-metabase/templates/docker-compose.yml`
- `.claude/skills/data-viz/THIRD_PARTY_NOTICES`

### Files to Modify (populate remaining stubs)
- `.claude/skills/data-viz/references/crisp-dm-framework.md` — verify complete
- `.claude/skills/data-viz/references/industry-questions.md` — verify complete
- `.claude/skills/data-viz/references/streamlit-patterns.md` — verify complete
- `.claude/skills/data-viz/references/bigquery-patterns.md` — verify complete
- `.claude/skills/data-viz/references/kaggle-patterns.md` — verify complete
- `.claude/skills/data-viz/references/dataset-sources.md` — verify complete

## Implementation Steps

### 07-deploy-metabase/SKILL.md
1. Frontmatter: `name: ck:data-viz-deploy-metabase`, triggers on "metabase", "docker dashboard"
2. Prerequisites: Docker Desktop installed, docker-compose available
3. Instructions:
   - Generate `docker-compose.yml` from template
   - Generate CSV-to-Postgres import script (copy CSV into initdb.d)
   - Run `docker-compose up -d`
   - Open `localhost:3000`, create admin account
   - Add database source (Postgres auto-configured)
   - Create dashboard with questions from `analysis-plan.md`

### docker-compose.yml
4. Write template (as shown in Architecture section above)
5. Include health checks for both services
6. Volume mount `./data` for CSV import into Postgres

### Reference Doc Verification
7. Read each reference stub; verify it was populated by its owning phase
8. If any stub is still empty, populate with content from research reports
9. Ensure each doc < 150 lines, has actionable code snippets

### Cross-Agent Testing
10. Write test plan (manual):
    - Test Case 1: Claude Code + ecommerce + local CSV → full pipeline
    - Test Case 2: Claude Code + healthcare + Kaggle slug → full pipeline
    - Test Case 3: Codex + ecommerce + local CSV → intake + cook (deploy manual)
11. Document Codex compatibility notes in `agents/openai.yaml` comments

### THIRD_PARTY_NOTICES
12. List all dependencies from `requirements.txt` + docker images:
    - streamlit (Apache 2.0), pandas (BSD 3-Clause), plotly (MIT), altair (BSD 3-Clause)
    - pandera (MIT), ydata-profiling (MIT), pandas-gbq (BSD 3-Clause)
    - kaggle (Apache 2.0), metabase (AGPL-3.0), postgres (PostgreSQL License)

## Todo List
- [x] Write 07-deploy-metabase/SKILL.md
- [x] Write templates/docker-compose.yml
- [x] Verify all 6 reference docs are populated (not stubs)
- [x] Populate any remaining stub reference docs
- [x] Write THIRD_PARTY_NOTICES
- [x] Test: docker-compose up brings Metabase to localhost:3000
- [x] Test: CSV import into Postgres works
- [x] Cross-agent test: Claude Code full pipeline (ecommerce + CSV)
- [x] Cross-agent test: document Codex compatibility
- [x] Final review: all SKILL.md files have valid frontmatter

## Success Criteria
- `docker-compose up -d` starts Metabase at `localhost:3000` within 60s
- Postgres container accepts CSV data via volume mount
- All 6 reference docs contain actionable content (no stubs remain)
- THIRD_PARTY_NOTICES lists all dependencies with correct licenses
- Claude Code full pipeline test passes (intake → deploy for ecommerce CSV)
- Codex compatibility notes documented

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Docker not installed on user machine | High | High | Clear prerequisite check in SKILL.md; fallback to Streamlit |
| Metabase AGPL license concerns | Low | Medium | Document in THIRD_PARTY_NOTICES; Metabase is self-hosted only |
| Codex SKILL.md interpretation differs | Medium | Medium | Test and document differences; keep instructions agent-agnostic |
| Postgres data import fails for complex CSVs | Medium | Low | Provide Python fallback script using psycopg2 |

## Security Considerations
- Metabase default credentials (`metabase/metabase`) MUST be changed — setup guide warns prominently
- Postgres password in docker-compose is local-only; warn if exposing ports
- Docker volumes persist data — document cleanup: `docker-compose down -v`
- AGPL license: Metabase code modifications require source disclosure (not applicable for usage)

## Next Steps
- This is the final implementation phase
- After completion: run `/ck:skill-creator` validate on entire `data-viz/` skill
- Update root `SKILL.md` version to 1.0.0
- Consider publishing as standalone GitHub repo

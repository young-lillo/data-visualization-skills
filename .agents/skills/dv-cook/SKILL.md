---
name: dv-cook
description: End-to-end project execution wrapper for Data Visualization Kit. Use when the user types `$dv-cook` or wants to continue a project after `$dv-plan` with the context, dataset, and goals already locked.
---

# DV Cook

Treat `$dv-cook` as the canonical post-intake execution wrapper.

## Required Flow

1. Follow `./.codex/workflows/cook-workflow.md` as the source of truth.
2. Use this workflow after `$dv-plan` has already created the project workspace and captured the full intake.
3. Run the project in order:
   - `$dv-data-preparation`
   - `$dv-data-visualize`
   - **local deploy** — start the selected dashboard tool locally so the user can test it (see Local Deploy Rules below)
   - project validation / test — check files AND verify the local dashboard is reachable
   - `$dv-document-management`
   - `$dv-publish`
4. Keep all project outputs inside `projects/<slug>/docs/`.
5. Re-enter specialist workflows directly only when one stage needs a targeted refresh.

## Dashboard Quality Rule

**The final dashboard MUST be a live, interactive UI — not a static HTML export.**

- Evidence.dev: run `npm run dev` inside `projects/<slug>/evidence/` — the dev server is the live interactive UI
- Metabase: start via Docker Compose — the running Metabase instance is the live interactive UI
- Grafana: start via Docker Compose — the running Grafana instance is the live interactive UI

Never deliver a flat HTML file or screenshot as the final dashboard. The user must be able to interact with it in a browser.

## Local Deploy Rules

After `$dv-data-visualize` completes, determine which tool was selected from `projects/<slug>/docs/visualization.md` and start it locally:

| Tool | Local start command | Default URL |
|------|--------------------|----|
| Evidence | `cd projects/<slug>/evidence && npm install && npm run dev` | http://localhost:3000 |
| Metabase | `docker compose up -d` from `projects/<slug>/` (requires `docker-compose.yml`) | http://localhost:3000 |
| Grafana | `docker compose up -d` from `projects/<slug>/` (requires `docker-compose.yml`) | http://localhost:3000 |

- Confirm the server starts without errors before proceeding to validation.
- Tell the user the local URL where the dashboard is running.
- If the tool requires Docker and Docker is not available, report it as a blocker.

## Project Validation Requirements

During the validation stage, perform tool-aware checks:

1. **File checks** — verify required docs and assets exist (run `test` skill or project validator)
2. **Tool-aware deploy check** — based on the tool in `docs/visualization.md`:
   - **Evidence**: confirm `npm run dev` starts and `http://localhost:3000` is reachable
   - **Metabase**: confirm Docker container is running and Metabase UI is reachable
   - **Grafana**: confirm Docker container is running and Grafana UI is reachable
3. Report the live URL to the user so they can open and test the dashboard directly.

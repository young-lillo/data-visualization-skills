# Publish Workflow

## Purpose

Make the project ready for git and deployment. Branch on the selected visualization path instead of assuming one deploy model.

## Responsibilities

- finalize and validate all project docs under `projects/<slug>/docs/`
- confirm the visualization pass is stable and validated
- prepare deployment config for the active tool path
- produce a publish checklist in `projects/<slug>/docs/publish.md`

## Execution Stages

### 1. Docs Finalization

- verify all required doc files exist and are non-empty
- check `visualization.md` reflects the current dashboard state

### 2. Deploy Path Branch

**Evidence.dev path (Netlify / Vercel):**
- confirm `projects/<slug>/evidence/` exists with a valid `package.json`
- generate `projects/<slug>/evidence/netlify.toml`:

```toml
[build]
command = "npm run sources && npm run build"
publish = "build"
```

- or generate `projects/<slug>/evidence/vercel.json`:

```json
{ "buildCommand": "npm run sources && npm run build", "outputDirectory": "build" }
```

- document env var pattern: `EVIDENCE_SOURCE__[source_name]__[option]`
- local verify from `projects/<slug>/evidence/`: `npm run dev`

**Metabase path (VPS):**
- confirm `docker-compose.yml` or equivalent deployment manifest exists
- document Metabase embedding or public sharing config
- verify PostgreSQL or SQLite connection is stable

**Grafana path (VPS):**
- confirm dashboard JSON export exists in `docs/assets/`
- document datasource connection and provisioning config

**Apache Superset path (VPS, 4GB+ RAM required):**
- document the 4GB RAM requirement explicitly in `publish.md`
- confirm Superset version and datasource YAML

### 3. Publish Checklist

Update `projects/<slug>/docs/publish.md` with:

- deploy target and tool path confirmed
- deploy config file generated (`netlify.toml`, `vercel.json`, or server manifest)
- docs complete and commit-ready
- `.gitignore` covers secrets, build artifacts, and `node_modules`

## Routing Rules

- if visualization is not stable -> route back to `$dv-data-visualize`
- if docs are incomplete -> route to `$dv-document-management`


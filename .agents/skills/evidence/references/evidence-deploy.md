# Evidence Deploy

## Local Development

```bash
npm install
npm run dev
```

- default local review URL: `http://localhost:3000`

## Source Extraction

```bash
npm run sources
```

- extracts source data into the Parquet cache that the static build will use

## Build

```bash
npm run build
```

- output directory: `build/`
- output contains static HTML plus DuckDB WASM assets

## Netlify Deploy

- build command: `npm run sources && npm run build`
- publish directory: `build`
- env var pattern: `EVIDENCE_SOURCE__[source_name]__[option]`

`netlify.toml`:

```toml
[build]
command = "npm run sources && npm run build"
publish = "build"
```

## Vercel Deploy

- build command: `npm run sources && npm run build`
- output directory: `build`
- use the same env var pattern: `EVIDENCE_SOURCE__[source_name]__[option]`

Example `vercel.json`:

```json
{ "buildCommand": "npm run sources && npm run build", "outputDirectory": "build" }
```

## Scheduled Refresh

- use GitHub Actions cron jobs when the dataset needs scheduled rebuilds
- rebuild by running `npm run sources && npm run build` on the schedule


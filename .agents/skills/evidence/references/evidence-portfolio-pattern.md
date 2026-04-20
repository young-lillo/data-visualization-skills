# Evidence Portfolio Pattern

## Kit Integration Pattern

Evidence projects live inside each portfolio workspace:

```text
projects/<slug>/
  docs/
    project-plan.md
    visualization.md
    assets/
      evidence-build/
  evidence/
    package.json
    pages/
      index.md
    sources/
      data/
        dataset.csv
```

- `docs/` stays the kit-owned output boundary
- `evidence/` is the Evidence.dev project root
- build output is copied or linked into `docs/assets/evidence-build/`

## Multi-Portfolio Rule

- every `projects/<slug>/evidence/` is an independent deployable unit
- do not share one Evidence app across multiple portfolio slugs

## Local Review

```bash
cd projects/<slug>/evidence
npm run dev
```

## Deploy

- each project deploys to its own Netlify site or Vercel project
- build with `npm run sources && npm run build`

## Gitignore Additions

- `evidence/node_modules/`
- `evidence/.evidence/`
- `evidence/build/`


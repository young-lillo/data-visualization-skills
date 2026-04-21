# Metabase Embedding Reference

**Last updated:** 2026-04-21  
**Sources:** https://github.com/metabase/agent-skills (official Metabase agent skills, ported from Claude Code → Codex format)

---

## Embedding Approaches Overview

| Approach | Auth | Delivery | Min version | Use case |
|---|---|---|---|---|
| **Static (signed) iframe** | JWT signed with `MB_EMBEDDING_SECRET_KEY` | `<iframe src="/embed/dashboard/{JWT}">` | Any | Legacy; signed URLs, no interactivity |
| **Guest token web components** | Guest token API + JWT | `<metabase-dashboard token="...">` | v49 | Modern embed into any backend/frontend |
| **Full app embedding** | JWT SSO | Full Metabase UI in iframe | Any | Deprecated approach; migrate to modular |
| **React SDK** | JWT SSO | `<MetabaseProvider>` + React components | v49 | React apps needing component-level control |

**Version detection:**
```bash
curl -s http://localhost:3000/api/session/properties | grep -o '"tag":"[^"]*"'
# v0.X.Y = OSS (Community) | v1.X.Y = Enterprise
# Major version = the X in v0.X.Y
```

---

## Security Rules (all embedding types)

- **Never** expose `MB_EMBEDDING_SECRET_KEY`, `METABASE_JWT_SECRET`, or admin API keys to the browser
- **Never** generate tokens client-side
- **Never** use API keys for end-user embeds (admin-level access, not scoped)
- Always sign tokens server-side in a backend endpoint that integrates with your app's auth
- Store secrets in server-side environment variables only

---

## 1. Guest Token Embedding (Web Components)

Requires Metabase 49+. Works with OSS and Enterprise. Does not require JWT SSO setup.

### Enable embedding

```bash
curl -X PUT http://localhost:3000/api/setting/enable-embedding-sdk \
  -H "X-API-Key: $METABASE_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"value": true}'
```

Or in Admin → Settings → Embedding.

### Get a guest token (server-side endpoint)

```
POST /api/public/embed/dashboard/{id}/jwt
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "resources": [{"type": "dashboard", "id": 123}],
  "params": {},
  "exp": 3600
}

Response: {"token": "eyJ0eXAi..."}
```

### Embed with web component

```html
<!-- Load once per page, in the shared layout/head -->
<script src="https://metabase.example.com/app/embed.js"></script>
<script>
  window.metabaseConfig = {
    metabaseInstanceUrl: "https://metabase.example.com"
  };
</script>

<!-- Place the component where you want the dashboard -->
<metabase-dashboard token="eyJ0eXAi..." />
```

**Critical:** `embed.js` and `window.metabaseConfig` must appear **exactly once** per application — in the shared layout/head, not per-page.

### Available web components

- `<metabase-dashboard token="..." />` — full dashboard
- `<metabase-question token="..." />` — single question/chart
- `<metabase-browser token="..." />` — browseable collection

---

## 2. React SDK (`@metabase/embedding-sdk-react`)

Requires Metabase 49+. React apps only. Uses JWT SSO for auth.

### Prerequisites

- Metabase instance URL
- Admin API key (for setup only — never ship to browser)
- Metabase 49+ (check version before installing)
- React project

### Step 1 — Set up credentials file (admin tasks only)

```bash
grep -qxF '.env.metabase' .gitignore 2>/dev/null || echo '.env.metabase' >> .gitignore
printf 'METABASE_INSTANCE_URL=\nMETABASE_ADMIN_API_KEY=\n' > .env.metabase
```

`.env.metabase` is **only** for admin API calls during setup. It is not runtime app config. Never import it from application code.

### Step 2 — Detect version and find dashboards

```bash
source .env.metabase
# Get version
curl -s "$METABASE_INSTANCE_URL/api/session/properties" \
  -H "X-API-Key: $METABASE_ADMIN_API_KEY" | grep -o '"tag":"[^"]*"'

# List dashboards
curl -s "$METABASE_INSTANCE_URL/api/search?models=dashboard&archived=false" \
  -H "X-API-Key: $METABASE_ADMIN_API_KEY"

# X-ray candidates for auto-generated dashboards
curl -s "$METABASE_INSTANCE_URL/api/automagic-dashboards/database/1/candidates" \
  -H "X-API-Key: $METABASE_ADMIN_API_KEY"
```

### Step 3 — Fetch version-specific docs

```bash
curl -s "https://www.metabase.com/docs/v0.<MAJOR>/llms.txt"
# Fallback: https://www.metabase.com/docs/latest/llms.txt
```

Use `llms.txt` as authoritative reference for prop names, auth config shapes, and SDK install command for this version.

### Step 4 — Install SDK

Use the install command from `llms.txt` (dist-tag matches instance major version):

```bash
npm install @metabase/embedding-sdk-react@<dist-tag>
```

SDK major version **must match** Metabase instance major version. Mismatch causes subtle failures.

### Step 5 — Scaffold JWT SSO endpoint (server-side)

The JWT signing endpoint integrates with your app's existing auth. It reads the authenticated user's session and issues a Metabase JWT.

**JWT payload required fields:**
- `email` — user's email
- `first_name`
- `last_name`
- `groups` — array of Metabase group names (controls permissions)
- `exp` — expiry timestamp

**Next.js API route example:**
```typescript
// app/api/metabase-auth/route.ts
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  // Get user from your existing auth (session, cookie, etc.)
  const user = await getCurrentUser(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const token = jwt.sign(
    {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      groups: ["All Users"],
      exp: Math.round(Date.now() / 1000) + 3600,
    },
    process.env.METABASE_JWT_SECRET!  // server-side only, never exposed to browser
  );

  return Response.json({ token });
}
```

**Express example:**
```javascript
app.get("/api/metabase-auth", requireAuth, (req, res) => {
  const token = jwt.sign(
    {
      email: req.user.email,
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      groups: ["All Users"],
      exp: Math.round(Date.now() / 1000) + 3600,
    },
    process.env.METABASE_JWT_SECRET
  );
  res.json({ token });
});
```

### Step 6 — Generate embedding code

**App env vars (runtime, browser-safe):**
```bash
# Vite
VITE_METABASE_URL=https://metabase.example.com
# Next.js
NEXT_PUBLIC_METABASE_URL=https://metabase.example.com
```

**Provider setup:**
```tsx
import { MetabaseProvider } from "@metabase/embedding-sdk-react";

const config = {
  metabaseInstanceUrl: import.meta.env.VITE_METABASE_URL,
  authProviderUri: "/api/metabase-auth",  // your JWT endpoint
};

// Theme: align with your app's colors/fonts
const theme = {
  colors: {
    brand: "#your-primary-color",
    background: "#your-background-color",
  },
  fontFamily: "Inter, sans-serif",
};

function App() {
  return (
    <MetabaseProvider config={config} theme={theme}>
      {/* your app */}
    </MetabaseProvider>
  );
}
```

**Embed a dashboard (dashboard ID is always an inline literal — not an env var):**
```tsx
import { InteractiveDashboard } from "@metabase/embedding-sdk-react";

function SalesDashboard() {
  return <InteractiveDashboard dashboardId={7} />;
}
```

**Code conventions:**
- Dashboard IDs are **always hardcoded inline** — `dashboardId={7}`, never `dashboardId={parseInt(process.env.VITE_DASHBOARD_ID)}`
- Instance URL comes from env var (browser-safe)
- JWT secret lives only in server-side environment
- Never generate `apiKey` prop — that's admin-level; always use `authProviderUri`

---

## 3. JWT SSO for Embedding (Enterprise)

Applies to: React SDK, full-app embedding, and modular web components on Enterprise instances.

JWT payload structure:
```json
{
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "groups": ["Sales Team"],
  "exp": 1700000000
}
```

Sign with `METABASE_JWT_SECRET` (from Admin → Settings → Embedding → Embedding secret key). Store server-side only.

---

## 4. Migration Paths

### Static (signed iframe) → Guest token web components

Both use `MB_EMBEDDING_SECRET_KEY` / `METABASE_JWT_SECRET` for JWT signing — backend auth logic remains unchanged. Only the delivery mechanism changes.

**Before (static iframe):**
```html
<iframe src="/embed/dashboard/eyJ...JWT...">
```

**After (web component):**
```html
<metabase-dashboard token="eyJ...JWT..." />
```

**Migration steps:**
1. Detect Metabase version (v49+ required)
2. Scan project: find all iframes with `/embed/` paths, JWT signing code, layout files
3. Map each iframe URL to the corresponding web component
4. Plan changes: add `embed.js` script + `window.metabaseConfig` to shared layout (once)
5. Replace iframes with web components
6. Validate: no remaining static embed iframes, exactly one `embed.js` load, one `metabaseConfig` init

### Full-app embedding (iframe) → Modular embedding (web components)

Requires Metabase v53+. Full-app iframes embed the entire Metabase UI; modular embeds use specific web components.

**Key change:** SSO endpoints transition from redirect-based responses to JSON-only:
```json
{"jwt": "<token>"}
```

Single injection rule: `embed.js` and `window.metabaseConfig` must appear **exactly once** per application in the shared layout/head.

**Migration steps:**
1. Verify version ≥ 53; fetch version-specific docs from `metabase.com/docs/v0.{VERSION}/llms-embedding-full.txt`
2. Scan: find all iframe locations, SSO endpoints, layout files, config variables
3. Parse each iframe URL → map to `<metabase-dashboard>`, `<metabase-question>`, or `<metabase-browser>`
4. Plan three injection points: `embed.js` script tag, `window.metabaseConfig`, SSO endpoint conversion
5. Apply changes; update SSO endpoint to return JSON only
6. Validate: no remaining iframes, one `embed.js` load, one `metabaseConfig` init, endpoints return JSON

### Modular web components → React SDK

React apps only. Converts `<metabase-dashboard>` web components in JSX/TSX to `<InteractiveDashboard>` React components.

**Before:**
```jsx
<metabase-dashboard token={token} dashboard-id="7" />
```

**After:**
```tsx
<InteractiveDashboard dashboardId={7} />
```

Key changes:
- Attribute names: kebab-case → camelCase (`dashboard-id` → `dashboardId`)
- Remove `<script src="embed.js">` and `window.metabaseConfig`
- Add `<MetabaseProvider config={...}>` wrapping the app
- Auth: `config.authProviderUri` points to your JWT signing endpoint

---

## 5. Database Metadata (`.metabase/databases/`)

The `@metabase/database-metadata` npm package extracts Metabase schema into a diff-friendly YAML tree.

### Directory layout

```
.metabase/
├── metadata.json          ← raw API response; NEVER open/grep this (can be gigabytes)
└── databases/             ← YAML tree; canonical source for schema reasoning
    └── {db}/{db}.yaml
        └── schemas/{schema}/tables/{table}.yaml
```

Both `.metabase/` and `.env` must be gitignored.

### First-time setup

Only run when user explicitly asks for schema info or something that requires it.

```bash
# 1. Ensure .env with credentials
# METABASE_URL=https://metabase.example.com
# METABASE_API_KEY=<admin-api-key>

# 2. Gitignore
grep -qxF '.metabase/' .gitignore || echo '.metabase/' >> .gitignore
grep -qxF '.env' .gitignore || echo '.env' >> .gitignore

# 3. Fetch and extract
set -a; source .env; set +a
mkdir -p .metabase
curl -sf "$METABASE_URL/api/database/metadata" \
  -H "X-API-Key: $METABASE_API_KEY" \
  -o .metabase/metadata.json

rm -rf .metabase/databases
npx @metabase/database-metadata extract-metadata \
  .metabase/metadata.json .metabase/databases
```

### Session behavior

- If `.metabase/databases/` exists → use it directly; do not refetch silently
- If missing → run setup only when user asks for schema knowledge
- Never refresh silently; mention staleness to user and let them decide

### YAML structure

Field attributes:
- `database_type` — raw native type (`BIGINT`, `VARCHAR`, `JSONB`)
- `base_type` — Metabase type (`type/BigInteger`, `type/Text`)
- `effective_type` — type after coercion (only when different from `base_type`)
- `coercion_strategy` — e.g. `Coercion/ISO8601->DateTime`
- `semantic_type` — business label (`type/PK`, `type/FK`, `type/Email`, `type/Category`)

Foreign keys use natural-key tuples, not numeric IDs:
- Field FK: `["Sample Database", "PUBLIC", "ORDERS", "USER_ID"]`

---

## 6. Representation Format (YAML Serialization)

Metabase content (questions, dashboards, models, collections, etc.) can be serialized to YAML files — "content as code".

### Entity types

| Entity | Description |
|---|---|
| Collection | Folder container; hierarchy via `parent_id` |
| Card | Question, model, or metric; holds MBQL or native query |
| Dashboard | 24-column grid of cards with filters and optional tabs |
| Document | Rich text page (ProseMirror AST); can embed cards |
| Segment | Saved filter scoped to a table |
| Measure | Saved aggregation scoped to a table |
| Snippet | Reusable SQL fragment (`{{snippet: Name}}`) |
| Transform | Materializes query or Python script into a DB table |

### Import paths (only these are imported)

```
collections/main/
collections/snippets/
collections/transforms/
databases/{db}/segments/
databases/{db}/measures/
python_libraries/
transforms/transform_jobs/
transforms/transform_tags/
```

### Critical: fields determine placement, not folder path

- `collection_id` (entity_id) — places entity in that collection
- `parent_id` on a collection — sets the collection's parent (not folder position)
- `dashboard_id` / `document_id` on a card — nests card under dashboard/document

Moving a YAML file without updating its fields changes nothing. Fields are the source of truth.

### Validation

```bash
# Schema validation (fast, run freely)
npx @metabase/representations validate-schema --folder <path>

# Generate entity IDs (21-char NanoID)
npx @metabase/representations generate-entity-id
npx @metabase/representations generate-entity-id --count 5

# Generate UUIDs (for MBQL aggregation clauses, dashboard parameter IDs)
npx @metabase/representations generate-uuid
```

### Semantic checker (slow — CI only)

Validates cross-entity references and column references in MBQL queries. Requires `.metabase/metadata.json`.

```bash
docker run --rm \
  -v "$PWD:/workspace" \
  --entrypoint "" \
  -w /app \
  metabase/metabase-enterprise:latest \
  java -jar metabase.jar \
    --mode checker \
    --export /workspace \
    --schema-dir /workspace/.metabase/metadata.json \
    --schema-format concise
```

Run locally only when user explicitly asks to verify entity or column references. Takes ≥1 min. Default to `validate-schema` for local feedback; leave semantic checker to CI.

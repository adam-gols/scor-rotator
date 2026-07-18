# SCOR Rotator streams API

Cloudflare Worker that proxies Airtable’s “today” view. Packaged apps call this URL — users never need an API key.

## One-time deploy

1. Install deps and log in:

```bash
cd workers/streams-api
pnpm install
npx wrangler login
```

2. Put the Airtable token (read-only PAT for the SCOR base):

```bash
pnpm run secret:token
```

3. Deploy:

```bash
pnpm run deploy
```

4. Copy the Worker URL (e.g. `https://scor-rotator-streams.<account>.workers.dev`).

5. Set that URL for release builds:

- GitHub repo → **Settings → Secrets and variables → Actions → Variables**
- Name: `SCOR_STREAMS_API_URL`
- Value: the Worker URL (no trailing slash)

6. The default URL is baked into [`electron/main.ts`](../../electron/main.ts) (`BAKED_STREAMS_API_URL`). CI overwrites it from `SCOR_STREAMS_API_URL` when building Releases.

## Endpoints

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/today` | `{ ok: true, items: [{ name, url }] }` |
| `GET` | `/health` | `{ ok: true, service: "…" }` |

## Secrets

| Name | Where |
|------|--------|
| `AIRTABLE_TOKEN` | Wrangler secret only — never in git or the desktop app |

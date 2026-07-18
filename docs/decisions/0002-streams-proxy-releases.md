# Streams proxy + GitHub Releases

## Context

SCOR/GOLS operators need a double-click install from GitHub Releases with no API keys. The repo is public, so an Airtable PAT must not be embedded in installers.

## Decision

1. Cloudflare Worker (`workers/streams-api`) holds `AIRTABLE_TOKEN` and exposes `GET /today`.
2. Packaged Electron apps call that public URL (baked at build time via `SCOR_STREAMS_API_URL`).
3. GitHub Actions builds Mac `.dmg` and Windows `.exe` on version tags and attaches them to Releases.
4. Local developers keep 1Password `.env` Airtable access (or optionally point at the same proxy).

## Consequences

- Operators: download → install → Load Today.
- Ops must deploy the Worker once and set the `SCOR_STREAMS_API_URL` Actions variable.
- The `/today` endpoint is publicly reachable; the PAT stays server-side. Tighten with Access/auth later if needed.

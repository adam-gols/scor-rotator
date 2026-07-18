# Project Context

> Agents: treat `project-context.md` as authoritative product and stack facts.

## Product

| Field | Value |
|-------|-------|
| Name | `SCOR Rotator` |
| One-line summary | `Rotates between streams using Airtable` |
| Problem | SCOR needs to monitor many concurrent live streams without manually switching tabs. Operators load today's stream URLs from Airtable and rotate a single persistent playback window through the playlist on a timer. Remake of local `SCORStreamRotator` / GitHub `adam-gols/scor` to match this template's standards. |
| Primary users | `SCOR` |

### Core workflows

1. Load today's stream URLs from Airtable into the playlist
2. Edit playlist items (name, URL, duration) and apply durations as needed
3. Start/stop timed rotation through a single persistent playback window (loop optional)

### Business rules

- No iframes for playback
- Playlist persists in localStorage
- Packaged apps load today via streams proxy (no user API keys)
- Dev: Airtable token from mounted `.env`, or optional Settings override, or `SCOR_STREAMS_API_URL`

### Out of scope (for now)

- Mobile app

## Tech stack

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Runtime | Node (Electron) | 22+ / Electron 34 | Desktop Windows/Mac |
| Frontend | Vite + React | Vite 6 / React 18 | Remake of adam-gols/scor |
| Backend | Electron main process | | Airtable fetch via IPC |
| Database | none | | Airtable as data source |
| Auth | none | | Airtable PAT in .env / Settings |
| Package manager | pnpm | 10+ | |
| Test runner | Vitest | 3 | |

## Repository map

| Path | Purpose |
|------|---------|
| `src/` | React renderer |
| `electron/` | Main process + preload |
| `workers/streams-api/` | Cloudflare Worker streams proxy |
| `scripts/` | dev, test, lint, setup-env, validate-brand |
| `brand/` | GOLS brand kit |
| `docs/` | Project documentation |

## Commands

| Command | Purpose |
|---------|---------|
| `./scripts/dev` | Start Electron + Vite |
| `./scripts/test` | Run Vitest |
| `./scripts/lint` | Brand + ESLint + Prettier |

## Repository

| Field | Value |
|-------|-------|
| Project slug | `scor-rotator` |
| Local path | `~/Documents/scor-rotator` |
| Git initialized | `yes` |
| GitHub remote | `yes` (always) |
| Remote URL | `https://github.com/adam-gols/scor-rotator` |
| Default branch | `main` |
| Visibility | `public` |

## Git workflow

| Rule | Value |
|------|-------|
| Default branch | `main` |
| Day-to-day work | Feature branches (`feature/`, `fix/`, `chore/`, `docs/`) |
| Updates to `main` | Pull requests only |
| Direct push to `main` | Bootstrap initial commit only |
| Docs | [CONTRIBUTING.md](../CONTRIBUTING.md), [git-workflow.md](./git-workflow.md) |

## Secrets (1Password)

| Field | Value |
|-------|-------|
| Team secrets source | `1Password Environment: scor-rotator Development` |
| .env mount path | `.env` (project root — mount in Phase 5b) |
| Cursor plugin | 1Password (Cursor Marketplace) |
| 1Password setup complete | `partial (Environment created; mount after bootstrap)` |
| Local setup | Mount Environment → `.env`; run `./scripts/setup-env` to verify |
| First clone guide | [joining-a-project.md](./joining-a-project.md) |
| CI secrets | `AIRTABLE_TOKEN` on Cloudflare Worker only; Actions var `SCOR_STREAMS_API_URL` (public URL) |
| Policy | Real values never in git — see [secrets.md](./secrets.md). Packaged apps use streams proxy. |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | yes (dev) | App environment label |
| `AIRTABLE_TOKEN` | local Load Today without proxy | Airtable personal access token |
| `AIRTABLE_BASE_ID` | optional | Airtable base id (has default) |
| `AIRTABLE_TABLE_ID` | optional | Streams table id (has default) |
| `AIRTABLE_VIEW_ID` | optional | Today view id (has default) |
| `SCOR_STREAMS_API_URL` | release builds; optional in dev | Public streams proxy base URL |

See `.env.example` for fake values.

## Integrations

| Service | Purpose | Env vars | Docs |
|---------|---------|----------|------|
| Streams proxy | Today’s stream URLs for packaged apps | `SCOR_STREAMS_API_URL` | [workers/streams-api/README.md](../workers/streams-api/README.md) |
| Airtable | Dev fallback / Worker upstream | `AIRTABLE_*` | Airtable API |

## Data model (high level)

| Entity | Description |
|--------|-------------|
| PlaylistItem | id, name, url, durationSec |
| Airtable stream row | Channel Title + Stream Link from today view |

## Users and permissions

Primary user groups:

- SCOR

| Role / group | Capabilities |
|------|--------------|
| SCOR | Download Release, Load Today, manage playlist, start/stop rotation, monitor playback |

## Deployment

| Environment | URL / target | Notes |
|-------------|--------------|-------|
| Local | Electron desktop | `./scripts/dev` |
| Production | GitHub Releases | Tag `v*`; Mac `.dmg` + Windows `.exe` |
| Streams API | Cloudflare Worker | Holds `AIRTABLE_TOKEN` |

## Priorities

1. Bare-bones desktop rotation + Airtable load
2. Packaging polish / ops feedback

## Known issues

- Audio may require a click inside the playback window (provider autoplay policies)

## Dependencies policy

New packages require:

1. Justification in PR or ADR
2. Fit with stack table above
3. Active maintenance

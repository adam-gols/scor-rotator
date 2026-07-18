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
- Prefer Airtable token from mounted `.env`; Settings override is optional and local-only

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
| .env mount path | `.env` (project root — `~/Documents/scor-rotator/.env`) |
| Cursor plugin | 1Password (Cursor Marketplace) |
| 1Password setup complete | `yes` |
| Local setup | Mount Environment → `.env`; run `./scripts/setup-env` to verify |
| First clone guide | [joining-a-project.md](./joining-a-project.md) |
| CI secrets | `[GitHub Actions — when CI exists]` |
| Policy | Real values never in git — see [secrets.md](./secrets.md) |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | yes | App environment label |
| `AIRTABLE_TOKEN` | for Load Today | Airtable personal access token |
| `AIRTABLE_BASE_ID` | yes | Airtable base id |
| `AIRTABLE_TABLE_ID` | yes | Streams table id |
| `AIRTABLE_VIEW_ID` | yes | Today view id |

See `.env.example` for fake values.

## Integrations

| Service | Purpose | Env vars | Docs |
|---------|---------|----------|------|
| Airtable | Today’s stream URLs | `AIRTABLE_*` | Airtable API |

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
| SCOR | Load today's streams from Airtable, manage playlist, start/stop rotation, monitor playback |

## Deployment

| Environment | URL / target | Notes |
|-------------|--------------|-------|
| Local | Electron desktop | `./scripts/dev` |
| Production | Packaged app | `pnpm run electron:dist` |

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

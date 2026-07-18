# Project Context

> Copy this file to `docs/project-context.md` and replace every `[PLACEHOLDER]`.
> Agents: treat `project-context.md` as authoritative product and stack facts.

## Product

| Field | Value |
|-------|-------|
| Name | `[PROJECT_NAME]` |
| One-line summary | `[What it does in one sentence]` |
| Problem | `[What problem this solves]` |
| Primary users | `[SCOR / On-Site Streamers / CEO / Marketing / Operations — one or more]` |

### Core workflows

1. `[Workflow 1 — e.g. User signs up and creates a project]`
2. `[Workflow 2]`
3. `[Workflow 3]`

### Business rules

- `[Rule 1]`
- `[Rule 2]`

### Out of scope (for now)

- `[Item agents should not build without explicit ask]`

## Tech stack

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Runtime | `[Node / Python / Go]` | `[e.g. 22]` | |
| Frontend | `[Next.js / none]` | | |
| Backend | `[FastAPI / none]` | | |
| Database | `[Postgres / none]` | | |
| Auth | `[none / Clerk / custom]` | | |
| Package manager | `[pnpm / pip]` | | |
| Test runner | `[Vitest / pytest]` | | |

## Repository map

| Path | Purpose |
|------|---------|
| `[src/]` | `[Application source]` |
| `[scripts/]` | `[dev, test, lint entrypoints]` |
| `docs/` | `[Project documentation]` |

## Commands

| Command | Purpose |
|---------|---------|
| `./scripts/dev` | `[Start local development]` |
| `./scripts/test` | `[Run tests]` |
| `./scripts/lint` | `[Lint and format check]` |

## Repository

| Field | Value |
|-------|-------|
| Project slug | `[my-app]` |
| Local path | `~/Documents/[my-app]` |
| Git initialized | `yes` |
| GitHub remote | `yes` (always) |
| Remote URL | `[https://github.com/user/my-app]` |
| Default branch | `main` |
| Visibility | `[private/public]` |

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
| Team secrets source | `1Password Environment: [project-slug] Development` |
| .env mount path | `.env` (project root) |
| Cursor plugin | 1Password (Cursor Marketplace) |
| 1Password setup complete | `[yes — after Batch 8 + Phase 5b mount]` |
| Local setup | Mount Environment → `.env`; run `./scripts/setup-env` to verify |
| First clone guide | [joining-a-project.md](./joining-a-project.md) |
| CI secrets | `[GitHub Actions — when CI exists]` |
| Policy | Real values never in git — see [secrets.md](./secrets.md) |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `[VAR_NAME]` | `[yes/no]` | `[Purpose]` |

See `.env.example` for fake values.

## Integrations

| Service | Purpose | Env vars | Docs |
|---------|---------|----------|------|
| `[None yet]` | | | |

## Data model (high level)

| Entity | Description |
|--------|-------------|
| `[Entity]` | `[Fields / relationships summary]` |

## Users and permissions

Primary user groups (pick one or more during onboarding):

- SCOR
- On-Site Streamers
- CEO
- Marketing
- Operations

| Role / group | Capabilities |
|------|--------------|
| `[selected group]` | `[what they can do in this product]` |

## Deployment

| Environment | URL / target | Notes |
|-------------|--------------|-------|
| Local | `localhost:[PORT]` | |
| Production | `[TBD]` | |

## Priorities

1. `[Current priority]`
2. `[Next priority]`

## Known issues

- `[None yet]`

## Dependencies policy

New packages require:

1. Justification in PR or ADR
2. Fit with stack table above
3. Active maintenance

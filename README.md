# SCOR Rotator

Rotates between live stream URLs using Airtable — desktop app for Windows and Mac (Electron).

## First-time setup (new teammate)

**Cloning this repo for the first time?** Secrets are in **1Password**, not git.

1. Accept your **1Password Teams** invite
2. Install the **1Password Cursor plugin** (Cursor Settings → Plugins)
3. Clone and enter the repo:

```bash
git clone https://github.com/adam-gols/scor-rotator.git
cd scor-rotator
```

4. Open **`docs/project-context.md` → Secrets** for the Environment name (`scor-rotator Development`)
5. **Mount** that Environment → `.env` — see [docs/joining-a-project.md](./docs/joining-a-project.md)
6. Verify and run:

```bash
pnpm install
./scripts/setup-env
./scripts/dev
```

Or ask Cursor Agent: *"I just cloned this repo — help me mount 1Password .env"*

## Prerequisites

- Node 22+, pnpm 9+
- 1Password Teams access (Mac/Linux for mounted `.env`)

## Commands

| Command | Description |
|---------|-------------|
| `./scripts/setup-env` | Verify 1Password `.env` mount |
| `./scripts/dev` | Start Electron + Vite dev |
| `./scripts/test` | Run Vitest |
| `./scripts/lint` | Brand check + ESLint + Prettier |
| `pnpm run electron:dist` | Build installers (dmg / nsis) |

## Environment variables

Documented in `.env.example` (fake values). Real values: **1Password Environment** → mounted `.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | yes | `development` / etc. |
| `AIRTABLE_TOKEN` | for Load Today | Airtable personal access token |
| `AIRTABLE_BASE_ID` | yes | Airtable base |
| `AIRTABLE_TABLE_ID` | yes | Streams table |
| `AIRTABLE_VIEW_ID` | yes | “Today” view |

Never commit real secrets.

## Project docs

- [Joining this project](./docs/joining-a-project.md) — first clone + 1Password mount
- [Setup guide](./docs/setup.md)
- [Project context](./docs/project-context.md)
- [Secrets policy](./docs/secrets.md)
- [Architecture](./docs/architecture.md)
- [Contributing](./CONTRIBUTING.md)
- [Agent instructions](./AGENTS.md)

## License

MIT

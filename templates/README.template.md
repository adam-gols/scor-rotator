# [PROJECT_NAME]

[One-line description of what this project does.]

## First-time setup (new teammate)

**Cloning this repo for the first time?** Secrets are in **1Password**, not git.

1. Accept your **1Password Teams** invite
2. Install the **1Password Cursor plugin** (Cursor Settings → Plugins)
3. Clone and enter the repo:

```bash
git clone [REPO_URL]
cd [PROJECT_NAME]
```

4. Open **`docs/project-context.md` → Secrets** for the Environment name
5. **Mount** that Environment → `.env` — see [docs/joining-a-project.md](./docs/joining-a-project.md)
6. Verify and run:

```bash
./scripts/setup-env
./scripts/dev
```

Or ask Cursor Agent: *"I just cloned this repo — help me mount 1Password .env"*

## Prerequisites

- [Runtime and tools — e.g. Node 22+, pnpm 9+]
- 1Password Teams access

## Commands

| Command | Description |
|---------|-------------|
| `./scripts/setup-env` | Verify 1Password `.env` mount |
| `./scripts/dev` | Start local development |
| `./scripts/test` | Run tests |
| `./scripts/lint` | Lint and format check |

## Environment variables

Documented in `.env.example` (fake values). Real values: **1Password Environment** → mounted `.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `[VAR]` | yes/no | [Purpose] |

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

[License name]

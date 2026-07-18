# SCOR Rotator

Rotates between live stream URLs — desktop app for Windows and Mac.

## Install (SCOR / GOLS)

No API keys. No 1Password. No terminal.

1. Open **[Releases](https://github.com/adam-gols/scor-rotator/releases)**
2. Download the latest **Mac `.dmg`** or **Windows `.exe`**
3. Install, launch, click **Load Today**

That’s it.

## Developers

For contributing or running from source:

1. Accept your **1Password Teams** invite
2. Clone the repo and mount Environment `scor-rotator Development` → `.env` — see [docs/joining-a-project.md](./docs/joining-a-project.md)
3. Run:

```bash
pnpm install
./scripts/setup-env
./scripts/dev
```

Optional: set `SCOR_STREAMS_API_URL` in `.env` to hit the same streams proxy packaged apps use (otherwise Load Today uses `AIRTABLE_TOKEN` from `.env` directly).

### Streams proxy (ops)

Packaged builds call a Cloudflare Worker that holds the Airtable token. Deploy once:

→ [workers/streams-api/README.md](./workers/streams-api/README.md)

Then set GitHub Actions variable `SCOR_STREAMS_API_URL` to the Worker URL.

### Publishing a release

```bash
git tag v0.1.1
git push origin v0.1.1
```

GitHub Actions builds Mac + Windows installers and attaches them to the release.

## Prerequisites (developers only)

- Node 22+, pnpm 9+
- 1Password Teams access (Mac/Linux for mounted `.env`)

## Commands

| Command | Description |
|---------|-------------|
| `./scripts/setup-env` | Verify 1Password `.env` mount |
| `./scripts/dev` | Start Electron + Vite dev |
| `./scripts/test` | Run Vitest |
| `./scripts/lint` | Brand check + ESLint + Prettier |
| `pnpm run electron:dist` | Build installers (dmg / nsis) into `release/` |

## Environment variables

Documented in `.env.example` (fake values). Real Airtable token for **local dev**: **1Password Environment** → mounted `.env`. Packaged apps do **not** need this.

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | yes (dev) | `development` / etc. |
| `AIRTABLE_TOKEN` | dev without proxy | Airtable personal access token |
| `AIRTABLE_BASE_ID` | optional | Airtable base (has default) |
| `AIRTABLE_TABLE_ID` | optional | Streams table (has default) |
| `AIRTABLE_VIEW_ID` | optional | “Today” view (has default) |
| `SCOR_STREAMS_API_URL` | release / optional dev | Public streams proxy base URL |

Never commit real secrets. Never put `AIRTABLE_TOKEN` in the desktop app or Release binaries.

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

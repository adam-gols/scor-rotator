# Setup

## Prerequisites

- Node 22+, pnpm 9+
- **1Password Teams** access
- **1Password for Mac or Linux** (mounted `.env`; Windows: [secrets.md](./secrets.md#windows-and-op-run-fallback))
- **1Password Cursor plugin** (Cursor Settings → Plugins)

## First-time setup

See [joining-a-project.md](./joining-a-project.md).

```bash
git clone https://github.com/adam-gols/scor-rotator.git
cd scor-rotator
pnpm install
```

## Mount 1Password Environment

Environment name: **`scor-rotator Development`** (see [project-context.md](./project-context.md) → Secrets).

### Steps (Mac / Linux)

1. Open **1Password** → **Environments** → `scor-rotator Development`
2. **Destinations** → **Local `.env` file**
3. **Choose file path:** absolute path to this repo’s `.env`
4. **Mount .env file**
5. Verify:

```bash
./scripts/setup-env
cat .env    # approve 1Password prompt — you should see variables
```

Do **not** copy `.env.example` to `.env` — that conflicts with the 1Password mount.

## Daily development

```bash
./scripts/dev      # Electron + Vite
./scripts/test
./scripts/lint
```

Renderer-only (no Electron / no Airtable IPC):

```bash
pnpm run dev:renderer
```

## Packaging

```bash
pnpm run electron:dist
```

Outputs platform installers into `release/` via electron-builder.

Operators should use [GitHub Releases](https://github.com/adam-gols/scor-rotator/releases) (no local build). Ops: deploy [workers/streams-api](../workers/streams-api/README.md), set Actions variable `SCOR_STREAMS_API_URL`, then tag `v*`.

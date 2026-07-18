# Setup

> Replace this file during bootstrap with real setup steps for your stack.

## Prerequisites

- `[Runtime — e.g. Node 22+, pnpm 9+]`
- **1Password Teams** access (invite from admin)
- **1Password for Mac or Linux** (for mounted `.env`; Windows: see [secrets.md](./secrets.md#windows-and-op-run-fallback))
- **1Password Cursor plugin** (Cursor Settings → Plugins)

## First-time setup (new teammate)

**Just cloned this repo?** Start with [joining-a-project.md](./joining-a-project.md) for the full checklist.

```bash
git clone [REPO_URL]
cd [PROJECT_NAME]
```

Then mount secrets **before** running the app (see next section).

## Mount 1Password Environment

This project's Environment name is in **`docs/project-context.md` → Secrets** (typically `[PROJECT_NAME] Development`).

### Steps (Mac / Linux)

1. Open **1Password** → **Environments** → Environment from `project-context.md`
2. **Destinations** → **Local `.env` file**
3. **Choose file path:** `[absolute-path-to-this-repo]/.env`
4. **Mount .env file**
5. Verify:

```bash
./scripts/setup-env
cat .env    # approve 1Password prompt — you should see variables
```

Do **not** copy `.env.example` to `.env` — that conflicts with the 1Password mount.

### After mount

```bash
./scripts/dev    # starts the app
./scripts/test   # runs tests
./scripts/lint   # lint check
```

## Environment variables

See `.env.example` for variable names and descriptions (fake values only). Real values live in the **1Password Environment**.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Scripts not executable | `chmod +x scripts/*` |
| Missing `.env` | [joining-a-project.md](./joining-a-project.md) — mount Environment first |
| Mount fails | Delete any existing plaintext `.env`; remount |
| Vite restarts in a loop | Ignore `.env` in `vite.config.ts` `server.watch.ignored` |
| Windows | [secrets.md → op run fallback](./secrets.md#windows-and-op-run-fallback) |

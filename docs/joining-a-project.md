# Joining an existing project

Use this when you **clone or pull an active GOLS repo for the first time** — not when creating a project from the template.

Secrets are **not in git**. You need **1Password Teams access** and a mounted `.env` before `./scripts/dev` will work.

---

## Quick checklist

1. [ ] Accept **1Password Teams** invite (ask your admin if missing)
2. [ ] Install **1Password** desktop app (Mac or Linux for mount; Windows uses `op run`)
3. [ ] Enable **Integrate with 1Password CLI** — 1Password → Settings → Developer
4. [ ] Install **1Password Cursor plugin** — Cursor Settings → Plugins
5. [ ] `git clone` the repo and `cd` into it
6. [ ] Read **`docs/project-context.md` → Secrets** for this project's Environment name
7. [ ] **Mount** the Environment → `.env` (steps below)
8. [ ] Run `./scripts/setup-env` then `./scripts/dev`

Full mount walkthrough: [Setup → Mount 1Password Environment](./setup.md#mount-1password-environment).

Agent script (if using Cursor): [1password-guided-setup.md → First clone](./1password-guided-setup.md#first-clone--teammate-agent-script).

---

## Before you clone

| Requirement | Why |
|-------------|-----|
| 1Password Teams invite accepted | Environment is shared through 1Password, not GitHub |
| GitHub repo access | Code and `.env.example` only — not secrets |
| Mac or Linux (recommended) | Locally mounted `.env` is beta on Mac/Linux only |
| Windows | Use [`op run` fallback](./secrets.md#windows-and-op-run-fallback) instead of mount |

---

## Mount 1Password Environment → `.env`

Find the Environment name in **`docs/project-context.md` → Secrets** (default pattern: `[project-slug] Development`).

### Mac / Linux

1. Open **1Password** → **Environments** → select the Environment from `project-context.md`
2. Open the **Destinations** tab
3. **Configure destination** → **Local `.env` file**
4. **Choose file path:** absolute path to this repo's `.env` (project root), e.g.:
   ```
   ~/Documents/my-app/.env
   ```
5. Click **Mount .env file**

**Important:** If a plaintext `.env` already exists, delete it first. A mount cannot replace a regular file at the same path.

### Verify

```bash
./scripts/setup-env
cat .env    # approve the 1Password authorization prompt
./scripts/dev
```

### Windows

Mounted `.env` is not supported. See [secrets.md → Windows and op run fallback](./secrets.md#windows-and-op-run-fallback).

---

## Using Cursor Agent on first open

Open the cloned repo in Cursor and send:

```text
I just cloned this repo. Help me set up 1Password and mount .env.
```

The agent follows [First clone agent script](./1password-guided-setup.md#first-clone--teammate-agent-script) in `1password-guided-setup.md`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No 1Password invite | Ask admin; wait before mounting |
| `setup-env` says no `.env` | Complete mount steps above |
| `cat .env` shows nothing / errors | Re-mount; check Environment is shared with you |
| Vite dev server restart loop | Add `.env` to `server.watch.ignored` — see [vite snippet](../templates/vite.config.env-mount.snippet.ts) |
| Missing a variable | Check `.env.example`; ask team lead to add it to the Environment |
| Wrong Environment name | Read `docs/project-context.md` → Secrets |

---

## Related docs

- [secrets.md](./secrets.md) — policy and team workflow
- [setup.md](./setup.md) — stack-specific setup after mount
- [CONTRIBUTING.md](../CONTRIBUTING.md) — git workflow after you're running locally

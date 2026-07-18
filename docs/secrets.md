# Team secrets (1Password)

GOLS uses **1Password Teams** and **1Password Environments (beta)** to share dev credentials. Real secrets **never go in git** — they live in 1Password and are read through a mounted `.env` or `op run`.

## Golden rules

| Do | Don't |
|----|-------|
| Store real values in a **1Password Environment** | Commit `.env` to GitHub |
| Document every variable in **`.env.example`** (fake values) | Paste API keys in Slack, email, or PRs |
| **Mount** the Environment to `.env` (Mac/Linux) or use `op run` (Windows) | Put secrets in README or `project-context.md` |
| Add new vars to `.env.example` **and** the Environment | Share the 1Password master password |
| Install the **1Password Cursor plugin** | Paste secrets into Agent chat |

`.env` is **gitignored**. When mounted, contents are **not stored on disk** — 1Password serves them on read. **1Password** is the shared source of truth.

---

## 1Password setup (org — once)

1. Subscribe to **1Password Teams Starter Pack** (up to 10 users — fits a 4-person team).
2. Create an admin account and invite teammates.
3. Use Environment naming: **`[project-slug] Development`** (one Environment per repo).

Optional: keep a vault **`GOLS Dev — [project-slug]`** for non-env credentials (logins, SSH keys, etc.).

---

## Per-project setup (after bootstrap)

### 1. Create an Environment

In 1Password → **Environments** → **New Environment**:

- **Name:** `[my-app] Development`
- **Variables:** match `.env.example` (start with `APP_ENV=development`)
- **Share** with teammates

Starter variable list: [templates/1password-environment.template](../templates/1password-environment.template)

### 2. Mount `.env` (Mac / Linux — recommended)

In the Environment → **Destinations** → **Local `.env` file**:

1. Choose path: `<project-root>/.env`
2. **Mount .env file**

Verify:

```bash
./scripts/setup-env
cat .env   # approve 1Password prompt
```

**Important:** Delete any existing plaintext `.env` before mounting. A mount cannot replace a regular file in place.

Docs: [Access secrets through local .env files](https://developer.1password.com/docs/environments/local-env-file)

### 3. Install the 1Password Cursor plugin

1. **Cursor Settings** → **Plugins** → search **1Password** → Install
2. Plugin repo: [1Password/cursor-plugin](https://github.com/1Password/cursor-plugin)

The plugin validates mounted `.env` files before the agent runs shell commands.

### 4. Record in the repo

Fill `docs/project-context.md` → **Secrets**:

| Field | Example |
|-------|---------|
| Team secrets source | `1Password Environment: my-app Development` |
| .env mount path | `.env` |
| Cursor plugin | 1Password (Cursor Marketplace) |
| Setup command | `./scripts/setup-env` |

---

## Windows and `op run` fallback

Locally mounted `.env` files are **Mac and Linux only** (beta). On Windows:

1. Install [1Password CLI](https://developer.1password.com/docs/cli/) (`op`)
2. Store variables in the same **Environment** (or use `op://` secret references)
3. Run dev through `op`:

```bash
op signin
op run --env-file=.env.op -- ./scripts/dev
```

Use `.env.op` with `op://` references (safe to commit) — see [secret references](https://developer.1password.com/docs/cli/secret-reference/).

For most Mac/Linux workflows, **mounting beats copy/paste** — no manual sync.

---

## New teammate workflow

**Full guide:** [joining-a-project.md](./joining-a-project.md)

```bash
git clone git@github.com:your-org/your-project.git
cd your-project
```

Then:

1. Accept 1Password invite (before or right after clone)
2. Install **1Password Cursor plugin** in Cursor
3. Enable **Integrate with 1Password CLI** (1Password → Settings → Developer)
4. Read **`docs/project-context.md` → Secrets** for the Environment name
5. Mount that Environment → `.env` ([mount steps](./joining-a-project.md#mount-1password-environment--env))
6. Run `./scripts/setup-env` then `./scripts/dev`

In Cursor Agent: *"I just cloned this repo — help me mount 1Password .env"*

---

## Adding a new environment variable

Use the **[per-secret protocol](./1password-guided-setup.md#per-secret-protocol-bootstrap--ongoing)** — guide the user step by step; wait for `done`.

1. Add to `.env.example` with a **fake** value and comment.
2. Walk user through adding the variable to the **1Password Environment** (never in chat).
3. Mounted `.env` picks up the value on next read — no copy step.
4. Notify team when appropriate.

---

## What goes where

| Location | Contents | In git? |
|----------|----------|---------|
| `.env.example` | Variable names, fake values, docs | Yes |
| `.env` (mounted) | Real secrets served by 1Password on read | **No** |
| **1Password Environment** | Real dev credentials | **No** |
| `.env.op` (optional) | `op://` references for `op run` | Yes (references only) |
| GitHub Actions secrets | CI-only values | No (GitHub settings) |
| Production host | Prod secrets (Vercel, AWS, etc.) | No |

---

## Per environment

| Environment | Where secrets live |
|-------------|-------------------|
| **Local dev** | 1Password Environment → mounted `.env` or `op run` |
| **CI** | GitHub → Settings → Secrets and variables → Actions |
| **Production** | Hosting provider — not in dev Environment unless you choose to |

Never put production secrets in the dev Environment without a clear naming split (e.g. separate `[slug] Production` Environment).

---

## For AI agents

1. Read this file and [1password-guided-setup.md](./1password-guided-setup.md) before adding env vars.
2. **Onboarding Batch 8:** Environment + Cursor plugin + CLI integration (mount in Phase 5b).
3. **Each new variable:** use the [per-secret protocol](./1password-guided-setup.md#per-secret-protocol-bootstrap--ongoing); wait for `done`.
4. Update `.env.example` only — **never** write real secrets to committed files.
5. Run `./scripts/setup-env` to verify mount after clone or when `.env` is missing.
6. **First clone / teammate:** [joining-a-project.md](./joining-a-project.md) + [First clone agent script](./1password-guided-setup.md#first-clone--teammate-agent-script).
7. **Never** run shell commands that would echo secret values; **never** accept secrets in chat.

---

## Checklist

- [ ] Teammates invited to 1Password Teams
- [ ] Environment `[project-slug] Development` created and shared
- [ ] 1Password Cursor plugin installed
- [ ] `.env` mounted (or `op run` configured on Windows)
- [ ] `docs/project-context.md` → Secrets filled in
- [ ] `.env.example` matches Environment variables (fake values only)
- [ ] Each dev ran `./scripts/setup-env` successfully
- [ ] GitHub Actions secrets set when CI exists

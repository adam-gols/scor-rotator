# 1Password guided setup

Agents: use **Batch 8** during onboarding, **Phase 5b** to mount `.env`, and the **per-secret protocol** whenever you add environment variables.

See also [secrets.md](./secrets.md).

**Platform note:** Locally mounted `.env` files require **1Password for Mac or Linux** (beta). Windows teammates use the [`op run` fallback](./secrets.md#windows-and-op-run-fallback) in `secrets.md`.

---

## Batch 8 — 1Password (onboarding interview)

Run **after Batch 7 (git)** and **before Batch 9 (confirm)**. Do not combine with other batches.

Use the project **slug** from Batch 1 for all names.

### Step 1 — Access check

Use **AskQuestion**:

| Option | Action |
|--------|--------|
| Yes, I have 1Password Teams | Continue to Step 2 |
| Not yet — I need an invite | Tell user to ask admin for invite; **wait** until they confirm access |
| I don't know | Link to [1Password downloads](https://1password.com/downloads); explain GOLS uses Teams Starter Pack |

Do not continue until they have access.

### Step 2 — Platform check

Use **AskQuestion**:

| Option | Action |
|--------|--------|
| Mac or Linux | Continue — we'll use a mounted `.env` (recommended) |
| Windows | Explain mounted `.env` is Mac/Linux only; they'll use `op run` (see [secrets.md](./secrets.md#windows-and-op-run-fallback)) |

### Step 3 — Enable CLI integration

In the **1Password desktop app**:

1. Open **Settings** → **Developer**
2. Turn on **Integrate with 1Password CLI (Beta)**

This is required for mounted `.env` files and for `op run`.

### Step 4 — Install the 1Password Cursor plugin

Guide them:

1. Open **Cursor Settings** → **Plugins**
2. Search **1Password**
3. Install the official [1Password plugin for Cursor](https://github.com/1Password/cursor-plugin)

The plugin validates that your project's `.env` comes from a 1Password Environment mount before the agent runs shell commands. It **fail-opens** if 1Password isn't set up yet (safe during early onboarding).

### Step 5 — Explain what we're creating

Tell the user (plain language):

```md
We'll store dev secrets in a **1Password Environment**, not in GitHub.

You'll create:
- **Environment:** `[slug] Development` (e.g. `contractor-app Development`)

After bootstrap, we'll **mount** that Environment to your project's `.env` file.
Real values never sit on disk in plaintext — 1Password serves them when your app reads `.env`.

During bootstrap, each time we add an API key or env var, I'll walk you through adding it to the Environment — one at a time. Never paste secrets in chat.
```

### Step 6 — Create the Environment (user actions in 1Password app)

Guide them click-by-click:

1. Open the **1Password** app (desktop)
2. Go to **Environments** (sidebar or Developer section)
3. **New Environment** → name: **`[slug] Development`** (example: `contractor-app Development`)
4. Add starter variable **`APP_ENV`** = `development` (see [templates/1password-environment.template](../templates/1password-environment.template))
5. **Share** the Environment with teammates who need access
6. **Save**

Ask: *"Environment created and shared?"* — wait for yes.

**Do not mount `.env` yet** — the project folder doesn't exist until after `./scripts/create-project`.

### Step 7 — Record in project files

Write to `docs/project-context.md` → **Secrets** (draft until repo exists; write after create-project):

| Field | Value |
|-------|-------|
| Team secrets source | `1Password Environment: [slug] Development` |
| .env mount path | `.env` (project root — mount in Phase 5b) |
| Cursor plugin | 1Password (Cursor Marketplace) |
| 1Password setup complete | partial (Environment created; mount after bootstrap) |

### Step 8 — Confirm before Batch 9

Ask: *"Environment ready? We'll mount `.env` after the project is created."*

---

## Phase 5b — Mount `.env` (after create-project)

Run in `~/Documents/<slug>` once the repo exists — typically **after Phase 5**, unless an earlier phase needs secrets to run (then mount right after Phase 1 using the same steps).

### Prerequisites

- No plaintext `.env` at the mount path. If `./scripts/setup-env` or a manual copy created one, **delete it first** — a mounted file cannot coexist with a regular file at the same path.
- `.env` must stay in `.gitignore` (bootstrap Phase 1 handles this).

### Mount steps (guide the user)

1. Open **1Password** → **Environments** → **`[slug] Development`**
2. Open the **Destinations** tab
3. **Configure destination** → **Local `.env` file**
4. **Choose file path:** absolute path to `~/Documents/<slug>/.env`
5. Click **Mount .env file**
6. Run `./scripts/setup-env` in the project directory to verify
7. Test: `cat .env` — approve the 1Password authorization prompt; you should see your variables

### Vite / hot-reload projects

Mounted `.env` files can trigger infinite dev-server restarts in Vite. Add to `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.env'],
    },
  },
})
```

See [1Password docs](https://developer.1password.com/docs/environments/local-env-file) for other toolchain notes.

---

## Per-secret protocol (bootstrap + ongoing)

Whenever you add a variable to `.env.example` (or the user needs a new secret):

**Do not paste real values in chat.** Guide the user through 1Password instead.

### Message template (copy and fill in)

```md
## Add `[VAR_NAME]` to 1Password Environment

**What it's for:** [one line — e.g. Stripe API key for payments]

**Steps:**
1. Open **1Password** → **Environments** → **`[slug] Development`**
2. Click **Add variable** (or edit the Environment)
3. Name: `VAR_NAME`
4. Value: paste your **real** value (get it from [where — e.g. Stripe dashboard → Developers → API keys])
5. **Save** the Environment

If `.env` is mounted, the value is available the next time your app reads `.env` (you may see a brief 1Password authorize prompt).

Reply **done** when saved in 1Password. Do **not** paste the secret value in this chat.
```

### Wait rule

- If the next bootstrap step **requires** this secret to run (e.g. API call, DB connect), **wait** for user to reply `done` before continuing.
- If optional for bare bones, note it as optional and continue; remind them before `./scripts/dev`.

### After each secret

Update `docs/project-context.md` environment variables table (name + purpose only, not values).

Notify team pattern (optional after bootstrap):

> New env var `[VAR_NAME]` added to 1Password Environment `[slug] Development` — remount or re-read `.env` if needed.

---

## Post-bootstrap checklist (agent)

After phases 1–5, before saying bootstrap is complete:

1. Complete **Phase 5b mount** (if Mac/Linux and not yet mounted)
2. Run `./scripts/setup-env` in the project directory
3. For **each** variable in `.env.example`:
   - Run the **per-secret protocol** if not already done during bootstrap
4. Confirm with user:

```md
## 1Password checklist

- [ ] 1Password Cursor plugin installed
- [ ] Environment `[slug] Development` exists and is shared
- [ ] `.env` mounted from Environment (or `op run` fallback on Windows)
- [ ] All variables from `.env.example` exist in the Environment
- [ ] `./scripts/setup-env` reports OK
- [ ] No secrets committed to git
```

5. Record `1Password setup complete: yes` in `docs/project-context.md`

---

## Teammate joining later

Skip Batch 8 Environment creation — it already exists. Point humans to [joining-a-project.md](./joining-a-project.md).

---

## First clone / teammate (agent script)

**Trigger:** User cloned an active repo; says "first time", "just cloned", "help me set up", or `.env` is missing; `docs/project-context.md` exists without placeholders.

**Do not** run Batch 8 (Environment already exists). **Do not** accept secret values in chat.

### Step 1 — Read project context

Open `docs/project-context.md` → **Secrets**. Note:

- Environment name (e.g. `my-app Development`)
- `.env` mount path (usually `.env`)

If Secrets section is missing, ask user to contact project lead.

### Step 2 — Access check

Use **AskQuestion**:

| Option | Action |
|--------|--------|
| Yes, I have 1Password Teams | Continue |
| Not yet — need invite | Wait until they confirm access |
| I don't know | Link to 1Password downloads; explain team uses Teams |

### Step 3 — Platform + plugin

- **Mac/Linux:** mount `.env` (recommended)
- **Windows:** point to [secrets.md → op run fallback](./secrets.md#windows-and-op-run-fallback)

Ensure:

1. **Integrate with 1Password CLI** enabled (1Password → Settings → Developer)
2. **1Password Cursor plugin** installed (Cursor Settings → Plugins)

### Step 4 — Mount `.env`

Follow [Phase 5b — Mount `.env`](#phase-5b--mount-env-after-create-project) using the **Environment name from project-context.md** and the **absolute path** to this repo's `.env`.

If plaintext `.env` exists, tell user to delete it first.

Wait for confirmation that mount is done.

### Step 5 — Verify

Tell user to run:

```bash
./scripts/setup-env
cat .env
```

Wait for `./scripts/setup-env` OK and successful `cat .env` (authorize prompt).

### Step 6 — Run the app

```bash
./scripts/dev
```

If a required variable is missing, use the [per-secret protocol](#per-secret-protocol-bootstrap--ongoing) — user adds it in the Environment (not in chat).

### Human doc

Always link [joining-a-project.md](./joining-a-project.md) for their reference.


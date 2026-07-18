# Onboarding Interview

Agents: use this when the user starts a new project from this template. **Do not ask them to read other docs first.** You ask questions; you write the answers; you create their GitHub repo and clone it to `~/Documents/<slug>`.

## When to run

Run onboarding when **any** of these are true:

- User opens Agent chat in an unfilled template (see `.cursor/hooks/onboarding-session-start.sh`)
- User sends any first message (including "hi", "start", or empty follow-up)
- `docs/project-context.md` is missing
- `docs/bootstrap-spec.md` or `docs/project-context.md` contains `[PLACEHOLDER]` or `[PROJECT_NAME]`

**First response rule:** When onboarding is active, your **first reply** must greet the user and start Batch 1 immediately — use AskQuestion. Do not wait for them to paste [PROMPT.md](../PROMPT.md).

Do **not** scaffold until onboarding is complete and the user confirms the summary.

## Fixed defaults (never ask)

| Decision | Rule |
|----------|------|
| Primary language | **You choose** in Batch 6 — see [repo-setup.md](./repo-setup.md#primary-language) |
| GitHub repository | **Always yes** — every project gets a GitHub repo |
| Local project path | **Always** `~/Documents/<project-slug>` — created via `git clone` of that repo |
| Brand kit | **Always GOLS org kit** — `brand/` copied automatically; do not ask |
| Git workflow | **Feature branches + PR to `main`** — see [git-workflow.md](./git-workflow.md); do not ask |
| Secrets | **1Password Environment** + mounted `.env` — guided in Batch 8; see [1password-guided-setup.md](./1password-guided-setup.md) |

## How to interview

1. **Brief intro** (2 sentences): a few questions, then you create their GitHub repo, clone it to Documents, and build the app when they approve.
2. **One batch at a time** — finish each batch before starting the next. Write files after each batch.
3. **Product questions (Batches 2–5) are separate** — do not combine problem, users, workflows, or out-of-scope into one batch.
4. Use AskQuestion for finite choices (project type, primary users, etc.).
5. End with **Batch 9 confirmation**; only proceed after explicit approval.

## Question script

### Batch 1 — Identity

| Question | Writes to |
|----------|-----------|
| Project name (display)? | `project-context`, README later |
| Project slug (GitHub repo name + folder under Documents, e.g. `my-app`)? | repo-setup, `create-project` |
| One-line description? | `project-context` |
| Project type? (web-app / api / cli / monorepo / library) | `bootstrap-spec` |
| GitHub visibility? (private default / public) | `project-context` Repository |

**Do not ask:** primary language, GitHub yes/no, local folder location.

Slug rules: lowercase, hyphens, no spaces. Suggest slug from project name if user doesn't specify.

### Batch 2 — Problem

Ask **only** this question in this batch:

| Question | Writes to |
|----------|-----------|
| What problem does this project solve? | `project-context` → Problem |

Do not ask about users, workflows, or scope in this batch.

### Batch 3 — Primary users

Ask **only** this question in this batch:

| Question | Writes to |
|----------|-----------|
| Who are the primary users? | `project-context` → Primary users |

**Use AskQuestion (allow multiple):**

| Option |
|--------|
| SCOR |
| On-Site Streamers |
| CEO |
| Marketing |
| Operations |

Do not ask an open-ended “who uses it?” question. Do not ask about workflows or scope in this batch.

### Batch 4 — Workflows

Ask **only** this question in this batch:

| Question | Writes to |
|----------|-----------|
| What are the top 1–3 workflows? (What do users do?) | `project-context` → Core workflows |

Do not ask about problem, users, or scope in this batch.

### Batch 5 — Out of scope

Ask **only** this question in this batch:

| Question | Writes to |
|----------|-----------|
| What is explicitly out of scope for v1? | `project-context` → Out of scope |

Do not ask about problem, users, or workflows in this batch.

### Batch 6 — Stack and language

**You choose primary language** — do not ask. Pick based on project type, problem, and workflows; record in `bootstrap-spec` and `project-context` with brief reasoning.

Ask only stack choices you cannot infer. Mark `[x]` in `bootstrap-spec.md`.

| Area | Default if unsure |
|------|-------------------|
| Language | TypeScript for web-app/api; Python for data-heavy api; Go for systems cli |
| Frontend | web-app → Vite + React; api/cli → none |
| Backend | web-app → Node Fastify or Next.js; api → FastAPI or Fastify |
| Database | none unless persistence needed |
| Auth | none for bare bones |
| Package manager | TS → pnpm; Python → pip |
| Test runner | Vitest / pytest / go test — match language |

Explain language choice in one sentence in the Batch 9 summary.

### Batch 7 — Git workflow (explain only)

Do **not** ask the user to choose a workflow. Explain in plain language:

1. **`main`** is for reviewed, working code — not for everyday edits.
2. Create a **branch** for each feature or fix (`feature/...`, `fix/...`).
3. **Commit** on your branch; run tests before pushing.
4. **Push your branch** and open a **pull request** to merge into `main`.
5. The **only** direct push to `main` is the agent's one-time bootstrap commit after this onboarding.

Point them to [CONTRIBUTING.md](../CONTRIBUTING.md) and [git-workflow.md](./git-workflow.md). Ask: *"Does that workflow make sense?"* — wait for acknowledgment before Batch 8.

Do not mention 1Password in this batch.

### Batch 8 — 1Password (guided setup)

Follow **[1password-guided-setup.md](./1password-guided-setup.md)** step by step.

Summary:

1. **AskQuestion:** Do they have 1Password Teams access? Wait if not.
2. **AskQuestion:** Mac/Linux (mount `.env`) or Windows (`op run` fallback)?
3. Enable **Integrate with 1Password CLI** (1Password → Settings → Developer)
4. Install **1Password Cursor plugin** (Cursor Settings → Plugins)
5. Explain Environment **`[slug] Development`** — secrets mount to `.env` after bootstrap
6. Walk them through **creating the Environment** (starter vars from [templates/1password-environment.template](../templates/1password-environment.template))
7. Explain: *"When we add each secret during bootstrap, I'll guide you through adding it to the Environment — never paste secrets in chat. We'll mount `.env` once the project folder exists."*
8. Ask: *"Environment ready?"* before Batch 9

Do not mount `.env` during Batch 8 — the project repo doesn't exist yet.

Do not combine with git or project summary.

### Batch 9 — Confirm

```md
## Project summary

**Name:** ...
**Slug:** ...
**GitHub:** always — private/public
**Local path:** ~/Documents/<slug> (clone of that repo)

**Type:** ...
**Problem:** ...
**Primary users:** SCOR, Marketing (etc.)
**Workflows:** ...
**Out of scope:** ...
**Language:** ... (AI-chosen — brief reason)
**Brand:** GOLS org kit (`brand/guidelines.md`, `brand/logos/`)
**Git:** feature branches → PR to `main` (see CONTRIBUTING.md)
**1Password:** Environment `<slug> Development` ✓ created (`.env` mount after bootstrap)
**Stack:** ...

I will:
1. Run ./scripts/create-project <slug> → GitHub repo + clone to ~/Documents/<slug>
2. Write docs/bootstrap-spec.md and docs/project-context.md there
3. Bootstrap the bare-bones app (phases 2–5)
4. Mount `.env` from 1Password Environment (Phase 5b)
5. Guide you through each env var → Environment (per-secret protocol)
6. Commit and push to GitHub

Ready to proceed?
```

Wait for approval.

## After user confirms

Follow [repo-setup.md](./repo-setup.md):

1. `./scripts/create-project <slug> [--public|--private]` (skip if already cloned in Documents with origin)
2. **Write** filled context files in `~/Documents/<slug>` (include Secrets section from Batch 8)
3. **Bootstrap** phases 2–5 in that directory
4. **Phase 5b:** mount Environment → `.env` in `~/Documents/<slug>` ([guide](./1password-guided-setup.md#phase-5b--mount-env-after-create-project))
5. **For each env var** in `.env.example`: use [per-secret protocol](./1password-guided-setup.md#per-secret-protocol-bootstrap--ongoing) — wait for **done** when required
6. Run `./scripts/setup-env` to verify mount
7. Complete [post-bootstrap 1Password checklist](./1password-guided-setup.md#post-bootstrap-checklist-agent)
8. `./scripts/init-repo --commit-only -m "Initial project scaffold"`
9. `git push -u origin main`
10. Tell user to open **`~/Documents/<slug>`** in Cursor

## Quick start shortcut

If user wants defaults: slug from name, AI picks TypeScript + Vite + React, no backend/DB/auth, private GitHub repo, `~/Documents/<slug>`. Still complete Batch 8 (1Password Environment + Cursor plugin). Confirm once, then execute.

## Tone

- Plain language. No "read GETTING_STARTED".
- Do not scaffold mid-interview.
- Do not ask about language, GitHub, or folder path.
- Do not combine Batches 2–5 — each gets its own turn.
- Never ask users to paste secret values in chat — always 1Password steps.

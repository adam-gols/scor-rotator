# Project Bootstrap Spec

Fill this in **before** scaffolding. Agents and humans use this as the source of truth for stack choices and creation order.

## Identity

| Field | Value |
|-------|-------|
| Project name | `[PROJECT_NAME]` |
| Project type | `[ ] web-app` `[ ] api` `[ ] cli` `[ ] mobile` `[ ] monorepo` `[ ] library` |
| Primary language | `[AI-selected — TypeScript / Python / Go / etc.]` |
| Language rationale | `[One line — why this language fits]` |
| License | `[MIT / Apache-2.0 / proprietary / other]` |

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

## Stack choices

Pick **one per row** (mark with `[x]`). Delete unused rows in a copy if helpful.

### Frontend (skip if none)

- [ ] None
- [ ] Next.js (App Router)
- [ ] Vite + React
- [ ] Vite + Vue
- [ ] Other: `___`

### Backend (skip if none)

- [ ] None (static / frontend-only)
- [ ] Node — Fastify
- [ ] Node — Express
- [ ] Python — FastAPI
- [ ] Python — Django
- [ ] Go — stdlib / chi
- [ ] Other: `___`

### Data (skip if none)

- [ ] None
- [ ] PostgreSQL
- [ ] SQLite
- [ ] MongoDB
- [ ] ORM/query layer: `[Prisma / Drizzle / SQLAlchemy / none]`

### Auth (skip if none)

- [ ] None for now
- [ ] Clerk
- [ ] Auth0
- [ ] Custom JWT/session
- [ ] Other: `___`

### Testing

| Layer | Choice |
|-------|--------|
| Unit/integration | `[Vitest / Jest / pytest / go test / other]` |
| E2E (optional) | `[Playwright / Cypress / none]` |

### Tooling

| Tool | Choice |
|------|--------|
| Package manager | `[pnpm / npm / yarn / pip / poetry / go mod]` |
| Lint | `[ESLint / Ruff / golangci-lint / none]` |
| Format | `[Prettier / Black / gofmt / none]` |

## Non-negotiables

Edit as needed. Agents must follow these during bootstrap:

- Use the stack choices above; do not substitute frameworks without user approval.
- Document every new env var in `.env.example`.
- `./scripts/dev`, `./scripts/test`, and `./scripts/lint` must be executable and documented in README.
- Include at least one automated smoke test that passes.
- Do not commit secrets or real credentials.
- Prefer minimal dependencies; justify each addition in `docs/project-context.md` or an ADR.

## Target folder layout

Adapt paths to stack. Minimum after bootstrap:

```txt
/
├─ README.md
├─ AGENTS.md
├─ .env.example
├─ .gitignore
├─ brand/
│  ├─ guidelines.md
│  ├─ tokens.json
│  └─ logos/
├─ docs/
│  ├─ project-context.md      ← filled from template
│  ├─ architecture.md
│  ├─ setup.md
│  ├─ conventions.md
│  └─ decisions/
│     └─ 0001-initial-stack.md
├─ scripts/
│  ├─ dev
│  ├─ test
│  └─ lint
├─ [source]/                  ← e.g. src/, app/, backend/
└─ [tests]/                   ← or co-located *.test.*
```

## Scaffold order

Execute **in sequence**. Complete each phase before the next.

### Phase 0 — Repository (after onboarding approval)

- [ ] Run `./scripts/create-project <slug> [--public|--private]` → GitHub repo + clone at `~/Documents/<slug>`
- [ ] Skip if user already cloned their repo into Documents (has `origin` remote)
- [ ] Record paths in `docs/project-context.md` Repository section
- [ ] See [repo-setup.md](./repo-setup.md)

### Phase 1 — Repository shell

- [ ] Update `README.md` from [templates/README.template.md](../templates/README.template.md)
- [ ] Ensure `.gitignore` matches language/stack (must include `.env`)
- [ ] Create `.env.example` from [templates/env.example.template](../templates/env.example.template)
- [ ] Copy `docs/project-context.template.md` → `docs/project-context.md` and fill placeholders
- [ ] Document 1Password Environment in `project-context.md` → Secrets ([secrets.md](./secrets.md))

### Phase 2 — Tooling

- [ ] Initialize package manager / dependency files for chosen stack
- [ ] Configure lint and format per tooling table
- [ ] Replace [scripts/](../scripts/) placeholders with real commands (keep `./scripts/validate-brand` in lint)
- [ ] Document all commands in `docs/setup.md`

### Phase 2b — Brand (when project has a frontend)

- [ ] Confirm `brand/` kit present (`./scripts/validate-brand`)
- [ ] Copy [templates/brand.css.template](../templates/brand.css.template) → app styles; import in entry
- [ ] Copy [templates/Logo.tsx.template](../templates/Logo.tsx.template) → `Logo` component; use in header
- [ ] Load Google Fonts from `brand/tokens.json`
- [ ] Follow [.cursor/rules/006-brand.mdc](../.cursor/rules/006-brand.mdc)

Skip Phase 2b for api/cli-only projects with no UI.

### Phase 3 — Minimal application

- [ ] Create smallest runnable app (one page, one route, or one CLI command)
- [ ] Add health/readiness check if applicable (`/health`, `--version`, etc.)
- [ ] Wire env vars through config, not hardcoded values
- [ ] **Each new env var:** add to `.env.example` (fake value) + [per-secret 1Password guide](./1password-guided-setup.md#per-secret-protocol-bootstrap--ongoing); wait for user `done` if required to run

### Phase 4 — Quality gate

- [ ] Add smoke test; `./scripts/test` passes
- [ ] `./scripts/lint` passes (or documents why skipped)
- [ ] README setup steps verified on clean clone assumptions

### Phase 5 — Documentation

- [ ] Update `docs/architecture.md` with actual structure
- [ ] Add ADR [0001-initial-stack.md](./decisions/0001-initial-stack.md) from [templates/adr.template.md](../templates/adr.template.md) if stack choices need rationale
- [ ] Update [.cursor/rules/004-project-specific.mdc](../.cursor/rules/004-project-specific.mdc) with stack-specific rules
- [ ] Ensure [CONTRIBUTING.md](../CONTRIBUTING.md), [joining-a-project.md](./joining-a-project.md), and [git-workflow.md](./git-workflow.md) are linked from README
- [ ] Recommend enabling **branch protection** on `main` (see git-workflow.md)

### Phase 5b — 1Password mount and verification

- [ ] Guide user to **mount** Environment `[slug] Development` → `.env` ([Phase 5b guide](./1password-guided-setup.md#phase-5b--mount-env-after-create-project))
- [ ] Run `./scripts/setup-env`; user verifies with `cat .env` (1Password authorize prompt)
- [ ] For Vite projects: add `.env` to `server.watch.ignored` in `vite.config.ts`
- [ ] Complete [post-bootstrap checklist](./1password-guided-setup.md#post-bootstrap-checklist-agent)
- [ ] Set `1Password setup complete: yes` in `docs/project-context.md`

## Definition of done (bare bones)

Bootstrap is complete when **all** are true:

- [ ] `./scripts/dev` starts the app (or documents blocking env vars clearly)
- [ ] `./scripts/test` exits 0
- [ ] `./scripts/lint` exits 0 or is intentionally N/A with explanation in setup.md
- [ ] `./scripts/validate-brand` passes (GOLS brand kit complete)
- [ ] README contains first-clone setup (mount 1Password → `./scripts/dev`) via [README.template.md](../templates/README.template.md)
- [ ] `.env.example` lists every required variable with descriptions
- [ ] `docs/project-context.md` has no unfilled `[PLACEHOLDER]` tokens
- [ ] Git repo exists with scaffold committed
- [ ] No secrets in the repository (real values in 1Password only)

## Out of scope for bare bones

Do not build unless explicitly requested after definition of done:

- CI/CD pipelines (beyond optional `.github/` stubs)
- Production deployment configs
- Full auth flows (stub only if auth = none)
- Admin panels, analytics, i18n
- Comprehensive test suites beyond smoke + one example

## Agent prompts

**New project (interview first)** — see [PROMPT.md](../PROMPT.md).

**Bootstrap only** (after context is filled):

```text
Read AGENTS.md, docs/bootstrap-spec.md, and docs/project-context.md.
Bootstrap this project following scaffold phases 1–5 in order.
Use templates/ for starter file content.
Stop when Definition of done is satisfied.
```

# Agent Instructions

Entry point for AI coding agents working in this repository.

## Read order

1. **Unfilled template:** [docs/onboarding-interview.md](./docs/onboarding-interview.md) + [docs/repo-setup.md](./docs/repo-setup.md)
2. **UI / visual work:** [brand/guidelines.md](./brand/guidelines.md) + [brand/tokens.json](./brand/tokens.json)
3. **Git operations:** [docs/git-workflow.md](./docs/git-workflow.md) + [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Env vars / secrets:** [docs/1password-guided-setup.md](./docs/1password-guided-setup.md) — Batch 8 + per-secret guide; [joining-a-project.md](./docs/joining-a-project.md) for first clone
5. **Context filled, not bootstrapped:** [docs/bootstrap-spec.md](./docs/bootstrap-spec.md) → [docs/project-context.md](./docs/project-context.md)
6. **Existing code:** [docs/project-context.md](./docs/project-context.md) → [docs/conventions.md](./docs/conventions.md) → [docs/setup.md](./docs/setup.md)
7. **Architecture:** [docs/architecture.md](./docs/architecture.md) and [docs/decisions/](./docs/decisions/)

Follow [.cursor/rules/](./.cursor/rules/). `sessionStart` hook injects onboarding context when placeholders remain.

## Modes

### Onboarding mode (default for new template copies)

**Trigger:** Unfilled placeholders; `sessionStart` hook; user's first Agent message.

**Do:**

1. Follow [docs/onboarding-interview.md](./docs/onboarding-interview.md) — **start Batch 1 immediately** (AskQuestion).
2. Collect repo preferences (slug, visibility only — GitHub and `~/Documents/<slug>` are automatic).
3. **Choose primary language in Batch 6** — do not ask the user.
4. **Batch 8:** guide 1Password Environment + Cursor plugin before confirm ([1password-guided-setup.md](./docs/1password-guided-setup.md)); mount `.env` in Phase 5b.
5. Write answers into `docs/bootstrap-spec.md` and `docs/project-context.md`.
6. Show Batch 9 summary; **wait for approval**.
7. Run `./scripts/create-project <slug>` → bootstrap; **per-secret 1Password guide** for each env var.
8. Commit and push initial scaffold only after 1Password checklist complete.

**Do not:** Ask primary language, GitHub yes/no, or folder location. **Never** accept secret values in chat — guide 1Password steps only.

### Bootstrap mode

**Trigger:** Onboarding approved; context filled.

**Do:**

1. Read `docs/bootstrap-spec.md` — phases 0–5 in order.
2. Execute scaffold; use [templates/](./templates/).
3. Commit with `./scripts/init-repo --commit-only`.
4. Stop at **Definition of done**.

### Brownfield mode

**Trigger:** Repo already has application code (or user cloned an active project).

**Do:**

1. Read code first; smallest safe diff. See [conventions](./docs/conventions.md#repo-understanding-brownfield).
2. **First clone / missing `.env`:** follow [First clone agent script](./docs/1password-guided-setup.md#first-clone--teammate-agent-script). Read Environment name from `docs/project-context.md` → Secrets. Link [joining-a-project.md](./docs/joining-a-project.md).
3. Never accept secret values in chat — guide 1Password mount and Environment edits only.

## Non-negotiables

- No secrets in git; use `.env.example`
- No new dependencies without justification
- No push without user approval
- Update docs when setup, env vars, APIs, or architecture change

## Workflows

| Task | Steps |
|------|--------|
| New project | Onboard → create repo → bootstrap → commit |
| First clone / teammate | [joining-a-project.md](./docs/joining-a-project.md) → mount `.env` → `./scripts/dev` |
| Bug fix | Reproduce → fix → regression test |
| Feature | Nearest pattern → vertical slice → tests |

## Human handoff

User should open their **project folder** (not master Template if a new folder was created). Leave working `./scripts/dev` and `./scripts/test`.

# Contributing

## Git workflow (read this first)

**Do not commit features directly to `main`.**

1. `git checkout main && git pull`
2. `git checkout -b feature/your-change`
3. Make changes, commit, run `./scripts/test`
4. `git push -u origin feature/your-change`
5. Open a pull request → merge to `main` after review

Full guide: [docs/git-workflow.md](docs/git-workflow.md)

## Secrets (1Password)

Real API keys **never go in git**.

**First time on this repo?** Read [docs/joining-a-project.md](docs/joining-a-project.md) — mount Environment → `.env` before `./scripts/dev`.

1. Accept 1Password Teams invite; install **1Password Cursor plugin**
2. Mount **1Password Environment** → `.env` (name in `docs/project-context.md` → Secrets)
3. Run `./scripts/setup-env` to verify mount

Policy: [docs/secrets.md](docs/secrets.md)

## Commits

- Imperative, specific messages: `Add health check endpoint`
- Not: `Updates`, `WIP`, `fix stuff`

## Before opening a PR

- [ ] `./scripts/test` passes
- [ ] `./scripts/lint` passes
- [ ] No secrets in the diff
- [ ] PR description explains what, why, and how to test

## AI-assisted work

Agents follow [docs/git-workflow.md](docs/git-workflow.md) and [.cursor/rules/007-git-workflow.mdc](.cursor/rules/007-git-workflow.mdc). They should create a branch before making changes (except the one-time bootstrap push to `main`).

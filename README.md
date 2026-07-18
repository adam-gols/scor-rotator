# Project Template

Give this folder to anyone starting a new project. They open it in Cursor, start Agent chat, and the AI handles the rest.

## Quick start (recipients)

1. **Get the template** — copy this folder, or use GitHub **Use this template** (see [Publishing](#publishing-as-a-github-template) below).
2. **Open the folder in Cursor.**
3. **Open Agent chat** (Cmd+I / Ctrl+I) and send any message — e.g. `start`.

The agent will:

- Interview you in short batches (project name, stack, users)
- **Choose the best programming language** for you (not asked)
- **Always create a GitHub repo** and clone it to **`~/Documents/<your-project>`**
- Bootstrap a bare-bones app with tests and scripts

**Required:** [GitHub CLI](https://cli.github.com/) — run `gh auth login` before starting.

**Manual path:** [GETTING_STARTED.md](./GETTING_STARTED.md)

## What's included

| Path | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI entry point |
| [docs/onboarding-interview.md](./docs/onboarding-interview.md) | Interview script |
| [docs/repo-setup.md](./docs/repo-setup.md) | Git + GitHub creation steps |
| [brand/](./brand/) | GOLS guidelines, tokens, logos (auto-applied) |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Branch + PR workflow (read first) |
| [docs/git-workflow.md](./docs/git-workflow.md) | When to branch, commit, and push |
| [docs/secrets.md](./docs/secrets.md) | 1Password Environments + mounted `.env` |
| [docs/joining-a-project.md](./docs/joining-a-project.md) | First clone + mount `.env` (teammates) |
| [docs/1password-guided-setup.md](./docs/1password-guided-setup.md) | Batch 8, mount, per-secret walkthrough |
| [scripts/setup-env](./scripts/setup-env) | Verify 1Password `.env` mount after clone |
| [docs/bootstrap-spec.md](./docs/bootstrap-spec.md) | Scaffold phases |
| [scripts/create-project](./scripts/create-project) | Copy template → new folder + git |
| [scripts/init-repo](./scripts/init-repo) | Git init in current folder |
| [.cursor/hooks.json](./.cursor/hooks.json) | Auto-start onboarding in Agent |
| [.cursor/rules/](./.cursor/rules/) | Cursor agent rules |

## Publishing as a GitHub template

**For maintainers** — protect the master repo so nobody breaks it:

1. **Settings → General → Template repository** → enable (shows **Use this template** button).
2. **Settings → Branches** → protect `main` (PR required; push limited to you).
3. **Do not give write access** to the template repo except maintainers.
4. Tell people to use **Use this template**, not clone the master for their app.

Full guide: [.github/TEMPLATE.md](./.github/TEMPLATE.md)

Recipients: **Use this template** → clone **their** new repo → open in Cursor → Agent chat → `start`.

## After bootstrap

- [ ] Project folder with `.git` and initial commit
- [ ] GitHub remote (if requested)
- [ ] `./scripts/dev`, `./scripts/test`, `./scripts/lint` working
- [ ] `docs/project-context.md` filled in

## License

Replace with your project's license.

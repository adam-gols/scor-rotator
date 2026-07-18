# Git workflow

How to save work, use branches, and push — for **humans and AI agents**. Default branch is **`main`** (not `master`).

## Two different repos

| Repo | Who works here | Rule |
|------|----------------|------|
| **`project-template`** (master template on GitHub) | Maintainers only | Do not build products here. Use **Use this template** to create your own repo. |
| **Your project** (`~/Documents/<slug>`) | You and your team | All normal development happens here, using the workflow below. |

---

## The simple rule

```txt
main = always deployable, reviewed code
your branch = where you do the work
```

**Never** do day-to-day feature work directly on `main`. **Always** use a branch and a pull request.

---

## Decision guide

| Situation | What to do |
|-----------|------------|
| Starting a new feature | Create branch → commit on branch → push branch → open PR |
| Fixing a bug | Create `fix/...` branch → PR to `main` |
| Small docs / typo | Still prefer a branch + PR (or ask if team allows direct to `main`) |
| **Initial project bootstrap** (agent, once) | Commit to `main` and push — **only time** direct push to `main` is expected |
| Experiment / unsure | Create branch; delete branch if abandoned |
| Ready to share work | Push **your branch**, not `main` |
| After PR approved + tests pass | Merge PR into `main` (on GitHub) |
| Emergency hotfix | Short-lived `fix/hotfix-...` branch → fast PR → merge |

---

## Branch naming

| Prefix | Use for | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/contractor-availability` |
| `fix/` | Bug fixes | `fix/login-error` |
| `chore/` | Tooling, deps, config | `chore/update-eslint` |
| `docs/` | Documentation only | `docs/setup-guide` |

Use lowercase and hyphens. One concern per branch.

---

## Daily workflow (your project)

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create a branch for your work
git checkout -b feature/my-change

# 3. Work, commit often
git add -A
git commit -m "Add contractor availability form validation"

# 4. Push YOUR branch (not main)
git push -u origin feature/my-change

# 5. Open a pull request on GitHub → merge when reviewed
gh pr create --base main --head feature/my-change
```

---

## When to commit (locally)

Commit when:

- [ ] A logical piece of work is done
- [ ] `./scripts/test` passes (or you note why not)
- [ ] No secrets or `.env` files are included

Do **not** commit:

- `Updates` / `WIP` / `fix stuff` messages
- Half-finished work without a clear note in the PR
- Unrelated drive-by changes

---

## When to push

| Push | When |
|------|------|
| **Push your branch** | When you want backup, review, or CI — anytime the branch builds |
| **Push to `main`** | Almost never directly — merge via PR instead |
| **Force push** | Never on `main`. Only on **your own branch** if you rewrote history and no one else uses it |

### First push after bootstrap (exception)

The agent may push **once** to `main` after initial scaffold:

```bash
git push -u origin main   # OK only for "Initial project scaffold"
```

After that, use branches for everything.

---

## Pull requests

Every change to `main` should go through a PR when working with others (or solo, for discipline).

PR checklist:

- [ ] What changed and why
- [ ] How to test (`./scripts/test`, manual steps)
- [ ] No secrets committed
- [ ] Linked issue / ticket if your team uses one

Template: [.github/pull_request_template.md](../.github/pull_request_template.md)

---

## Protect `main` on GitHub (recommended)

After creating your project repo, enable branch protection:

1. GitHub → your repo → **Settings → Rules → Rulesets** (or **Branches**)
2. Protect `main`:
   - [ ] Require pull request before merging
   - [ ] Require status checks (when CI exists)
   - [ ] Restrict direct pushes

This stops accidental pushes to `main` even when someone forgets the workflow.

---

## For AI agents

1. Read this file before any `git` operations.
2. **Default:** create a feature branch for all work after bootstrap.
3. **Do not** `git push origin main` except the one-time initial scaffold push (and only when the user approved bootstrap).
4. Before pushing, tell the user: branch name, what commits, and whether it's a PR workflow.
5. **Do not** force push `main`. **Do not** skip hooks (`--no-verify`) unless the user explicitly asks.
6. If the user says "commit this" without a branch, create a branch first and explain why.

---

## Quick reference card

```txt
┌─────────────────────────────────────────────────────────┐
│  WORK ON A BRANCH  →  COMMIT  →  PUSH BRANCH  →  PR   │
│  main is updated only by merging PRs (after bootstrap)  │
└─────────────────────────────────────────────────────────┘
```

Questions? See [CONTRIBUTING.md](../CONTRIBUTING.md) or ask in Agent chat.

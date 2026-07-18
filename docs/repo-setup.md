# Repository Setup

Agents: every project **always** gets a GitHub repository and a local clone at **`~/Documents/<project-slug>`**. The user does not choose folder location or whether to use GitHub.

## Standard flow (always)

1. User completes onboarding in the template (master copy or temporary workspace).
2. After Batch 4 approval, run:
   ```bash
   ./scripts/create-project <project-slug> [--public|--private]
   ```
3. This creates a GitHub repo from `adam-gols/project-template` and clones it to `~/Documents/<slug>`.
4. Write filled `docs/bootstrap-spec.md` and `docs/project-context.md` in **`~/Documents/<slug>`**.
5. Bootstrap phases 2–5 in that directory.
6. Commit and push:
   ```bash
   cd ~/Documents/<slug>
   ./scripts/init-repo --commit-only -m "Initial project scaffold"
   git push -u origin main
   ```
7. Tell the user to **File → Open Folder** → `~/Documents/<slug>` in Cursor.

Do not ask: primary language, GitHub yes/no, or local folder location.

## Interview fields (Batch 1)

| Field | Notes |
|-------|-------|
| Project slug | lowercase, hyphens — GitHub repo name **and** `~/Documents/<slug>` folder |
| GitHub visibility | private (default) or public — only repo setting to ask |

Record in `docs/project-context.md` → **Repository**:

| Field | Value |
|-------|-------|
| Local path | `~/Documents/<slug>` |
| GitHub remote | always yes |
| Remote URL | from `gh repo view` after create |

## Primary language

**Do not ask the user.** You choose in Batch 3 based on project type, workflows, and stack. Record in `docs/bootstrap-spec.md` Identity and `docs/project-context.md` Tech stack with one-line reasoning.

| Project type | Default language | Override when |
|--------------|------------------|---------------|
| web-app | TypeScript | User needs heavy data/ML backend → consider Python backend separately |
| api | TypeScript (Node) or Python | Python for data/ML/scientific; Go for infra CLI-heavy |
| cli | TypeScript or Go | Go for systems tooling; TS if sharing code with web monorepo |
| library | Match consumer ecosystem | |
| monorepo | TypeScript | unless product clearly Python/Go |

## Already in ~/Documents/<slug>

If the user already used **Use this template** and cloned to Documents:

- Skip `create-project` (repo + clone already exist).
- Bootstrap in the current directory.
- Commit and push when scaffold is done.

Detect: cwd is `~/Documents/*`, `.git` exists, `origin` remote present.

## GitHub prerequisites

Before `create-project`:

```bash
gh auth status
```

If not authenticated, stop and tell the user to run `gh auth login`.

## Script reference

```bash
# Creates github.com/<user>/<slug> from template, clones to ~/Documents/<slug>
./scripts/create-project my-app --private

# After bootstrap — commit and push scaffold
cd ~/Documents/my-app
./scripts/init-repo --commit-only -m "Initial project scaffold"
git push -u origin main
```

Override template source (optional):

```bash
TEMPLATE_GITHUB_REPO=org/other-template ./scripts/create-project my-app
```

## Definition of done (repo)

- [ ] GitHub repo exists under the user's account/org
- [ ] Local clone at `~/Documents/<slug>` with `origin` remote
- [ ] Scaffold committed and pushed to `main`
- [ ] `docs/project-context.md` records local path and remote URL
- [ ] User opened `~/Documents/<slug>` in Cursor

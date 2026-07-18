# GitHub template — maintainer notes

This repo is designed as a **GitHub template repository**. The goal: everyone gets their **own copy**; nobody should develop on or push to the master template.

## Enable template mode (required)

1. Open https://github.com/adam-gols/project-template
2. **Settings → General**
3. Check **Template repository**
4. Save

Or from CLI (run locally):

```bash
gh repo edit adam-gols/project-template --template
```

After this, the repo home page shows a green **Use this template** button. That is what you share — not “clone this repo and build your app here.”

## Protect the master template

Template mode alone does not stop someone with write access from pushing to `main`. Lock it down:

### 1. Limit who can write

| Who | Access |
|-----|--------|
| You (maintainer) | Admin / maintain |
| Everyone else | **No write access** to `project-template` |

Recipients never need push access to the template. They use **Use this template** → GitHub creates **their** new repo → they push there.

**Settings → Collaborators:** do not add teammates as writers on the template unless they are maintainers.

### 2. Branch protection on `main`

**Settings → Rules → Rulesets** (or **Branches → Branch protection**):

- [ ] Require a pull request before merging
- [ ] Do not allow bypassing (including admins, if you want strict mode)
- [ ] Restrict who can push to `main` → maintainers only

CLI example:

```bash
gh api repos/adam-gols/project-template/rulesets -X POST -f name="Protect main" -f target=branch -f enforcement=active -f conditions='{"ref_name":{"include":["refs/heads/main"]}}' ...
```

(Branch rulesets vary by plan; the GitHub UI is easiest.)

### 3. What you tell people

**Share this:**

> Create your project: open the template repo → **Use this template** → name your repo → clone **your** repo → open in Cursor → Agent chat → `start`.

**Do not share:**

> Clone `project-template` and build your app in that folder.

Cloning the master template still works for **you** when testing, but teammates should always create a repo from the template button so their work stays separate.

### 4. Optional hardening

| Option | When to use |
|--------|-------------|
| Keep template **private** | Only your org/account can see and use it |
| **Archive** the repo | Template is frozen; no new commits |
| Org **template repository** | Central templates for a company GitHub org |

## What recipients do

1. Click **Use this template** → create **their** repo (e.g. `my-app`)
2. Clone **their** repo: `git clone git@github.com:them/my-app.git`
3. Open in Cursor → Agent chat → any message → onboarding runs

Their commits go to **their** repo. The master `project-template` stays unchanged.

## Clone vs Use this template

| Action | Master template affected? | Correct for new projects? |
|--------|---------------------------|---------------------------|
| **Use this template** | No — new independent repo | Yes |
| **Fork** | No — but fork relationship; PRs can flow back | Usually no |
| **Clone master + push** (with write access) | **Yes — can break master** | No |

## Optional: default branch

Ensure default branch is `main` to match `scripts/create-project` and `scripts/init-repo`.

## Do not

- Commit `.env` or secrets
- Remove `.cursor/hooks.json` or `.cursor/rules/` — they power auto-onboarding
- Give write access to the template repo to people who are only starting new projects

## Distribution checklist

- [ ] Template repository enabled
- [ ] Branch protection on `main`
- [ ] Only maintainers have write access to `project-template`
- [ ] README / team docs say **Use this template**, not clone master
- [ ] Team knows: Agent chat after opening **their** new repo in Cursor

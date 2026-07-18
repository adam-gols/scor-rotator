# Getting Started

## Automatic (recommended)

1. Copy or clone this template (or use GitHub **Use this template**).
2. Open the folder in **Cursor**.
3. Open **Agent** chat and send any message.

The agent interviews you, creates your **project folder + git repo** (+ optional **GitHub repo**), and bootstraps the app when you approve.

For GitHub: install [gh CLI](https://cli.github.com/) and run `gh auth login` first.

---

## What happens

```txt
You open Template in Cursor
        ↓
Agent chat → onboarding questions (Batch 1–4)
        ↓
You approve summary
        ↓
Agent runs scripts/create-project (new folder + git [+ GitHub])
        ↓
Agent bootstraps app, commits, tells you which folder to open
```

If you already copied the template into your project folder (not the master Template repo), the agent sets up git **in place** instead.

---

## Manual checklist

Use only if not using Agent.

### Step 1: Create your repo

```bash
cp -R /path/to/Template /path/to/my-new-project
cd /path/to/my-new-project
./scripts/init-repo --github --private
```

Or from inside Template:

```bash
./scripts/create-project my-app .. --github --private
cd ../my-app
```

### Step 2: Fill context

Copy and complete:

```bash
cp docs/project-context.template.md docs/project-context.md
```

Edit `docs/bootstrap-spec.md` and `docs/project-context.md`.

### Step 3: Bootstrap

Ask Agent: *"Read AGENTS.md and bootstrap per docs/bootstrap-spec.md"*

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Onboarding doesn't start | Open Agent chat; send a message. Check Cursor **Settings → Hooks**. |
| GitHub repo not created | Run `gh auth login`; re-run `./scripts/init-repo --github` |
| Wrong folder | Tell agent your preferred slug; it re-runs `create-project` |
| Hooks not loading | Restart Cursor after cloning |
| Joining an existing project (not template) | [docs/joining-a-project.md](./docs/joining-a-project.md) — mount 1Password `.env` |

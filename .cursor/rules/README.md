# Cursor project rules

These rules load automatically in Cursor. Check **Cursor Settings → Rules** (or the Rules panel) to confirm they are active.

| Rule | Applies | Purpose |
|------|---------|---------|
| [000-onboarding.mdc](./000-onboarding.mdc) | Always | Auto-start interview when template is unfilled |
| [001-scaffold.mdc](./001-scaffold.mdc) | On request / scaffold | Bootstrap phases after onboarding |
| [002-safety.mdc](./002-safety.mdc) | Always | Secrets, auth, validation |
| [003-collaboration.mdc](./003-collaboration.mdc) | Always | Small diffs, existing patterns |
| [004-project-specific.mdc](./004-project-specific.mdc) | Always | Stack-specific (fill after bootstrap) |
| [005-repo-setup.mdc](./005-repo-setup.mdc) | Always | Git + GitHub repo creation |
| [006-brand.mdc](./006-brand.mdc) | UI files (`*.tsx`, `*.css`, etc.) | GOLS brand tokens and logos |
| [007-git-workflow.mdc](./007-git-workflow.mdc) | Always | Branches, PRs, push rules |
| [008-secrets.mdc](./008-secrets.mdc) | Always | 1Password Environment + first-clone mount guide |

## Hooks

[../hooks.json](../hooks.json):

| Hook | Purpose |
|------|---------|
| `onboarding-session-start.sh` | Onboarding when placeholders remain; 1Password mount help when `.env` is missing |
| `git-push-guard.sh` | Asks before `git push` directly to `main` |

Debug hooks: **Cursor Settings → Hooks** or the Hooks output channel.

## New project flow

1. Open this folder in Cursor
2. Open **Agent** chat (Cmd+I / Ctrl+I)
3. Send any message — onboarding starts automatically
4. Agent creates your project repo and bootstraps when you approve

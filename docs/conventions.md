# Conventions

General coding and collaboration conventions. Project-specific overrides go in `docs/project-context.md` and `.cursor/rules/004-project-specific.mdc`.

## Code changes

- Smallest useful diff; match existing style and patterns.
- Reuse existing utilities, components, and services before adding new ones.
- Validate data at system boundaries.
- Handle loading, empty, error, and success states in UI when applicable.
- Separate business logic from UI when the project structure supports it.
- Do not touch unrelated files or make drive-by refactors.

## Dependencies

Add a dependency only if:

1. The repo cannot reasonably solve the problem without it
2. It is actively maintained and fits the stack
3. You document why it is needed

## Testing

- Behavior changes → add or update tests where practical.
- Bug fixes → regression test when possible.
- Do not delete failing tests to make CI green.

## Documentation

Update docs when changing setup, commands, env vars, APIs, schema, auth, or deployment.

Record non-obvious decisions in `docs/decisions/` using [templates/adr.template.md](../templates/adr.template.md).

## Security

Never commit secrets. Use env vars. Do not log sensitive data. Do not disable auth checks to unblock work. Do not expose internal errors to end users.

## Database

- No casual schema changes; explain migrations and rollback.
- Keep migrations, models, and seeds consistent.

## Git

- Imperative, specific commit messages.
- PRs: what, why, files, how to test, risks.
- **Full workflow:** [git-workflow.md](./git-workflow.md) — branches, when to push, when to use PRs.
- **Summary:** work on `feature/` / `fix/` branches; merge to `main` via PR only (except one-time bootstrap).

## Repo understanding (brownfield)

When first working in an unfamiliar repo, summarize before coding:

```md
## Repo Understanding

### What this project does

### Tech stack

### Main folders

### Conventions observed

### Commands

### Missing documentation

### Risks before changing code

### Recommended next steps
```

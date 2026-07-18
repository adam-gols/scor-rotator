# GOLS brand kit

Org-wide brand assets for **Game On Live Studio (GOLS)**. Copied into every new project automatically — do not remove or replace without approval.

| File | Purpose |
|------|---------|
| [guidelines.md](./guidelines.md) | Full brand & style guide (human + AI) |
| [tokens.json](./tokens.json) | Machine-readable colors, fonts, logo paths |
| [logos/](./logos/) | Approved PNG logo assets |

## For AI agents

Before UI, marketing, or visual work:

1. Read `brand/tokens.json`
2. Read `brand/guidelines.md` (especially Logo Usage, Color System, Typography)
3. Follow [.cursor/rules/006-brand.mdc](../.cursor/rules/006-brand.mdc)

Use logo paths from `tokens.json`. Never hardcode colors outside CSS variables from `templates/brand.css.template`.

## Validation

```bash
./scripts/validate-brand
```

Runs as part of `./scripts/lint`.

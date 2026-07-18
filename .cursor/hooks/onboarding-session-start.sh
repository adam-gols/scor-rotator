#!/usr/bin/env bash
# Injects Agent context on sessionStart:
# - Template onboarding when placeholders remain
# - 1Password mount help when bootstrapped project has no .env
set -euo pipefail

project_dir="${CURSOR_PROJECT_DIR:-.}"
cd "$project_dir"

needs_onboarding=false

if [[ ! -f docs/project-context.md ]]; then
  needs_onboarding=true
elif grep -qE '\[PLACEHOLDER\]|\[PROJECT_NAME\]' docs/bootstrap-spec.md 2>/dev/null; then
  needs_onboarding=true
elif grep -qE '\[PLACEHOLDER\]|\[PROJECT_NAME\]' docs/project-context.md 2>/dev/null; then
  needs_onboarding=true
fi

if [[ "$needs_onboarding" == "true" ]]; then
  python3 <<'PY'
import json

context = """TEMPLATE ONBOARDING ACTIVE — act immediately on the user's first message.

You are helping someone start a new project from this template. They did NOT read the docs.

1. Read docs/onboarding-interview.md and docs/repo-setup.md.
2. Greet them in 1–2 sentences, then start Batch 1 (use AskQuestion for project type).
3. Do NOT ask primary language, GitHub yes/no, or folder path — always GitHub; always ~/Documents/<slug>; AI picks language in Batch 6.
4. Batches 2–5 are separate: problem → users → workflows → out of scope (one batch each).
5. Batch 8: 1Password Environment + Cursor plugin per docs/1password-guided-setup.md (mount .env in Phase 5b).
6. After Batch 9 approval: ./scripts/create-project <slug> then bootstrap in ~/Documents/<slug>.
7. Do NOT ask them to paste PROMPT.md or read GETTING_STARTED.
8. Do NOT scaffold until they approve the Batch 9 summary.
9. Each new env var: add to Environment via per-secret guide; never paste secrets in chat.
10. Do NOT copy .env.example to .env — use 1Password Environment mount."""

print(json.dumps({"additional_context": context}))
PY
  exit 0
fi

# Bootstrapped project without .env — likely first clone or mount not configured
if [[ -f docs/project-context.md ]] && [[ ! -f .env ]]; then
  python3 <<'PY'
import json

context = """1PASSWORD MOUNT NEEDED — this project uses a mounted .env from 1Password.

The user may have just cloned this repo. If they ask for help or send any first message:

1. Read docs/project-context.md → Secrets for the Environment name.
2. Follow docs/1password-guided-setup.md → First clone / teammate agent script.
3. Link docs/joining-a-project.md for the human checklist.
4. Guide mount → ./scripts/setup-env → ./scripts/dev.
5. Never accept secret values in chat."""

print(json.dumps({"additional_context": context}))
PY
  exit 0
fi

printf '%s\n' '{}'

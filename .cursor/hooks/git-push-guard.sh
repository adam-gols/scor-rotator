#!/usr/bin/env bash
# Warn before pushing directly to main/master.
set -euo pipefail

input=$(cat)

INPUT="$input" python3 <<'PY'
import json
import os
import re
import sys

raw = os.environ.get("INPUT", "")
if not raw.strip():
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

payload = json.loads(raw)
command = payload.get("command", "")

if "git push" not in command:
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

if re.search(r"git push(\s+-u)?\s+(\S+\s+)?origin\s+(main|master)\s*$", command):
    print(json.dumps({
        "permission": "ask",
        "user_message": "This pushes directly to main. Normal work should use a feature branch and pull request. Only approve for the one-time initial bootstrap push.",
        "agent_message": "Direct push to main blocked pending approval. Prefer: git push -u origin feature/your-branch then open a PR. See docs/git-workflow.md."
    }))
    sys.exit(0)

print(json.dumps({"permission": "allow"}))
PY

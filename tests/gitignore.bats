#!/usr/bin/env bats
# Tests for .gitignore

setup() {
  REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/.." && pwd)"
  GITIGNORE="$REPO_ROOT/.gitignore"
}

check_ignore() {
  local path="$1"

  (cd "$REPO_ROOT" && git check-ignore -v -- "$path" 2>/dev/null)
}

assert_ignored() {
  local path="$1"
  local pattern="$2"

  run check_ignore "$path"

  [ "$status" -eq 0 ]
  [[ "$output" == *".gitignore:"* ]]
  [[ "$output" == *"$pattern"* ]]
  [[ "$output" == *"$path" ]]
}

assert_not_ignored() {
  local path="$1"

  run check_ignore "$path"

  [ "$status" -eq 1 ]
  [ -z "$output" ]
}

@test ".gitignore exists and declares the key local-only rules" {
  [ -f "$GITIGNORE" ]

  grep -Fxq '!*.env.example' "$GITIGNORE"
  grep -Fxq '*.env' "$GITIGNORE"
  grep -Fxq 'openclaw.json' "$GITIGNORE"
  grep -Fxq 'tasks/docs-overhaul.md' "$GITIGNORE"
  grep -Fxq 'node_modules/' "$GITIGNORE"
}

@test "env files are ignored while env examples stay trackable" {
  assert_ignored ".env" "*.env"
  assert_ignored "config/env/local.env" "*.env"

  assert_not_ignored ".env.example"
  assert_not_ignored "config/env/local.env.example"
}

@test "only targeted local state is ignored while distributable files remain visible" {
  assert_ignored "openclaw.json" "openclaw.json"
  assert_ignored "tasks/docs-overhaul.md" "tasks/docs-overhaul.md"

  assert_not_ignored "config/custom.template.json5"
  assert_not_ignored "tasks/upgrade-plan.md"
  assert_not_ignored "workspace/TEAM.md.example"
}

@test "build runtime and editor directories are ignored" {
  assert_ignored ".build/output.txt" ".build/"
  assert_ignored "apps/web/.next/server.js" ".next/"
  assert_ignored ".openclaw/state/session.json" ".openclaw/"
  assert_ignored ".venv/bin/python" ".venv/"
  assert_ignored ".vscode/settings.json" ".vscode/"
  assert_ignored ".idea/workspace.xml" ".idea/"
  assert_ignored "dist/index.js" "dist/"
  assert_ignored "packages/app/node_modules/pkg/index.js" "node_modules/"
}

@test "logs caches swap files and OS clutter are ignored" {
  assert_ignored "logs/app.log" "*.log"
  assert_ignored "module.pyc" "*.pyc"
  assert_ignored "__pycache__/module.py" "__pycache__/"
  assert_ignored "notes.swo" "*.swo"
  assert_ignored "notes.swp" "*.swp"
  assert_ignored ".DS_Store" ".DS_Store"
  assert_ignored "assets/Thumbs.db" "Thumbs.db"
}

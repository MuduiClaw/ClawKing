#!/usr/bin/env bats
# Tests for scripts/update-changelog.sh

setup() {
  TEST_DIR="$(mktemp -d)"
  REPO_DIR="$TEST_DIR/repo"
  mkdir -p "$REPO_DIR/scripts"
  cp "$(dirname "$BATS_TEST_FILENAME")/../scripts/update-changelog.sh" "$REPO_DIR/scripts/"

  # Create minimal CHANGELOG
  cat > "$REPO_DIR/CHANGELOG.md" << 'EOF'
# 更新日志

---

## [Unreleased]

### ✨ 新功能

- existing feature

### 🐛 修复

- existing fix

---

## [1.0.0] - 2026-01-01

- initial release
EOF

  # Init git repo (needed for git add in script) — no hooks in sandbox
  cd "$REPO_DIR"
  git init -q
  git config core.hooksPath /dev/null
  git add -A
  git commit -q -m "init" --no-verify
}

teardown() {
  rm -rf "$TEST_DIR"
}

@test "single feat appends to existing ✨ header" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "feat: new feature A"

  # Should NOT create a second ✨ header
  local count
  count=$(grep -c '### ✨' CHANGELOG.md)
  [ "$count" -eq 1 ]

  # Should contain new item
  grep -q "new feature A" CHANGELOG.md
}

@test "single fix appends to existing 🐛 header" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "fix: bug fix B"

  local count
  count=$(grep -c '### 🐛' CHANGELOG.md)
  [ "$count" -eq 1 ]

  grep -q "bug fix B" CHANGELOG.md
}

@test "multiple feat commits merge under one header" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "feat: feature one"
  bash scripts/update-changelog.sh --msg "feat: feature two"

  local count
  count=$(grep -c '### ✨' CHANGELOG.md)
  [ "$count" -eq 1 ]

  grep -q "feature one" CHANGELOG.md
  grep -q "feature two" CHANGELOG.md
}

@test "new type creates new header when none exists" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "docs: add readme"

  grep -q '### 📖 文档' CHANGELOG.md
  grep -q "add readme" CHANGELOG.md
}

@test "duplicate entry is skipped" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "feat: existing feature"

  # Should still have only one occurrence
  local count
  count=$(grep -c "existing feature" CHANGELOG.md)
  [ "$count" -eq 1 ]
}

@test "non-conventional commit is ignored" {
  cd "$REPO_DIR"
  local before after
  before=$(cat CHANGELOG.md)
  bash scripts/update-changelog.sh --msg "random commit message"
  after=$(cat CHANGELOG.md)

  [ "$before" = "$after" ]
}

@test "headers without （自动记录） suffix" {
  cd "$REPO_DIR"
  bash scripts/update-changelog.sh --msg "feat: test no suffix"

  # Should NOT contain （自动记录）
  ! grep -q '自动记录' CHANGELOG.md
}

@test "[private] tagged commit is excluded from changelog" {
  cd "$REPO_DIR"
  local before after
  before=$(cat CHANGELOG.md)
  bash scripts/update-changelog.sh --msg "feat: secret feature [private]"
  after=$(cat CHANGELOG.md)

  [ "$before" = "$after" ]
}

@test "[internal] tagged commit is excluded from changelog" {
  cd "$REPO_DIR"
  local before after
  before=$(cat CHANGELOG.md)
  bash scripts/update-changelog.sh --msg "feat: internal design system [internal]"
  after=$(cat CHANGELOG.md)

  [ "$before" = "$after" ]
}

@test "release commit is excluded from changelog" {
  cd "$REPO_DIR"
  local before after
  before=$(cat CHANGELOG.md)
  bash scripts/update-changelog.sh --msg "chore: release v1.5.0"
  after=$(cat CHANGELOG.md)

  [ "$before" = "$after" ]
}

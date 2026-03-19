#!/usr/bin/env bats
# Tests for scripts/cut-release.sh

setup() {
  TEST_DIR="$(mktemp -d)"
  REPO_DIR="$TEST_DIR/repo"
  mkdir -p "$REPO_DIR/scripts"
  cp "$(dirname "$BATS_TEST_FILENAME")/../scripts/cut-release.sh" "$REPO_DIR/scripts/"

  cat > "$REPO_DIR/CHANGELOG.md" << 'EOF'
# 更新日志

---

## [Unreleased]

### ✨ 新功能

- awesome feature

### 🐛 修复

- critical bugfix

---

## [1.4.1] - 2026-03-17

- previous release
EOF

  cd "$REPO_DIR"
  git init -q
  git config core.hooksPath /dev/null
  git add -A
  git commit -q -m "init" --no-verify
  git tag v1.4.1
}

teardown() {
  rm -rf "$TEST_DIR"
}

@test "dry-run shows correct version" {
  cd "$REPO_DIR"
  run bash scripts/cut-release.sh v1.5.0 --dry-run
  [ "$status" -eq 0 ]
  [[ "$output" == *"v1.5.0"* ]]
  [[ "$output" == *"dry-run"* ]]

  # CHANGELOG unchanged
  grep -q '\[Unreleased\]' CHANGELOG.md
}

@test "--patch auto-bumps from latest tag" {
  cd "$REPO_DIR"
  run bash scripts/cut-release.sh --patch --dry-run
  [ "$status" -eq 0 ]
  [[ "$output" == *"v1.4.2"* ]]
}

@test "--minor auto-bumps" {
  cd "$REPO_DIR"
  run bash scripts/cut-release.sh --minor --dry-run
  [ "$status" -eq 0 ]
  [[ "$output" == *"v1.5.0"* ]]
}

@test "rejects duplicate tag" {
  cd "$REPO_DIR"
  run bash scripts/cut-release.sh v1.4.1
  [ "$status" -ne 0 ]
  [[ "$output" == *"已存在"* ]]
}

@test "rejects invalid version format" {
  cd "$REPO_DIR"
  run bash scripts/cut-release.sh v1.5
  [ "$status" -ne 0 ]
  [[ "$output" == *"格式不对"* ]]
}

@test "rejects empty unreleased section" {
  cd "$REPO_DIR"
  # Replace content with empty section
  cat > CHANGELOG.md << 'EOF'
# 更新日志

---

## [Unreleased]

---

## [1.4.1] - 2026-03-17

- previous release
EOF
  git add CHANGELOG.md
  git commit -q -m "empty unreleased" --no-verify

  run bash scripts/cut-release.sh v1.5.0
  [ "$status" -ne 0 ]
  [[ "$output" == *"空的"* ]]
}

@test "full release rewrites CHANGELOG correctly" {
  cd "$REPO_DIR"

  # Create a local bare remote so push works
  git clone --bare . "$TEST_DIR/remote.git" 2>/dev/null
  git remote add origin "$TEST_DIR/remote.git"

  REVIEWED=1 bash scripts/cut-release.sh v1.5.0

  # New [Unreleased] exists
  grep -q '## \[Unreleased\]' CHANGELOG.md

  # Old content now under version header
  grep -q '## \[1.5.0\]' CHANGELOG.md

  # Content preserved
  grep -q 'awesome feature' CHANGELOG.md
  grep -q 'critical bugfix' CHANGELOG.md

  # Tag exists
  git tag -l v1.5.0 | grep -q 'v1.5.0'
}

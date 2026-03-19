#!/bin/bash
set -euo pipefail

# ============================================================================
# cut-release.sh — 一键发版：Unreleased → 版本号，tag + push
#
# 用法:
#   bash scripts/cut-release.sh v1.5.0           # 指定版本号
#   bash scripts/cut-release.sh v1.5.0 --dry-run # 预览不执行
#   bash scripts/cut-release.sh --patch           # 自动 patch bump
#   bash scripts/cut-release.sh --minor           # 自动 minor bump
#   bash scripts/cut-release.sh --major           # 自动 major bump
# ============================================================================

CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'
info()    { printf "${CYAN}[release]${NC} %s\n" "$*"; }
success() { printf "${GREEN}[release]${NC} %s ✓\n" "$*"; }
error()   { printf "${RED}[release]${NC} %s\n" "$*" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

CHANGELOG="$REPO_ROOT/CHANGELOG.md"
DRY_RUN=false
VERSION=""
BUMP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --patch)   BUMP="patch"; shift ;;
    --minor)   BUMP="minor"; shift ;;
    --major)   BUMP="major"; shift ;;
    v*)        VERSION="$1"; shift ;;
    *)         error "未知参数: $1" ;;
  esac
done

# --- Auto-bump from latest tag ---
if [[ -z "$VERSION" && -n "$BUMP" ]]; then
  LATEST=$(git tag -l 'v*' --sort=-version:refname | head -1 || echo "")
  if [[ -z "$LATEST" ]]; then
    error "找不到已有 tag，请手动指定版本号: bash scripts/cut-release.sh v1.0.0"
  fi
  # Strip v prefix, split
  IFS='.' read -r major minor patch <<< "${LATEST#v}"
  case "$BUMP" in
    patch) patch=$((patch + 1)) ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    major) major=$((major + 1)); minor=0; patch=0 ;;
  esac
  VERSION="v${major}.${minor}.${patch}"
fi

[[ -z "$VERSION" ]] && error "用法: bash scripts/cut-release.sh v1.5.0 [--dry-run]"
[[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || error "版本号格式不对: $VERSION (需要 vX.Y.Z)"

# --- Preflight ---
if git tag -l "$VERSION" | grep -q .; then
  error "Tag $VERSION 已存在"
fi

if ! grep -qE '^\#\# \[(Unreleased|开发中)\]' "$CHANGELOG"; then
  error "CHANGELOG 里找不到 [Unreleased] 或 [开发中] 段落"
fi

# Check there's actual content in Unreleased
UNRELEASED_CONTENT=$(sed -nE '/^## \[(Unreleased|开发中)\]/,/^---$/{/^(## |---)/d; /^$/d; p;}' "$CHANGELOG")
if [[ -z "$UNRELEASED_CONTENT" ]]; then
  error "[Unreleased] 段落是空的，没有可发布的内容"
fi

# Check working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  error "工作区有未提交的改动，先 commit 再发版"
fi

TODAY=$(date +%Y-%m-%d)
VERSION_NUM="${VERSION#v}"

info "发版: $VERSION ($TODAY)"
info "内容预览:"
echo "$UNRELEASED_CONTENT" | head -20
[[ $(echo "$UNRELEASED_CONTENT" | wc -l) -gt 20 ]] && echo "  ... (更多内容省略)"
echo ""

if $DRY_RUN; then
  info "[dry-run] 将执行:"
  info "  1. [Unreleased] → [$VERSION_NUM] - $TODAY"
  info "  2. 新建空 [Unreleased]"
  info "  3. git commit + tag $VERSION"
  info "  4. git push origin main --tags"
  exit 0
fi

# --- Execute ---

# 1. Replace [Unreleased]/[开发中] header with version + date
sed -i '' -E "s/^## \[(Unreleased|开发中)\]/## [$VERSION_NUM] - $TODAY/" "$CHANGELOG"

# 2. Insert new empty [Unreleased] at top (after the --- separator line)
awk -v ver="$VERSION_NUM" '
  /^---$/ && !inserted {
    print
    print ""
    print "## [Unreleased]"
    print ""
    inserted=1
    next
  }
  { print }
' "$CHANGELOG" > "${CHANGELOG}.tmp"
mv "${CHANGELOG}.tmp" "$CHANGELOG"

# 3. Update cursor (prevent re-scanning released commits)
git rev-parse HEAD > "$REPO_ROOT/.changelog-cursor"

# 4. Commit + tag
git add "$CHANGELOG" .changelog-cursor
REVIEWED=1 git commit -m "chore: release $VERSION

Promote [Unreleased] to [$VERSION_NUM] - $TODAY"

git tag -a "$VERSION" -m "Release $VERSION"

# 5. Push
info "推送到 origin..."
git push origin main --tags 2>&1

# 6. Verify
if git log origin/main..HEAD --oneline | grep -q .; then
  error "推送失败，本地仍有未同步的 commit"
fi

success "发版完成: $VERSION"
info "GitHub Release: https://github.com/MuduiClaw/ClawKing/releases/tag/$VERSION"
info "下一步: 去 GitHub 编辑 Release Notes（或用 gh release create）"

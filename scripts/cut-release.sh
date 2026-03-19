#!/bin/bash
set -euo pipefail

# ============================================================================
# cut-release.sh — 一键发版：Unreleased → 版本号，tag + push + GitHub Release
#
# 用法:
#   bash scripts/cut-release.sh v1.5.0           # 指定版本号
#   bash scripts/cut-release.sh v1.5.0 --dry-run # 预览不执行
#   bash scripts/cut-release.sh --patch           # 自动 patch bump
#   bash scripts/cut-release.sh --minor           # 自动 minor bump
#   bash scripts/cut-release.sh --major           # 自动 major bump
#   bash scripts/cut-release.sh --patch -y        # 跳过确认（CI 模式）
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
AUTO_YES=false
VERSION=""
BUMP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --patch)   BUMP="patch"; shift ;;
    --minor)   BUMP="minor"; shift ;;
    --major)   BUMP="major"; shift ;;
    -y|--yes)  AUTO_YES=true; shift ;;
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

# Detect current branch (don't hardcode main)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

TODAY=$(date +%Y-%m-%d)
VERSION_NUM="${VERSION#v}"

info "发版: $VERSION ($TODAY) [branch: $CURRENT_BRANCH]"
info "内容预览:"
echo "$UNRELEASED_CONTENT" | head -30
[[ $(echo "$UNRELEASED_CONTENT" | wc -l) -gt 30 ]] && echo "  ... (更多内容省略)"
echo ""

if $DRY_RUN; then
  info "[dry-run] 将执行:"
  info "  1. [Unreleased] → [$VERSION_NUM] - $TODAY"
  info "  2. 新建空 [Unreleased]"
  info "  3. git commit + tag $VERSION"
  info "  4. git push origin $CURRENT_BRANCH --tags"
  info "  5. gh release create (如果 gh CLI 可用)"
  exit 0
fi

# --- Confirmation gate (unless -y) ---
if ! $AUTO_YES; then
  printf "${CYAN}[release]${NC} 审查以上 CHANGELOG 无误，确认发版? [y/N] "
  read -r REPLY
  [[ ! "$REPLY" =~ ^[Yy]$ ]] && error "发版已取消"
fi

# --- Execute ---

# 1. Replace [Unreleased]/[开发中] header with version + date (cross-platform)
sed -E "s/^## \[(Unreleased|开发中)\]/## [$VERSION_NUM] - $TODAY/" "$CHANGELOG" > "${CHANGELOG}.sed.tmp"
mv "${CHANGELOG}.sed.tmp" "$CHANGELOG"

# 2. Insert new empty [Unreleased] at top (after the --- separator line)
awk '
  /^---$/ && !inserted {
    print
    print ""
    print "## [Unreleased]"
    print ""
    inserted=1
    next
  }
  { print }
' "$CHANGELOG" > "${CHANGELOG}.awk.tmp"
mv "${CHANGELOG}.awk.tmp" "$CHANGELOG"

# 3. Update cursor (prevent re-scanning released commits)
git rev-parse HEAD > "$REPO_ROOT/.changelog-cursor"

# 4. Sync package.json version if it exists
if [[ -f "$REPO_ROOT/package.json" ]]; then
  # Use node to avoid npm's side effects
  node -e "
    const pkg = require('./package.json');
    pkg.version = '$VERSION_NUM';
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
  git add package.json
  info "package.json → $VERSION_NUM"
fi

# 5. Commit + tag
git add "$CHANGELOG" .changelog-cursor
REVIEWED=1 git commit -m "chore: release $VERSION

Promote [Unreleased] to [$VERSION_NUM] - $TODAY"

git tag -a "$VERSION" -m "Release $VERSION"

# 6. Push
info "推送到 origin ($CURRENT_BRANCH)..."
git push origin "$CURRENT_BRANCH" --tags 2>&1

# 7. Verify push arrived
if git log "origin/$CURRENT_BRANCH..HEAD" --oneline | grep -q .; then
  error "推送失败，本地仍有未同步的 commit"
fi

success "发版完成: $VERSION"

# 8. Create GitHub Release (if gh CLI available)
if command -v gh &>/dev/null; then
  info "创建 GitHub Release..."
  echo "$UNRELEASED_CONTENT" | gh release create "$VERSION" \
    --title "Release $VERSION" \
    --notes-file - 2>&1 && \
    success "GitHub Release 已创建" || \
    info "GitHub Release 创建失败，请手动创建"
else
  info "安装 gh CLI 可自动创建 GitHub Release"
  info "手动创建: https://github.com/MuduiClaw/ClawKing/releases/tag/$VERSION"
fi

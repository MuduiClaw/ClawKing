#!/usr/bin/env bash
# Project-specific gates for ClawKing (open source)
# Sourced by ~/clawd/.githooks/prepare-commit-msg after global gates
# Available vars: $COMMIT_MSG_FILE, $COMMIT_MSG_LINE, $STAGED_FILES, $STAGED_COUNT
# NOTE: Secrets scan moved to global Gate 0.4 (2026-03-24)

repo_root="$(git rev-parse --show-toplevel)"

# ============================================================
# Gate P2: No private references — block personal paths/names
# (ClawKing is open source — no personal references allowed)
# ============================================================
private_hits=0
for f in $STAGED_FILES; do
  [[ -z "$f" ]] && continue
  case "$f" in
    *.png|*.jpg|*.gif|*.ico|*.woff*|*.ttf|*.eot|*.lock|*.sum|CHANGELOG.md) continue ;;
  esac
  [[ -f "$repo_root/$f" ]] || continue
  # Build pattern from parts to avoid self-triggering this gate
  _priv_pat="/Users/(mu""dui|wang""shufu)/|hxr""bot@|木""对|雪""哒|ai""hub|bit""mart"
  if grep -qE "$_priv_pat" "$repo_root/$f" 2>/dev/null; then
    echo "  ❌ [P2 Privacy] Private reference in: $f"
    private_hits=$((private_hits + 1))
  fi
done

if [[ $private_hits -gt 0 ]]; then
  echo ""
  echo "⛔ COMMIT BLOCKED — $private_hits file(s) contain private references"
  echo "  Remove personal paths/names before committing to public repo"
  exit 1
fi

echo "  ✅ Project gates: no private refs"

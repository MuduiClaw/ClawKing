#!/usr/bin/env bash
# verify-production.sh — 生产环境验收门禁 (Gate 8)
# 用法: bash scripts/verify-production.sh [repo-root]
#
# 部署后自动触发（pre-push Gate 8 检测到部署文件变更时）
# 检查:
#   1) Gateway HTTP 健康 (127.0.0.1:$GATEWAY_PORT)
#   2) Dashboard HTTP 可达 (127.0.0.1:$DASHBOARD_PORT)
#   3) 响应大小 > 最小阈值
#   4) 响应体无错误字符串
#
# 退出码: 0=通过, 1=失败

set -euo pipefail

REPO_ROOT="${1:-.}"
export REPO_ROOT  # used by downstream scripts if called from pre-push
GATEWAY_PORT="${GATEWAY_PORT:-3456}"
DASHBOARD_PORT="${DASHBOARD_PORT:-3001}"
MIN_RESPONSE_BYTES=100
TIMEOUT_SECS=5

FAILED=0

check_http() {
  local name="$1" url="$2" expected_code="${3:-200}"

  local tmpfile
  tmpfile=$(mktemp)
  # shellcheck disable=SC2064
  trap "rm -f '$tmpfile'" RETURN

  local http_code
  http_code=$(curl -s -o "$tmpfile" -w '%{http_code}' --connect-timeout "$TIMEOUT_SECS" "$url" 2>/dev/null || echo "000")

  # 允许 200 或 401 (dashboard 有 auth)
  if [[ "$http_code" != "200" && "$http_code" != "401" && "$http_code" != "$expected_code" ]]; then
    echo "  ❌ $name: HTTP $http_code (expected $expected_code or 200/401)"
    FAILED=1
    return
  fi

  # 响应大小检查 (401 可能 body 很小，跳过)
  if [[ "$http_code" == "200" ]]; then
    local size
    size=$(wc -c < "$tmpfile" | tr -d ' ')
    if [[ "$size" -lt "$MIN_RESPONSE_BYTES" ]]; then
      echo "  ❌ $name: response too small (${size}B < ${MIN_RESPONSE_BYTES}B)"
      FAILED=1
      return
    fi

    # 错误字符串检测
    if grep -qi 'internal server error\|502 bad gateway\|503 service unavailable\|ECONNREFUSED\|ENOTFOUND' "$tmpfile" 2>/dev/null; then
      echo "  ❌ $name: response contains error strings"
      FAILED=1
      return
    fi
  fi

  echo "  ✅ $name: HTTP $http_code OK"
}

echo "🔍 Production verification..."

# 1. Gateway 健康
check_http "Gateway" "http://127.0.0.1:${GATEWAY_PORT}/"

# 2. Gateway RPC (如果有 health endpoint)
check_http "Gateway health" "http://127.0.0.1:${GATEWAY_PORT}/health" "200"

# 3. Dashboard 可达
check_http "Dashboard" "http://127.0.0.1:${DASHBOARD_PORT}/"

# 4. openclaw config validate (如果命令可用)
if command -v openclaw &>/dev/null; then
  if openclaw config validate &>/dev/null; then
    echo "  ✅ Config validate: valid"
  else
    echo "  ❌ Config validate: invalid"
    FAILED=1
  fi
fi

if [[ $FAILED -eq 1 ]]; then
  echo ""
  echo "❌ Production verification FAILED"
  exit 1
fi

echo ""
echo "✅ Production verification passed"
exit 0

#!/usr/bin/env bats

setup() {
  SCRIPT="$BATS_TEST_DIRNAME/../workspace/scripts/verify-production.sh"
}

@test "verify-production.sh exists and is executable" {
  [[ -x "$SCRIPT" ]]
}

@test "verify-production.sh passes syntax check" {
  bash -n "$SCRIPT"
}

@test "verify-production.sh prints usage info with correct exit on no services" {
  # With no services running on random ports, it should fail gracefully
  GATEWAY_PORT=19999 DASHBOARD_PORT=19998 run bash "$SCRIPT" .
  # Should fail (services not running)
  [[ $status -eq 1 ]]
  [[ "$output" == *"Production verification"* ]]
}

@test "verify-production.sh respects GATEWAY_PORT env var" {
  GATEWAY_PORT=19999 DASHBOARD_PORT=19998 run bash "$SCRIPT" .
  # Should mention Gateway in output
  [[ "$output" == *"Gateway"* ]]
}

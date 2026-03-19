#!/usr/bin/env bats

# Tests for SSH detection logic in setup.sh

setup() {
  SETUP="$BATS_TEST_DIRNAME/../setup.sh"
}

@test "setup.sh uses lsof port-22 check before sudo-based detection" {
  # lsof check should appear before sudo systemsetup check
  local lsof_line sudo_line
  lsof_line=$(grep -n 'lsof -iTCP:22' "$SETUP" | head -1 | cut -d: -f1)
  sudo_line=$(grep -n 'sudo -n true.*systemsetup.*getremotelogin' "$SETUP" | head -1 | cut -d: -f1)
  [[ -n "$lsof_line" ]]
  [[ -n "$sudo_line" ]]
  [[ "$lsof_line" -lt "$sudo_line" ]]
}

@test "setup.sh guards sudo blocks with sudo -n true check" {
  # Every sudo systemsetup/launchctl block should be inside a 'sudo -n true' conditional
  # Count the 'sudo -n true' guards in the SSH section
  local ssh_section guard_count
  ssh_section=$(sed -n '/Enable macOS SSH/,/Persist PATH/p' "$SETUP")
  guard_count=$(echo "$ssh_section" | grep -c 'sudo -n true')
  # Should have at least 3 guards (detect, attempt 1, attempt 2)
  [[ "$guard_count" -ge 3 ]]
}

@test "setup.sh detects non-interactive terminal with -t 0" {
  grep -q '\-t 0' "$SETUP"
}

@test "setup.sh skips GUI wait in non-interactive mode" {
  # Should have a branch for ! $HAS_TTY that doesn't open System Preferences
  grep -q 'HAS_TTY' "$SETUP"
  # The non-interactive branch should warn and move on
  local non_tty_section
  non_tty_section=$(sed -n '/elif ! \$HAS_TTY/,/^else$/p' "$SETUP")
  echo "$non_tty_section" | grep -q "非交互模式"
}

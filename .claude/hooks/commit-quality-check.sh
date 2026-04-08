#!/bin/bash
# PreToolUse hook: Validates commit messages follow conventional commit format
# Triggered before Bash tool runs git commit commands

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# Only check Bash calls that contain "git commit"
if [[ "$tool_name" != "Bash" ]]; then
  exit 0
fi

if [[ "$command" != *"git commit"* ]]; then
  exit 0
fi

# Extract the first meaningful line of the commit message
# Handle heredoc pattern: -m "$(cat <<'EOF'\n message \nEOF)"
# Handle simple pattern: -m "message"
msg=""

# Try heredoc: grab the first non-empty line after EOF marker
if echo "$command" | grep -q 'EOF'; then
  msg=$(echo "$command" | sed -n '/EOF/,/EOF/{/EOF/d;p}' | sed '/^\s*$/d' | head -1 | sed 's/^[[:space:]]*//')
fi

# Try simple -m "message" or -m 'message'
if [[ -z "$msg" ]]; then
  msg=$(echo "$command" | grep -oP '(?<=-m\s")[^"]+' | head -1)
fi
if [[ -z "$msg" ]]; then
  msg=$(echo "$command" | grep -oP "(?<=-m\s')[^']+" | head -1)
fi

# If we can't parse the message, let it through
if [[ -z "$msg" ]]; then
  exit 0
fi

# Check conventional commit format: type(scope): description OR type: description
if ! echo "$msg" | grep -qP '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?:\s.+'; then
  echo "Commit message does not follow conventional commits format." >&2
  echo "Expected: type(scope): description" >&2
  echo "Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert" >&2
  echo "Example: feat(blog): add new NCA constitutional law article" >&2
  exit 2
fi

exit 0

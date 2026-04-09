#!/bin/bash
# PostToolUse hook: Auto-rebuild blog HTML when markdown articles are edited
# Triggered after Edit/Write tools touch blog/ markdown files

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.command // empty')

# Only trigger on Edit or Write to blog markdown files
if [[ "$tool_name" != "Edit" && "$tool_name" != "Write" ]]; then
  exit 0
fi

if [[ "$file_path" != *"blog/"*".md"* ]]; then
  exit 0
fi

# Check if build.js exists
if [[ ! -f "build.js" ]]; then
  exit 0
fi

# Check if node is available
if ! command -v node &>/dev/null; then
  exit 0
fi

echo "Blog markdown changed — rebuilding static HTML pages..." >&2
node build.js 2>&1 | tail -3 >&2
echo "Blog rebuild complete. New HTML pages generated." >&2
exit 0

#!/usr/bin/env bash
# Install awesome-claude-code slash commands into ~/.claude/commands/
# so they are available in every Claude Code session.
#
# Usage: ./install-awesome-claude-code.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/awesome-claude-code/resources/slash-commands"
DEST="$HOME/.claude/commands"

if [ ! -d "$SRC" ]; then
  echo "Error: Source directory not found: $SRC"
  exit 1
fi

mkdir -p "$DEST"

count=0
for cmd_dir in "$SRC"/*/; do
  for md_file in "$cmd_dir"*.md; do
    [ -f "$md_file" ] || continue
    cp "$md_file" "$DEST/"
    count=$((count + 1))
  done
done

echo "Installed $count slash commands to $DEST"
echo "Commands are now available as /command-name in Claude Code."

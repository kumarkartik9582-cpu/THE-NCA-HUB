"""
Command installation functions for SuperClaude.

Installs markdown slash command files from the plugin source
to the Claude Code commands directory (~/.claude/commands/sc/).
"""

import shutil
from pathlib import Path

# Resolve the plugin commands source directory
_PACKAGE_DIR = Path(__file__).resolve().parent.parent
_PROJECT_ROOT = _PACKAGE_DIR.parent.parent  # src/superclaude -> src -> project root
_COMMANDS_SOURCE = _PROJECT_ROOT / "plugins" / "superclaude" / "commands"


def _get_commands_source() -> Path:
    """Find the commands source directory."""
    if _COMMANDS_SOURCE.exists():
        return _COMMANDS_SOURCE
    # Fallback: check if we're in a dev install (editable mode)
    candidate = Path.cwd() / "plugins" / "superclaude" / "commands"
    if candidate.exists():
        return candidate
    return _COMMANDS_SOURCE


def list_available_commands() -> list[str]:
    """Return sorted list of available command names (without .md extension)."""
    source = _get_commands_source()
    if not source.exists():
        return []
    commands = [f.stem for f in sorted(source.glob("*.md"))]
    return sorted(commands)


def install_commands(target_path: Path | None = None, force: bool = False) -> tuple:
    """Install command files to target directory.

    Returns (success: bool, message: str).
    """
    if target_path is None:
        target_path = Path.home() / ".claude" / "commands" / "sc"

    source = _get_commands_source()
    if not source.exists():
        return False, f"Commands source not found: {source}"

    target_path.mkdir(parents=True, exist_ok=True)

    installed = 0
    skipped = 0
    total = 0

    for cmd_file in sorted(source.glob("*.md")):
        total += 1
        dest = target_path / cmd_file.name
        if dest.exists() and not force:
            skipped += 1
        else:
            shutil.copy2(cmd_file, dest)
            installed += 1

    if skipped > 0 and installed == 0:
        return True, f"Skipped {skipped} existing commands (use --force to overwrite)"
    elif skipped > 0:
        return True, f"Installed {installed} commands, Skipped {skipped} existing"
    else:
        return True, f"Installed {total} commands to {target_path}"


def list_installed_commands() -> list[str]:
    """Return list of installed command names."""
    cmd_dir = Path.home() / ".claude" / "commands" / "sc"
    if not cmd_dir.exists():
        return []
    return sorted(f.stem for f in cmd_dir.glob("*.md"))

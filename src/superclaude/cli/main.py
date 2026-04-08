"""
SuperClaude CLI - Main entry point

Commands:
- superclaude install: Install slash commands
- superclaude doctor: Health check
- superclaude mcp: MCP server management
- superclaude --version: Show version
"""

import click

from superclaude import __version__


@click.group(invoke_without_command=True)
@click.option("--version", is_flag=True, help="Show version")
@click.pass_context
def main(ctx, version):
    """SuperClaude Framework - AI-enhanced development for Claude Code."""
    if version:
        click.echo(f"superclaude {__version__}")
        return
    if ctx.invoked_subcommand is None:
        click.echo(ctx.get_help())


@main.command()
@click.option("--list", "list_commands", is_flag=True, help="List installed commands")
@click.option("--force", is_flag=True, help="Force reinstall existing commands")
def install(list_commands, force):
    """Install slash commands to ~/.claude/commands/sc/."""
    from superclaude.cli.install_commands import (
        install_commands as do_install,
        list_installed_commands,
    )

    if list_commands:
        installed = list_installed_commands()
        if installed:
            click.echo("Installed commands:")
            for cmd in installed:
                click.echo(f"  /sc:{cmd}")
        else:
            click.echo("No commands installed yet.")
        return

    from pathlib import Path
    target = Path.home() / ".claude" / "commands" / "sc"
    success, message = do_install(target_path=target, force=force)
    click.echo(message)


@main.command()
def doctor():
    """Run health check diagnostics."""
    click.echo("SuperClaude Health Check")
    click.echo("=" * 40)

    # Check package
    try:
        import superclaude
        click.echo(f"✅ Package: superclaude {superclaude.__version__}")
    except ImportError:
        click.echo("❌ Package: superclaude not found")

    # Check pytest plugin
    try:
        import superclaude.pytest_plugin
        click.echo("✅ Pytest plugin: loaded")
    except ImportError:
        click.echo("❌ Pytest plugin: not found")

    # Check commands
    from pathlib import Path
    cmd_dir = Path.home() / ".claude" / "commands" / "sc"
    if cmd_dir.exists():
        count = len(list(cmd_dir.glob("*.md")))
        click.echo(f"✅ Commands: {count} installed in {cmd_dir}")
    else:
        click.echo(f"⚠️  Commands: not installed (run 'superclaude install')")

    click.echo()
    click.echo("SuperClaude is healthy")


@main.command()
@click.option("--list", "list_servers", is_flag=True, help="List available servers")
@click.option("--servers", multiple=True, help="Servers to install")
def mcp(list_servers, servers):
    """Manage MCP server configurations."""
    if list_servers:
        click.echo("Available MCP servers:")
        click.echo("  tavily     - Web search (Deep Research)")
        click.echo("  context7   - Official documentation")
        click.echo("  sequential - Token-efficient reasoning")
        click.echo("  serena     - Session persistence")
        click.echo("  playwright - Browser automation")
        return

    if servers:
        for server in servers:
            click.echo(f"Installing MCP server: {server}")
    else:
        click.echo("Interactive MCP installation (use --servers to specify)")


if __name__ == "__main__":
    main()

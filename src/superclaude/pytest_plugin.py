"""
SuperClaude Pytest Plugin - Auto-loaded via entry point

Provides:
- Fixtures: confidence_checker, self_check_protocol, reflexion_pattern,
            token_budget, pm_context
- Auto-markers: unit (tests/unit/), integration (tests/integration/)
- Custom markers: confidence_check, self_check, reflexion, complexity
"""

import pytest

from superclaude.pm_agent.confidence import ConfidenceChecker
from superclaude.pm_agent.self_check import SelfCheckProtocol
from superclaude.pm_agent.reflexion import ReflexionPattern
from superclaude.pm_agent.token_budget import TokenBudgetManager


def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "confidence_check: Pre-execution confidence assessment")
    config.addinivalue_line("markers", "self_check: Post-implementation validation")
    config.addinivalue_line("markers", "reflexion: Error learning and prevention")
    config.addinivalue_line("markers", "complexity(level): Task complexity (simple, medium, complex)")
    config.addinivalue_line("markers", "unit: Unit tests")
    config.addinivalue_line("markers", "integration: Integration tests")


def pytest_collection_modifyitems(items):
    """Auto-apply markers based on test file location."""
    for item in items:
        test_path = str(item.fspath)
        if "/unit/" in test_path:
            item.add_marker(pytest.mark.unit)
        elif "/integration/" in test_path:
            item.add_marker(pytest.mark.integration)


@pytest.fixture
def confidence_checker():
    """Provide a ConfidenceChecker instance."""
    return ConfidenceChecker()


@pytest.fixture
def self_check_protocol():
    """Provide a SelfCheckProtocol instance."""
    return SelfCheckProtocol()


@pytest.fixture
def reflexion_pattern(tmp_path):
    """Provide a ReflexionPattern instance with temp memory dir."""
    return ReflexionPattern(memory_dir=tmp_path)


@pytest.fixture
def token_budget(request):
    """Provide a TokenBudgetManager with complexity from marker or default."""
    complexity = "medium"
    marker = request.node.get_closest_marker("complexity")
    if marker and marker.args:
        complexity = marker.args[0]
    return TokenBudgetManager(complexity=complexity)


@pytest.fixture
def pm_context(tmp_path):
    """Provide PM Agent context with memory directory."""
    memory_dir = tmp_path / "docs" / "memory"
    memory_dir.mkdir(parents=True)

    pm_context_file = memory_dir / "pm_context.md"
    last_session_file = memory_dir / "last_session.md"
    next_actions_file = memory_dir / "next_actions.md"

    pm_context_file.write_text("# PM Context\n")
    last_session_file.write_text("# Last Session\n")
    next_actions_file.write_text("# Next Actions\n")

    return {
        "memory_dir": memory_dir,
        "pm_context": pm_context_file,
        "last_session": last_session_file,
        "next_actions": next_actions_file,
    }

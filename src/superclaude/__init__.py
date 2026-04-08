"""
SuperClaude Framework - AI-enhanced development framework for Claude Code

Provides pytest plugin with confidence checking, self-check validation,
reflexion pattern learning, and parallel execution capabilities.
"""

__version__ = "4.3.0"

from superclaude.pm_agent.confidence import ConfidenceChecker
from superclaude.pm_agent.self_check import SelfCheckProtocol
from superclaude.pm_agent.reflexion import ReflexionPattern

__all__ = [
    "ConfidenceChecker",
    "SelfCheckProtocol",
    "ReflexionPattern",
    "__version__",
]

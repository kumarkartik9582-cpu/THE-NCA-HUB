"""
TokenBudgetManager - Token budget allocation by task complexity

Complexity levels:
- simple: 200 tokens (typo fixes)
- medium: 1000 tokens (bug fixes, small features)
- complex: 2500 tokens (feature implementations)
"""

BUDGET_MAP = {
    "simple": 200,
    "medium": 1000,
    "complex": 2500,
}


class TokenBudgetManager:
    """Manages token budget allocation based on task complexity."""

    def __init__(self, complexity: str = "medium"):
        if complexity not in BUDGET_MAP:
            complexity = "medium"
        self.complexity = complexity
        self.limit = BUDGET_MAP[complexity]
        self.used = 0

    @property
    def remaining(self) -> int:
        return self.limit - self.used

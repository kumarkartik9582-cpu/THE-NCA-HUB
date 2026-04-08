"""
SelfCorrectionEngine - Failure detection, root cause analysis, and prevention

Detects failures, categorizes them, generates prevention rules,
and stores them in reflexion.json for cross-session learning.
"""

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


@dataclass
class RootCause:
    category: str
    description: str
    evidence: list[str]
    prevention_rule: str
    validation_tests: list[str]

    def __repr__(self) -> str:
        return f"RootCause({self.category}, {len(self.validation_tests)} validation tests)"


@dataclass
class FailureEntry:
    id: str
    timestamp: str
    task: str
    failure_type: str
    error_message: str
    root_cause: RootCause
    fixed: bool
    fix_description: str = ""
    recurrence_count: int = 0

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "task": self.task,
            "failure_type": self.failure_type,
            "error_message": self.error_message,
            "root_cause": {
                "category": self.root_cause.category,
                "description": self.root_cause.description,
                "evidence": self.root_cause.evidence,
                "prevention_rule": self.root_cause.prevention_rule,
                "validation_tests": self.root_cause.validation_tests,
            },
            "fixed": self.fixed,
            "fix_description": self.fix_description,
            "recurrence_count": self.recurrence_count,
        }

    @staticmethod
    def from_dict(d: dict) -> "FailureEntry":
        rc = d.get("root_cause", {})
        return FailureEntry(
            id=d["id"],
            timestamp=d["timestamp"],
            task=d["task"],
            failure_type=d["failure_type"],
            error_message=d["error_message"],
            root_cause=RootCause(
                category=rc.get("category", "unknown"),
                description=rc.get("description", ""),
                evidence=rc.get("evidence", []),
                prevention_rule=rc.get("prevention_rule", ""),
                validation_tests=rc.get("validation_tests", []),
            ),
            fixed=d.get("fixed", False),
            fix_description=d.get("fix_description", ""),
            recurrence_count=d.get("recurrence_count", 0),
        )


CATEGORY_KEYWORDS = {
    "validation": ["invalid", "validation", "format", "schema", "required"],
    "dependency": ["import", "module", "package", "dependency", "ModuleNotFoundError"],
    "logic": ["assertion", "expected", "actual", "AssertionError", "wrong", "incorrect"],
    "type": ["TypeError", "type", "int is not", "str is not", "expected str"],
}

VALIDATION_TESTS_MAP = {
    "validation": [
        "Test input is not None",
        "Test input matches expected format",
        "Test boundary values are handled",
    ],
    "dependency": [
        "Test all imports resolve",
        "Test package versions are compatible",
        "Test fallback for missing dependencies",
    ],
    "logic": [
        "Test expected vs actual output",
        "Test edge cases and boundary conditions",
        "Test with empty and null inputs",
    ],
    "type": [
        "Test type annotations match runtime types",
        "Test with wrong types raises TypeError",
        "Test type coercion handles edge cases",
    ],
}


class SelfCorrectionEngine:
    """Detects failures, analyzes root causes, and learns prevention rules."""

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path
        self.reflexion_file = repo_path / "reflexion.json"

        if not self.reflexion_file.exists():
            initial = {
                "version": "1.0",
                "mistakes": [],
                "prevention_rules": [],
            }
            self.reflexion_file.write_text(json.dumps(initial, indent=2))

    def detect_failure(self, result: dict) -> bool:
        return result.get("status") in ("failed", "error")

    def analyze_root_cause(self, task: str, failure: dict) -> RootCause:
        error = failure.get("error", "")
        stack_trace = failure.get("stack_trace", "")
        category = self._categorize_failure(error, stack_trace)
        similar = self._find_similar_failures(task, error)
        prevention_rule = self._generate_prevention_rule(category, error, similar)
        validation_tests = self._generate_validation_tests(category, error)

        return RootCause(
            category=category,
            description=f"{category} error: {error[:100]}",
            evidence=[error] if error else [],
            prevention_rule=prevention_rule,
            validation_tests=validation_tests,
        )

    def learn_and_prevent(self, task: str, failure: dict, root_cause: RootCause) -> None:
        data = json.loads(self.reflexion_file.read_text())

        error_msg = failure.get("error", failure.get("type", ""))
        entry_hash = hashlib.md5(f"{task}:{error_msg}".encode()).hexdigest()[:8]

        # Check for duplicates
        for existing in data["mistakes"]:
            if existing["id"] == entry_hash:
                existing["recurrence_count"] = existing.get("recurrence_count", 0) + 1
                self.reflexion_file.write_text(json.dumps(data, indent=2))
                return

        entry = FailureEntry(
            id=entry_hash,
            timestamp=datetime.now(timezone.utc).isoformat(),
            task=task,
            failure_type=root_cause.category,
            error_message=str(error_msg),
            root_cause=root_cause,
            fixed=False,
        )

        data["mistakes"].append(entry.to_dict())
        if root_cause.prevention_rule not in data["prevention_rules"]:
            data["prevention_rules"].append(root_cause.prevention_rule)

        self.reflexion_file.write_text(json.dumps(data, indent=2))

    def check_against_past_mistakes(self, task: str) -> list[FailureEntry]:
        return self._find_similar_failures(task, "")

    def get_prevention_rules(self) -> list[str]:
        data = json.loads(self.reflexion_file.read_text())
        return data.get("prevention_rules", [])

    def _categorize_failure(self, error: str, traceback: str) -> str:
        combined = f"{error} {traceback}".lower()
        for category, keywords in CATEGORY_KEYWORDS.items():
            if any(kw.lower() in combined for kw in keywords):
                return category
        return "unknown"

    def _find_similar_failures(self, task: str, error: str) -> list[FailureEntry]:
        data = json.loads(self.reflexion_file.read_text())
        task_words = set(task.lower().split())
        similar = []

        for m in data.get("mistakes", []):
            past_task = m.get("task", "")
            past_words = set(past_task.lower().split())
            overlap = task_words & past_words
            if len(overlap) >= 2:
                similar.append(FailureEntry.from_dict(m))

        return similar

    def _generate_prevention_rule(self, category: str, error: str, similar: list[FailureEntry]) -> str:
        base = f"ALWAYS check for {category} issues before proceeding"
        if similar:
            base += f" (this pattern has occurred {len(similar)} times before)"
        return base

    def _generate_validation_tests(self, category: str, error: str) -> list[str]:
        if category in VALIDATION_TESTS_MAP:
            return VALIDATION_TESTS_MAP[category]
        return [f"Test that the operation handles: {error[:50]}"]

"""
ReflexionPattern - Error learning and prevention

Records errors and their solutions for cross-session pattern matching.
When a similar error is encountered, suggests known solutions.
"""

import json
from pathlib import Path


class ReflexionPattern:
    """Error learning and prevention through reflexion."""

    def __init__(self, memory_dir: Path | None = None):
        self._memory_dir = memory_dir
        self._errors: list[dict] = []

    def record_error(self, error_info: dict) -> None:
        """Record an error with optional solution for future prevention."""
        self._errors.append(error_info)

        if self._memory_dir is not None:
            reflexion_file = self._memory_dir / "reflexion.jsonl"
            try:
                with open(reflexion_file, "a") as f:
                    f.write(json.dumps(error_info) + "\n")
            except OSError:
                pass

    def get_solution(self, error_signature: str) -> str | None:
        """Look up a known solution for a given error signature.

        Returns solution string if found, None otherwise.
        """
        for error in self._errors:
            solution = error.get("solution")
            if not solution:
                continue
            error_type = error.get("error_type", "")
            error_msg = error.get("error_message", "")
            if error_type in error_signature or error_msg in error_signature:
                return solution

        if self._memory_dir is not None:
            reflexion_file = self._memory_dir / "reflexion.jsonl"
            if reflexion_file.exists():
                try:
                    for line in reflexion_file.read_text().strip().split("\n"):
                        if not line:
                            continue
                        entry = json.loads(line)
                        solution = entry.get("solution")
                        if not solution:
                            continue
                        error_type = entry.get("error_type", "")
                        error_msg = entry.get("error_message", "")
                        if error_type in error_signature or error_msg in error_signature:
                            return solution
                except (json.JSONDecodeError, OSError):
                    pass

        return None

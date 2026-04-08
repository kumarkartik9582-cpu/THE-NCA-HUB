"""
SelfCheckProtocol - Post-implementation evidence-based validation

Validates implementations against four questions:
1. Are tests passing? (with actual output, not just claims)
2. Are all requirements met?
3. Are all assumptions verified?
4. Is there evidence for all claims?

Also detects hallucinations: claims without evidence.
"""

UNCERTAINTY_WORDS = ["probably", "might", "maybe", "should work", "i think", "likely"]
REQUIRED_EVIDENCE = ["test_results", "code_changes", "validation"]


class SelfCheckProtocol:
    """Post-implementation validation protocol."""

    def validate(self, implementation: dict) -> tuple:
        """Validate an implementation.

        Returns (passed: bool, issues: list[str]).
        """
        issues = []

        if not self._check_tests_passing(implementation):
            issues.append("❌ Tests not passing or missing test output")

        unmet = self._check_requirements_met(implementation)
        for req in unmet:
            issues.append(f"❌ Unmet requirement: {req}")

        unverified = self._check_assumptions_verified(implementation)
        for assumption in unverified:
            issues.append(f"❌ Unverified assumption: {assumption}")

        missing = self._check_evidence_exists(implementation)
        for evidence_type in missing:
            issues.append(f"❌ Missing evidence: {evidence_type}")

        hallucinations = self._detect_hallucinations(implementation)
        for h in hallucinations:
            issues.append(f"⚠️ Hallucination detected: {h}")

        passed = len(issues) == 0
        return passed, issues

    def _check_tests_passing(self, implementation: dict) -> bool:
        """Check tests are passing AND have actual output."""
        tests_passed = implementation.get("tests_passed", False)
        test_output = implementation.get("test_output", "")
        return tests_passed and bool(test_output)

    def _check_requirements_met(self, implementation: dict) -> list:
        """Return list of unmet requirements."""
        requirements = implementation.get("requirements", [])
        requirements_met = implementation.get("requirements_met", [])
        return [r for r in requirements if r not in requirements_met]

    def _check_assumptions_verified(self, implementation: dict) -> list:
        """Return list of unverified assumptions."""
        assumptions = implementation.get("assumptions", [])
        verified = implementation.get("assumptions_verified", [])
        return [a for a in assumptions if a not in verified]

    def _check_evidence_exists(self, implementation: dict) -> list:
        """Return list of missing evidence types."""
        evidence = implementation.get("evidence", {}) or {}
        return [key for key in REQUIRED_EVIDENCE if not evidence.get(key)]

    def _detect_hallucinations(self, implementation: dict) -> list:
        """Detect potential hallucinations in the implementation."""
        detected = []

        # Tests passing without output
        if implementation.get("tests_passed") and not implementation.get("test_output"):
            detected.append("Claims tests pass without showing output")

        # Complete without evidence
        if implementation.get("status") == "complete" and not implementation.get("evidence"):
            detected.append("Claims complete without evidence")

        # Complete despite failing tests
        if implementation.get("status") == "complete" and implementation.get("tests_passed") is False:
            detected.append("Claims complete despite failing tests")

        # Ignored errors/warnings
        if implementation.get("status") == "complete":
            if implementation.get("errors") or implementation.get("warnings"):
                detected.append("Claims complete but has unaddressed errors/warnings")

        # Uncertainty language in description
        description = implementation.get("description", "")
        if description:
            lower_desc = description.lower()
            if any(word in lower_desc for word in UNCERTAINTY_WORDS):
                detected.append("Uncertainty language detected in description")

        return detected

    def format_report(self, passed: bool, issues: list) -> str:
        """Format a validation report."""
        if passed:
            return "✅ Self-Check PASSED: All validations passed."

        lines = ["❌ Self-Check FAILED:"]
        for issue in issues:
            lines.append(f"  {issue}")
        return "\n".join(lines)

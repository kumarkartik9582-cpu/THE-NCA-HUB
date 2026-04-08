"""
ConfidenceChecker - Pre-execution confidence assessment

Assesses confidence before starting work:
- >=90%: Proceed with implementation
- 70-89%: Present alternatives, continue investigation
- <70%: STOP and ask questions

Weights:
- No duplicates: 25%
- Architecture compliant: 25%
- Official docs verified: 20%
- OSS reference found: 15%
- Root cause identified: 15%
"""


class ConfidenceChecker:
    """Pre-execution confidence assessment tool."""

    WEIGHTS = {
        "no_duplicates": 0.25,
        "architecture_compliant": 0.25,
        "has_official_docs": 0.20,
        "has_oss_reference": 0.15,
        "root_cause_identified": 0.15,
    }

    def assess(self, context: dict) -> float:
        """Assess confidence based on context checks.

        Returns a float between 0.0 and 1.0.
        Records confidence_checks list in the context dict.
        """
        checks = []
        score = 0.0

        check_methods = [
            ("no_duplicates", self._no_duplicates),
            ("architecture_compliant", self._architecture_compliant),
            ("has_official_docs", self._has_official_docs),
            ("has_oss_reference", self._has_oss_reference),
            ("root_cause_identified", self._root_cause_identified),
        ]

        for name, method in check_methods:
            passed = method(context)
            weight = self.WEIGHTS[name]
            if passed:
                score += weight
                checks.append(f"✅ {name}: passed ({weight:.0%})")
            else:
                checks.append(f"❌ {name}: failed ({weight:.0%})")

        context["confidence_checks"] = checks
        return round(score, 2)

    def get_recommendation(self, confidence: float) -> str:
        """Return recommendation text based on confidence level."""
        if confidence >= 0.9:
            return "High confidence. Proceed with implementation."
        elif confidence >= 0.7:
            return "Medium confidence. Continue investigation before proceeding."
        else:
            return "Low confidence. STOP and ask clarifying questions."

    def _no_duplicates(self, context: dict) -> bool:
        return context.get("duplicate_check_complete", False) is True

    def _architecture_compliant(self, context: dict) -> bool:
        return context.get("architecture_check_complete", False) is True

    def _has_official_docs(self, context: dict) -> bool:
        return context.get("official_docs_verified", False) is True

    def _has_oss_reference(self, context: dict) -> bool:
        return context.get("oss_reference_complete", False) is True

    def _root_cause_identified(self, context: dict) -> bool:
        return context.get("root_cause_identified", False) is True

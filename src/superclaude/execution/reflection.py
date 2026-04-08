"""
ReflectionEngine - 3-stage pre-execution confidence assessment

Stages:
1. Requirement clarity analysis
2. Past mistake pattern detection
3. Context sufficiency validation

Weights: clarity=0.4, mistakes=0.3, context=0.3
"""

import json
from dataclasses import dataclass, field
from pathlib import Path

ACTION_VERBS = [
    "create", "add", "implement", "fix", "update", "remove",
    "delete", "refactor", "rename", "move", "extract", "merge",
    "build", "configure", "setup", "migrate", "convert", "validate",
]
VAGUE_WORDS = ["improve", "change", "modify", "adjust", "handle", "deal with", "something"]


@dataclass
class ReflectionResult:
    stage: str
    score: float
    evidence: list[str]
    concerns: list[str]

    def __repr__(self) -> str:
        if self.score > 0.7:
            icon = "✅"
        elif self.score >= 0.4:
            icon = "⚠️"
        else:
            icon = "❌"
        return f"{icon} {self.stage}: {self.score:.2f}"


@dataclass
class ConfidenceScore:
    requirement_clarity: ReflectionResult
    mistake_check: ReflectionResult
    context_ready: ReflectionResult
    confidence: float
    should_proceed: bool
    blockers: list[str] = field(default_factory=list)
    recommendations: list[str] = field(default_factory=list)


class ReflectionEngine:
    """Pre-execution reflection engine for confidence assessment."""

    WEIGHTS = {"clarity": 0.4, "mistakes": 0.3, "context": 0.3}

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path
        self.memory_path = repo_path / "docs" / "memory"
        self.memory_path.mkdir(parents=True, exist_ok=True)

    def reflect(self, task: str, context: dict | None = None) -> ConfidenceScore:
        """Reflect on a task and return a confidence score."""
        clarity = self._reflect_clarity(task, context)
        mistakes = self._detect_mistakes(task, context)
        ctx_ready = self._check_context_ready(context)

        confidence = (
            clarity.score * self.WEIGHTS["clarity"]
            + mistakes.score * self.WEIGHTS["mistakes"]
            + ctx_ready.score * self.WEIGHTS["context"]
        )

        blockers = []
        recommendations = []
        for r in [clarity, mistakes, ctx_ready]:
            if r.score < 0.4:
                blockers.extend(r.concerns)
            elif r.score < 0.7:
                recommendations.extend(r.concerns)

        should_proceed = confidence >= 0.7

        return ConfidenceScore(
            requirement_clarity=clarity,
            mistake_check=mistakes,
            context_ready=ctx_ready,
            confidence=round(confidence, 3),
            should_proceed=should_proceed,
            blockers=blockers,
            recommendations=recommendations,
        )

    def _reflect_clarity(self, task: str, context: dict | None) -> ReflectionResult:
        """Score task clarity based on specificity, action verbs, detail."""
        score = 0.5
        evidence = []
        concerns = []

        words = task.lower().split()

        # Length check
        if len(words) < 5:
            score -= 0.2
            concerns.append("Task is very brief and may lack detail")
        elif len(words) >= 10:
            score += 0.1
            evidence.append("Task has good level of detail")

        # Action verb check
        has_action = any(verb in task.lower() for verb in ACTION_VERBS)
        if has_action:
            score += 0.2
            evidence.append("Task has specific action verb")
        else:
            concerns.append("No specific action verb found")

        # Vague language check
        has_vague = any(word in task.lower() for word in VAGUE_WORDS)
        if has_vague:
            score -= 0.2
            concerns.append("Task contains vague language")

        # File/path reference check
        if "." in task and "/" in task or ".py" in task or ".js" in task:
            score += 0.1
            evidence.append("Task references specific files")

        score = max(0.0, min(1.0, score))

        return ReflectionResult(
            stage="Requirement Clarity",
            score=round(score, 2),
            evidence=evidence,
            concerns=concerns,
        )

    def _detect_mistakes(self, task: str, context: dict | None) -> ReflectionResult:
        """Check reflexion memory for similar past mistakes."""
        reflexion_file = self.memory_path / "reflexion.json"

        if not reflexion_file.exists():
            return ReflectionResult(
                stage="Mistake Detection",
                score=1.0,
                evidence=["No past mistakes recorded (reflexion.json not found)"],
                concerns=[],
            )

        try:
            data = json.loads(reflexion_file.read_text())
            mistakes = data.get("mistakes", [])
        except (json.JSONDecodeError, OSError):
            return ReflectionResult(
                stage="Mistake Detection",
                score=1.0,
                evidence=["No past mistakes found"],
                concerns=[],
            )

        if not mistakes:
            return ReflectionResult(
                stage="Mistake Detection",
                score=1.0,
                evidence=["No past mistakes recorded"],
                concerns=[],
            )

        task_words = set(task.lower().split())
        similar = []
        for m in mistakes:
            past_task = m.get("task", "")
            past_words = set(past_task.lower().split())
            overlap = task_words & past_words
            if len(overlap) >= 2:
                similar.append(m)

        if similar:
            score = max(0.3, 1.0 - 0.2 * len(similar))
            return ReflectionResult(
                stage="Mistake Detection",
                score=round(score, 2),
                evidence=[f"Found {len(similar)} past mistakes"],
                concerns=[f"Similar past mistake found: {s.get('task', 'unknown')}" for s in similar],
            )

        return ReflectionResult(
            stage="Mistake Detection",
            score=1.0,
            evidence=["No similar past mistakes found"],
            concerns=[],
        )

    def _check_context_ready(self, context: dict | None) -> ReflectionResult:
        """Check if sufficient context is available."""
        if context is None:
            return ReflectionResult(
                stage="Context Readiness",
                score=0.3,
                evidence=[],
                concerns=["No context provided - missing project context"],
            )

        score = 0.3
        evidence = []
        concerns = []

        if context.get("project_index"):
            score += 0.2
            evidence.append("Project index available")
        else:
            concerns.append("Missing project index context")

        if context.get("current_branch"):
            score += 0.15
            evidence.append(f"On branch: {context['current_branch']}")

        if context.get("git_status"):
            score += 0.15
            evidence.append("Git status available")

        # Check for PROJECT_INDEX.md freshness
        index_file = self.repo_path / "PROJECT_INDEX.md"
        if index_file.exists():
            score += 0.2
            evidence.append("PROJECT_INDEX.md exists")

        score = max(0.0, min(1.0, score))

        return ReflectionResult(
            stage="Context Readiness",
            score=round(score, 2),
            evidence=evidence,
            concerns=concerns,
        )

    def record_reflection(self, task: str, confidence: ConfidenceScore, action: str) -> None:
        """Persist reflection to log file."""
        log_file = self.memory_path / "reflection_log.json"

        if log_file.exists():
            try:
                data = json.loads(log_file.read_text())
            except (json.JSONDecodeError, OSError):
                data = {"reflections": []}
        else:
            data = {"reflections": []}

        entry = {
            "task": task,
            "confidence": confidence.confidence,
            "should_proceed": confidence.should_proceed,
            "action": action,
            "clarity_score": confidence.requirement_clarity.score,
            "mistake_score": confidence.mistake_check.score,
            "context_score": confidence.context_ready.score,
        }

        data["reflections"].append(entry)
        log_file.write_text(json.dumps(data, indent=2))

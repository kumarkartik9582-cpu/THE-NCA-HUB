"""
Smart execution orchestrator combining reflection, parallel execution,
and self-correction into unified execute functions.
"""

from pathlib import Path
from typing import Any, Callable

from superclaude.execution.parallel import ParallelExecutor, Task
from superclaude.execution.reflection import ReflectionEngine
from superclaude.execution.self_correction import SelfCorrectionEngine


def intelligent_execute(
    task: str,
    operations: list[Callable],
    context: dict | None = None,
    repo_path: Path | None = None,
    auto_correct: bool = True,
) -> dict:
    """Execute operations with reflection, parallel execution, and self-correction.

    Returns dict with status, confidence, and results.
    """
    if repo_path is None:
        repo_path = Path.cwd()

    # Phase 1: Reflection
    engine = ReflectionEngine(repo_path)
    confidence = engine.reflect(task, context)

    if not confidence.should_proceed:
        return {
            "status": "blocked",
            "confidence": confidence.confidence,
            "blockers": confidence.blockers,
            "recommendations": confidence.recommendations,
        }

    # Phase 2: Parallel execution
    executor = ParallelExecutor()
    tasks = [
        Task(
            id=f"op_{i}",
            description=f"Operation {i}",
            execute=op,
            depends_on=[],
        )
        for i, op in enumerate(operations)
    ]

    plan = executor.plan(tasks)
    results = executor.execute(plan)

    # Check for failures
    failures = {tid: t for tid, t in zip(results.keys(), tasks) if t.error is not None}

    if failures and auto_correct:
        # Phase 3: Self-correction
        correction = SelfCorrectionEngine(repo_path)
        for tid, failed_task in failures.items():
            failure_info = {
                "error": str(failed_task.error),
                "stack_trace": "",
                "status": "failed",
            }
            root_cause = correction.analyze_root_cause(task, failure_info)
            correction.learn_and_prevent(task, failure_info, root_cause)

        return {
            "status": "partial_failure",
            "confidence": confidence.confidence,
            "results": results,
            "failures": list(failures.keys()),
        }

    if failures:
        return {
            "status": "partial_failure",
            "confidence": confidence.confidence,
            "results": results,
            "failures": list(failures.keys()),
        }

    return {
        "status": "success",
        "confidence": confidence.confidence,
        "results": results,
    }


def quick_execute(operations: list[Callable]) -> list:
    """Run operations and return results as a list."""
    return [op() for op in operations]


def safe_execute(
    task: str,
    operation: Callable,
    context: dict | None = None,
) -> Any:
    """Execute a single operation with confidence check.

    Raises RuntimeError if confidence is too low.
    """
    repo_path = Path.cwd()
    engine = ReflectionEngine(repo_path)
    confidence = engine.reflect(task, context)

    if not confidence.should_proceed:
        raise RuntimeError(
            f"Blocked by low confidence ({confidence.confidence:.2f}): "
            + "; ".join(confidence.blockers)
        )

    return operation()

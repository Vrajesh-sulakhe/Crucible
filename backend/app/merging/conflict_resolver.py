"""merging/conflict_resolver.py — STAGE 5 (deterministic trust layer).

Multi-source conflict detection, authority resolution, and transparent explanation engine.
"""

from __future__ import annotations

from typing import Any
from app.schemas.models import Candidate, FieldDecision, FieldStatus
from app.validation.rules import validate_field
from .source_ranking import compute_candidate_score


def _values_match(v1: Any, v2: Any, tolerance: float = 0.01) -> bool:
    """Check if two normalized values are semantically equivalent."""
    if v1 is None and v2 is None:
        return True
    if v1 is None or v2 is None:
        return False
    if isinstance(v1, (int, float)) and isinstance(v2, (int, float)):
        if v1 == 0 and v2 == 0:
            return True
        denom = max(abs(v1), abs(v2), 1e-6)
        return (abs(v1 - v2) / denom) <= tolerance
    return str(v1).strip().lower() == str(v2).strip().lower()


def resolve_field(
    field_name: str,
    candidates: list[Candidate],
    cross_field_notes: list[str] | None = None,
) -> FieldDecision:
    """Resolve a field across multiple candidate claims from diverse sources."""
    if not candidates:
        return FieldDecision(
            field=field_name,
            final_value=None,
            status=FieldStatus.MISSING,
            confidence=0.0,
            candidates=[],
            validation_notes=["No data source provided a value for this field."],
            decision_reason="Field is missing from all ingested datasheets and catalogs.",
        )

    # Validate and score every candidate
    scored_candidates: list[tuple[Candidate, float, bool, list[str]]] = []
    for c in candidates:
        val_ok, val_notes = validate_field(field_name, c.normalized_value)
        total_notes = list(val_notes)
        if cross_field_notes:
            total_notes.extend(cross_field_notes)
        score = compute_candidate_score(c, val_ok, total_notes)
        scored_candidates.append((c, score, val_ok, total_notes))

    # Sort candidates by score descending
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    best_candidate, best_score, best_val_ok, best_notes = scored_candidates[0]

    # Check for divergence across candidates
    distinct_values: list[Any] = []
    for c, _, _, _ in scored_candidates:
        if c.normalized_value is not None:
            if not any(_values_match(c.normalized_value, dv) for dv in distinct_values):
                distinct_values.append(c.normalized_value)

    # Case 1: Single distinct value or single candidate
    if len(distinct_values) <= 1:
        if best_val_ok and best_score >= 0.70:
            status = FieldStatus.VALIDATED
            reason = (
                f"Value verified from {best_candidate.evidence.source_name} "
                f"({best_candidate.evidence.source_type.value.replace('_', ' ')})."
            )
            if len(candidates) > 1:
                reason = f"Consistent agreement across {len(candidates)} sources with high confidence."
        else:
            status = FieldStatus.NEEDS_REVIEW
            reason = f"Low confidence ({best_score:.2f}) or validation warnings present; flagged for verification."

        return FieldDecision(
            field=field_name,
            final_value=best_candidate.normalized_value,
            status=status,
            confidence=best_score,
            candidates=candidates,
            validation_notes=best_notes,
            decision_reason=reason,
        )

    # Case 2: Multi-source conflict (different values detected)
    second_candidate, second_score, _, _ = scored_candidates[1]
    score_gap = best_score - second_score

    # Check if top candidate has clear authority advantage
    if score_gap >= 0.15 and best_val_ok:
        status = FieldStatus.CONFLICT_RESOLVED
        reason = (
            f"Conflict resolved: Selected {best_candidate.evidence.source_name} "
            f"({best_candidate.evidence.source_type.value.replace('_', ' ')}, score {best_score:.2f}) "
            f"over {second_candidate.evidence.source_name} "
            f"({second_candidate.evidence.source_type.value.replace('_', ' ')}, score {second_score:.2f}) "
            f"due to higher source authority and validation compliance."
        )
    else:
        status = FieldStatus.NEEDS_REVIEW
        reason = (
            f"Significant disagreement between {best_candidate.evidence.source_name} "
            f"({best_candidate.raw_value}) and {second_candidate.evidence.source_name} "
            f"({second_candidate.raw_value}) with comparable confidence. Human review required."
        )

    return FieldDecision(
        field=field_name,
        final_value=best_candidate.normalized_value,
        status=status,
        confidence=best_score,
        candidates=candidates,
        validation_notes=best_notes,
        decision_reason=reason,
    )

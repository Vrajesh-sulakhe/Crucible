"""merging/source_ranking.py — STAGE 5 (deterministic trust layer).

Calculates mathematical confidence score for a candidate value:
  Confidence = w_extraction * C_ext + w_authority * A_source + w_validation * V_score

Bounded strictly in [0.0, 1.0].
"""

from __future__ import annotations

from app.core.config import settings
from app.schemas.models import Candidate, SOURCE_AUTHORITY, SourceType


def compute_candidate_score(
    candidate: Candidate,
    validation_ok: bool,
    validation_notes: list[str] | None = None,
) -> float:
    """Compute formula-based confidence score for one candidate."""
    # 1. Extraction confidence (from LLM / parser, 0.0-1.0)
    c_ext = float(candidate.evidence.extraction_confidence)
    c_ext = max(0.0, min(1.0, c_ext))

    # 2. Source authority ranking (0.0-1.0)
    st = candidate.evidence.source_type
    a_source = SOURCE_AUTHORITY.get(st, 0.5)

    # 3. Validation score (1.0 = flawless, 0.5 = mild warning, 0.0 = invalid)
    if validation_ok and not validation_notes:
        v_score = 1.0
    elif validation_ok and validation_notes:
        v_score = 0.7
    else:
        v_score = 0.2

    # Weighted formula
    raw_score = (
        settings.conf_w_extraction * c_ext +
        settings.conf_w_authority * a_source +
        settings.conf_w_validation * v_score
    )

    return round(max(0.0, min(1.0, raw_score)), 3)

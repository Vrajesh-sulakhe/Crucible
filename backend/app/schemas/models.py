"""schemas/models.py — THE frozen interface for the whole pipeline.

This module defines the data contracts that flow between every stage:
    Evidence -> Candidate -> FieldDecision -> ProductRecord

Rules of this file (do not break them):
  1. PURE DATA ONLY. No business logic, no classification, no I/O.
     (Confidence classification lives in merging/source_ranking.py;
      overall status/confidence is computed in services/pipeline.py.)
  2. NO INTERNAL IMPORTS. This is a leaf module — it imports only stdlib
     and pydantic. Anything may import THIS; it imports nothing from app/.
     This is what prevents circular imports as the pipeline grows.
  3. CHANGING A FIELD HERE IS A CONTRACT CHANGE. It ripples to every stage
     and the frontend (lib/types.ts mirrors this). Change it only with a
     reason, and update the mirror. "Freeze the interfaces, not the ideas."

Serialization note: enums are str-enums, so model_dump(mode="json") emits
plain strings ("manufacturer_datasheet", "validated") — clean for the API
and the React frontend, no enum objects leaking across the wire.
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Source identity + authority
# ---------------------------------------------------------------------------

class SourceType(str, Enum):
    """Where a claim about a field came from. str-enum => JSON-friendly."""
    MANUFACTURER_DATASHEET = "manufacturer_datasheet"
    TECHNICAL_CATALOG = "technical_catalog"
    ERP_EXPORT = "erp_export"
    WEBSITE = "website"
    CSV = "csv"


# Tuning knob: how much we trust each source class, 0.0–1.0.
# Lives HERE (not config.py) because it is part of the data contract that
# resolve/ ranking reason about; the *confidence weights* (CONF_W_*) that
# COMBINE authority with extraction+validation live in core/config.py.
SOURCE_AUTHORITY: dict[SourceType, float] = {
    SourceType.MANUFACTURER_DATASHEET: 1.0,
    SourceType.TECHNICAL_CATALOG: 0.85,
    SourceType.ERP_EXPORT: 0.75,
    SourceType.CSV: 0.60,
    SourceType.WEBSITE: 0.40,
}


# ---------------------------------------------------------------------------
# Field lifecycle status
# ---------------------------------------------------------------------------

class FieldStatus(str, Enum):
    """The resolved state of a single field (and, reused, of a whole product)."""
    VALIDATED = "validated"                  # single consistent source, high confidence
    CONFLICT_RESOLVED = "conflict_resolved"  # sources disagreed; a winner was chosen
    NEEDS_REVIEW = "needs_review"            # low confidence or unresolved doubt
    MISSING = "missing"                      # no source contained this field


# ---------------------------------------------------------------------------
# The four nested contracts (bottom-up)
# ---------------------------------------------------------------------------

class Evidence(BaseModel):
    """A citation: WHERE a value was seen. The unit of explainability."""
    source_name: str
    source_type: SourceType
    page: Optional[int] = Field(default=None, ge=1)   # None for non-paginated sources (CSV)
    snippet: str                                       # VERBATIM quote from the source
    extraction_confidence: float = Field(ge=0.0, le=1.0)  # how sure the LLM was (stage 2)


class Candidate(BaseModel):
    """One source's claim about one field, normalized.

    A field collects a LIST of these. Conflict detection is simply
    'do the normalized values disagree?' — there is no separate conflict
    module; it falls out of this structure.
    """
    raw_value: Any                                   # exactly as written in the source
    normalized_value: Optional[float | str] = None   # canonical (mm/kg/kN/rpm) or cleaned text
    unit: Optional[str] = None                       # canonical unit, if numeric
    evidence: Evidence


class FieldDecision(BaseModel):
    """The resolved answer for one field, with its full justification.

    This is what the Evidence Inspector renders: final value + the candidates
    it was chosen from + validation notes + a human-readable reason.
    """
    field: str
    final_value: Any
    status: FieldStatus
    confidence: float = Field(ge=0.0, le=1.0)        # the FORMULA output, not the LLM's self-rating
    candidates: list[Candidate] = []
    validation_notes: list[str] = []
    decision_reason: str


class ProductRecord(BaseModel):
    """A whole product: every field decided, plus roll-up status.

    The wire format for /products, /export, and the baked golden store.
    overall_* are computed by services/pipeline.py, never set by a stage.
    """
    sku: str
    product_name: Optional[str] = None
    fields: dict[str, FieldDecision] = {}
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    overall_status: FieldStatus = FieldStatus.MISSING

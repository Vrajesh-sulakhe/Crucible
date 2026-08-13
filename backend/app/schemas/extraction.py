"""schemas/extraction.py — the LLM-facing output contract (stage 2).

Kept SEPARATE from models.py on purpose:
  - models.py   = the clean INTERNAL contract (Evidence/Candidate/FieldDecision/...).
  - extraction.py = the RAW shape the LLM is allowed to return.
A messy or partial model response stays in this type and can never pollute the
internal types; pipeline.py translates one into the other.

Design rules:
  1. PURE DATA. No LLM client, no I/O, no unit policy. Safe to import with NO
     API key set (required by baked mode on the public host).
  2. The attribute names of BearingExtraction ARE the canonical field vocabulary.
     Downstream stages iterate BearingExtraction.model_fields — there is no
     second list to keep in sync. The assert below enforces that every field is
     classified as numeric or text, so a new field can't slip in unclassified.
  3. The LLM returns RAW strings (it must NOT convert units). value is always
     Optional[str]; canonicalization happens in stage 3.
  4. extra="forbid" is a hallucination guard: the model cannot sneak in keys
     that aren't in the schema. Partial pages are fine — every field defaults
     to an empty RawField(value=None), which the pipeline skips.

NOTE (multi-product catalogs, NOT built yet): this model is one product per
page/block, matched to the CSV by sku. If your demo PDFs turn out to be
multi-product catalogs (50 SKUs/page), wrap this in a list model and group by
the extracted sku instead of by substring. Build the simple version first.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RawField(BaseModel):
    """One value as the LLM saw it, plus its citation and self-confidence."""
    value: Optional[str] = None                 # raw text exactly as written (no unit conversion)
    evidence: Optional[str] = None              # VERBATIM quote from the page
    page: Optional[int] = Field(default=None, ge=1)
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)


class BearingExtraction(BaseModel):
    """The structured extraction result for ONE product from ONE page/block.

    Attribute names == canonical field names used by every downstream stage.
    """
    # identity / text
    sku: RawField = Field(default_factory=RawField)
    product_name: RawField = Field(default_factory=RawField)
    category: RawField = Field(default_factory=RawField)
    subcategory: RawField = Field(default_factory=RawField)

    # quantities (raw strings here; canonicalized in stage 3)
    bore_diameter: RawField = Field(default_factory=RawField)
    outer_diameter: RawField = Field(default_factory=RawField)
    width: RawField = Field(default_factory=RawField)
    weight: RawField = Field(default_factory=RawField)
    dynamic_load_rating: RawField = Field(default_factory=RawField)
    static_load_rating: RawField = Field(default_factory=RawField)
    limiting_speed: RawField = Field(default_factory=RawField)

    # more text
    material: RawField = Field(default_factory=RawField)
    applications: RawField = Field(default_factory=RawField)
    standards: RawField = Field(default_factory=RawField)


# ---------------------------------------------------------------------------
# Derived vocabulary — single source of truth = the model above.
# ---------------------------------------------------------------------------

FIELD_NAMES: tuple[str, ...] = tuple(BearingExtraction.model_fields.keys())

NUMERIC_FIELDS: frozenset[str] = frozenset({
    "bore_diameter", "outer_diameter", "width", "weight",
    "dynamic_load_rating", "static_load_rating", "limiting_speed",
})

TEXT_FIELDS: frozenset[str] = frozenset({
    "sku", "product_name", "category", "subcategory",
    "material", "applications", "standards",
})

# Guard: every model field must be classified, nothing duplicated, nothing extra.
# If you add a field to BearingExtraction, put it in NUMERIC_FIELDS or TEXT_FIELDS
# or this import fails — that is the point.
assert NUMERIC_FIELDS | TEXT_FIELDS == set(FIELD_NAMES), (
    "Field classification out of sync with BearingExtraction. "
    f"unclassified={set(FIELD_NAMES) - NUMERIC_FIELDS - TEXT_FIELDS}, "
    f"unknown={(NUMERIC_FIELDS | TEXT_FIELDS) - set(FIELD_NAMES)}"
)
assert not (NUMERIC_FIELDS & TEXT_FIELDS), "A field is marked both numeric and text."

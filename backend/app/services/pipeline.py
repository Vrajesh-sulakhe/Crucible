"""services/pipeline.py — End-to-End Orchestrator (Stages 1 through 6).

Coordinates:
  PARSE -> EXTRACT (LLM) -> NORMALIZE -> VALIDATE -> RESOLVE -> EXPORT
"""

from __future__ import annotations

import logging
from typing import Optional

from app.core.config import settings
from app.core.store import store
from app.extraction.llm_extractor import extract_block
from app.merging.conflict_resolver import resolve_field
from app.normalization import cleaners, units
from app.parsing.csv_parser import parse_csv_content
from app.parsing.pdf_parser import PageBlock, parse_pdf_bytes
from app.schemas.extraction import FIELD_NAMES, NUMERIC_FIELDS, TEXT_FIELDS, BearingExtraction
from app.schemas.models import (
    Candidate,
    Evidence,
    FieldDecision,
    FieldStatus,
    ProductRecord,
    SourceType,
)
from app.validation.rules import cross_field_checks
from .baked import load_golden_records

logger = logging.getLogger(__name__)


def _build_candidate_from_csv(field_name: str, raw_value: any, source_name: str) -> Candidate:
    """Construct Candidate from CSV string."""
    if field_name in NUMERIC_FIELDS:
        norm_val, unit = units.normalize(field_name, raw_value)
    else:
        norm_val = cleaners.clean(field_name, raw_value)
        unit = None

    return Candidate(
        raw_value=raw_value,
        normalized_value=norm_val,
        unit=unit,
        evidence=Evidence(
            source_name=source_name,
            source_type=SourceType.CSV,
            page=None,
            snippet=f"{field_name}: {raw_value}",
            extraction_confidence=0.90,
        ),
    )


def _build_candidate_from_raw_field(
    field_name: str,
    raw_field,
    source_name: str,
    source_type: str,
) -> Candidate:
    """Construct Candidate from LLM extracted RawField."""
    raw_val = raw_field.value
    if field_name in NUMERIC_FIELDS:
        norm_val, unit = units.normalize(field_name, raw_val)
    else:
        norm_val = cleaners.clean(field_name, raw_val)
        unit = None

    # Map source type string to enum
    st_enum = SourceType.MANUFACTURER_DATASHEET
    for st in SourceType:
        if st.value == source_type:
            st_enum = st
            break

    return Candidate(
        raw_value=raw_val,
        normalized_value=norm_val,
        unit=unit,
        evidence=Evidence(
            source_name=source_name,
            source_type=st_enum,
            page=raw_field.page,
            snippet=raw_field.evidence or f"Extracted {field_name}: {raw_val}",
            extraction_confidence=raw_field.confidence,
        ),
    )


def run_pipeline(
    csv_content: Optional[str] = None,
    pdf_files: Optional[list[tuple[str, bytes]]] = None,
) -> list[ProductRecord]:
    """Execute full 6-stage product intelligence pipeline live on uploaded inputs."""
    # candidates_by_sku: SKU -> field_name -> list[Candidate]
    sku_field_candidates: dict[str, dict[str, list[Candidate]]] = {}

    # Stage 1A: Parse CSV
    if csv_content:
        csv_rows = parse_csv_content(csv_content)
        for row in csv_rows:
            raw_sku = row.get("sku")
            if not raw_sku:
                continue
            clean_sku_key = cleaners.clean_sku(raw_sku) or raw_sku
            if clean_sku_key not in sku_field_candidates:
                sku_field_candidates[clean_sku_key] = {fn: [] for fn in FIELD_NAMES}

            for fn in FIELD_NAMES:
                if fn in row and row[fn] is not None:
                    cand = _build_candidate_from_csv(fn, row[fn], "uploaded_catalog.csv")
                    sku_field_candidates[clean_sku_key][fn].append(cand)

    # Stage 1B + 2: Parse PDFs & Run LLM Extraction
    if pdf_files:
        for filename, pdf_bytes in pdf_files:
            page_blocks = parse_pdf_bytes(pdf_bytes, source_name=filename)
            for block in page_blocks:
                try:
                    extraction: BearingExtraction = extract_block(block)
                    extracted_sku = extraction.sku.value
                    if not extracted_sku:
                        # Try to match to an existing SKU from CSV if only one exists
                        if len(sku_field_candidates) == 1:
                            target_sku = list(sku_field_candidates.keys())[0]
                        else:
                            # Use fallback SKU based on filename
                            target_sku = cleaners.clean_sku(filename.replace(".pdf", "")) or "UNKNOWN-SKU"
                    else:
                        target_sku = cleaners.clean_sku(extracted_sku) or extracted_sku

                    if target_sku not in sku_field_candidates:
                        sku_field_candidates[target_sku] = {fn: [] for fn in FIELD_NAMES}

                    for fn in FIELD_NAMES:
                        raw_field = getattr(extraction, fn, None)
                        if raw_field and raw_field.value is not None:
                            # Propagate page if not set
                            if raw_field.page is None:
                                raw_field.page = block.page
                            cand = _build_candidate_from_raw_field(
                                fn, raw_field, block.source_name, block.source_type
                            )
                            sku_field_candidates[target_sku][fn].append(cand)

                except Exception as e:
                    logger.error(f"Failed live extraction on {filename} page {block.page}: {e}")

    if not sku_field_candidates:
        # Fallback to baked records if nothing could be parsed
        return load_golden_records()

    # Stage 3, 4, 5: Normalization, Cross-Field Validation & Conflict Resolution
    records: list[ProductRecord] = []
    for sku_key, fields_map in sku_field_candidates.items():
        # Preliminary dictionary of best normalized values for cross-field checks
        tentative_norm: dict[str, any] = {}
        for fn, cands in fields_map.items():
            if cands:
                tentative_norm[fn] = cands[0].normalized_value

        # Stage 4: Cross-field physical checks
        cross_issues = cross_field_checks(tentative_norm)

        # Stage 5: Resolve each field
        resolved_fields: dict[str, FieldDecision] = {}
        for fn in FIELD_NAMES:
            cands = fields_map.get(fn, [])
            fn_notes = cross_issues.get(fn, [])
            decision = resolve_field(fn, cands, cross_field_notes=fn_notes)
            resolved_fields[fn] = decision

        # Overall product name
        prod_name = resolved_fields.get("product_name").final_value if "product_name" in resolved_fields else None
        if not prod_name:
            prod_name = f"Industrial Bearing {sku_key}"

        # Compute overall confidence and status
        populated_confidences = [
            fd.confidence for fd in resolved_fields.values() if fd.status != FieldStatus.MISSING
        ]
        overall_conf = (
            round(sum(populated_confidences) / len(populated_confidences), 2)
            if populated_confidences
            else 0.0
        )

        all_statuses = [fd.status for fd in resolved_fields.values()]
        if any(st == FieldStatus.NEEDS_REVIEW for st in all_statuses):
            overall_status = FieldStatus.NEEDS_REVIEW
        elif any(st == FieldStatus.CONFLICT_RESOLVED for st in all_statuses):
            overall_status = FieldStatus.CONFLICT_RESOLVED
        elif all(st == FieldStatus.VALIDATED for st in all_statuses if st != FieldStatus.MISSING):
            overall_status = FieldStatus.VALIDATED
        else:
            overall_status = FieldStatus.MISSING

        record = ProductRecord(
            sku=sku_key,
            product_name=str(prod_name),
            fields=resolved_fields,
            overall_confidence=overall_conf,
            overall_status=overall_status,
        )
        records.append(record)

    store.set_products(records)
    return records


def process_or_baked(
    csv_content: Optional[str] = None,
    pdf_files: Optional[list[tuple[str, bytes]]] = None,
) -> list[ProductRecord]:
    """Entrypoint: runs live pipeline when files are uploaded, or returns golden dataset when empty."""
    if csv_content or pdf_files:
        return run_pipeline(csv_content, pdf_files)

    records = load_golden_records()
    store.set_products(records)
    return records

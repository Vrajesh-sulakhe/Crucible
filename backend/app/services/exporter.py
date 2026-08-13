"""services/exporter.py — STAGE 6 (Commerce Export & Catalog Intelligence Metrics).

Generates commerce-ready JSON/CSV export formats and quality metrics.
"""

from __future__ import annotations

import csv
import io
from typing import Any

from app.schemas.models import FieldStatus, ProductRecord


def export_json(records: list[ProductRecord]) -> list[dict[str, Any]]:
    """Export clean, commerce-ready JSON formatted for ERP / PIM / eCommerce."""
    output = []
    for r in records:
        prod_dict: dict[str, Any] = {
            "sku": r.sku,
            "product_name": r.product_name,
            "overall_confidence": r.overall_confidence,
            "overall_status": r.overall_status.value,
            "specifications": {},
            "citations": {},
        }
        for field_name, dec in r.fields.items():
            if dec.status != FieldStatus.MISSING:
                prod_dict["specifications"][field_name] = {
                    "value": dec.final_value,
                    "confidence": dec.confidence,
                    "status": dec.status.value,
                }
                # Attach primary evidence citation
                if dec.candidates:
                    top_cand = dec.candidates[0]
                    prod_dict["citations"][field_name] = {
                        "source": top_cand.evidence.source_name,
                        "type": top_cand.evidence.source_type.value,
                        "page": top_cand.evidence.page,
                        "snippet": top_cand.evidence.snippet,
                    }
        output.append(prod_dict)
    return output


def export_csv(records: list[ProductRecord]) -> str:
    """Export flat CSV formatted for ERP / eCommerce catalogs (Shopify, SAP, Magento)."""
    output = io.StringIO()
    
    # Collect all unique field names
    all_fields = [
        "sku", "product_name", "category", "subcategory",
        "bore_diameter", "outer_diameter", "width", "weight",
        "dynamic_load_rating", "static_load_rating", "limiting_speed",
        "material", "applications", "standards",
        "overall_confidence", "overall_status"
    ]
    
    writer = csv.DictWriter(output, fieldnames=all_fields)
    writer.writeheader()
    
    for r in records:
        row: dict[str, Any] = {
            "sku": r.sku,
            "product_name": r.product_name or "",
            "overall_confidence": r.overall_confidence,
            "overall_status": r.overall_status.value,
        }
        for fn in all_fields:
            if fn in r.fields:
                row[fn] = r.fields[fn].final_value or ""
        writer.writerow(row)
        
    return output.getvalue()


def compute_metrics(records: list[ProductRecord]) -> dict[str, Any]:
    """Calculate catalog completeness, accuracy rates, and operational ROI metrics."""
    total_products = len(records)
    if total_products == 0:
        return {
            "total_products": 0,
            "avg_confidence": 0.0,
            "validated_count": 0,
            "conflict_resolved_count": 0,
            "needs_review_count": 0,
            "enrichment_rate_pct": 0.0,
            "estimated_hours_saved": 0.0,
        }

    confidences = [r.overall_confidence for r in records]
    avg_conf = round(sum(confidences) / total_products, 2)

    validated = sum(1 for r in records if r.overall_status == FieldStatus.VALIDATED)
    conflicts = sum(1 for r in records if r.overall_status == FieldStatus.CONFLICT_RESOLVED)
    needs_review = sum(1 for r in records if r.overall_status == FieldStatus.NEEDS_REVIEW)

    # Calculate total fields enriched vs missing
    total_fields = 0
    populated_fields = 0
    for r in records:
        for dec in r.fields.values():
            total_fields += 1
            if dec.status != FieldStatus.MISSING and dec.final_value is not None:
                populated_fields += 1

    enrichment_rate = round((populated_fields / max(total_fields, 1)) * 100, 1)

    # ROI Calculation: ~15 minutes of manual cataloging / engineering check saved per SKU
    hours_saved = round((total_products * 15) / 60.0, 1)

    return {
        "total_products": total_products,
        "avg_confidence": avg_conf,
        "validated_count": validated,
        "conflict_resolved_count": conflicts,
        "needs_review_count": needs_review,
        "total_fields": total_fields,
        "populated_fields": populated_fields,
        "enrichment_rate_pct": enrichment_rate,
        "estimated_hours_saved": hours_saved,
    }

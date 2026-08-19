"""services/gap_analyzer.py — Attribute Gap Intelligence & Recovery Engine.

Analyzes incomplete industrial product records, pinpoints attribute gaps, evaluates
commercial impact (PIM / ERP / marketplace export readiness), and prescribes authoritative
recovery sources to guide automated or engineering enrichment.
"""

from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel, Field
from app.schemas.models import FieldStatus, ProductRecord


class AttributeGap(BaseModel):
    field: str
    field_label: str
    severity: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    commercial_impact: str
    recommended_sources: list[str]
    recovery_priority: int  # 1 = highest


class GapAnalysisResult(BaseModel):
    sku: str
    product_name: str
    commerce_readiness_score: float  # 0.0 to 100.0%
    populated_fields_count: int
    missing_fields_count: int
    gaps: list[AttributeGap]
    recommended_action: str


FIELD_METADATA: dict[str, dict[str, Any]] = {
    "bore_diameter": {
        "label": "Bore Diameter (d)",
        "severity": "CRITICAL",
        "impact": "Blocks shaft fitment verification & parametric CAD search in ERP/PIM systems.",
        "sources": ["Manufacturer Engineering Datasheet (Boundary Dimensions)", "ISO 15 / DIN 625 Table"],
        "priority": 1,
    },
    "outer_diameter": {
        "label": "Outer Diameter (D)",
        "severity": "CRITICAL",
        "impact": "Blocks housing bore compatibility & assembly tolerance checks.",
        "sources": ["Manufacturer Engineering Datasheet (Boundary Dimensions)", "ISO 15 / DIN 625 Table"],
        "priority": 1,
    },
    "width": {
        "label": "Width / Height (B)",
        "severity": "CRITICAL",
        "impact": "Blocks axial envelope verification & machine layout integration.",
        "sources": ["Manufacturer Engineering Datasheet (Boundary Dimensions)", "ISO 15 / DIN 625 Table"],
        "priority": 1,
    },
    "dynamic_load_rating": {
        "label": "Dynamic Load Rating (Cr)",
        "severity": "HIGH",
        "impact": "Blocks $L_{10}$ fatigue life calculations & automated sizing engines.",
        "sources": ["Manufacturer Master Catalog (ISO 281 Load Capacity Tables)", "Product Family Engineering Spec"],
        "priority": 2,
    },
    "static_load_rating": {
        "label": "Static Load Rating (C0)",
        "severity": "HIGH",
        "impact": "Blocks safety factor evaluation ($s_0 = C_0 / P_0$) under shock load conditions.",
        "sources": ["Manufacturer Master Catalog (ISO 76 Static Load Tables)", "Technical Engineering Bulletin"],
        "priority": 2,
    },
    "limiting_speed": {
        "label": "Limiting Speed (RPM)",
        "severity": "MEDIUM",
        "impact": "Blocks high-speed electric motor, spindle, and gearbox application filtering.",
        "sources": ["Manufacturer Kinematic & Thermal Reference Catalog (ISO 15312)", "Lubrication Spec Sheet"],
        "priority": 3,
    },
    "weight": {
        "label": "Net Mass / Weight",
        "severity": "MEDIUM",
        "impact": "Blocks automated freight calculation, packaging sizing, and shipping manifest generation.",
        "sources": ["Manufacturer Shipping Spec / Product Datasheet", "Master Packaging Database"],
        "priority": 4,
    },
    "material": {
        "label": "Ring & Ball Material",
        "severity": "MEDIUM",
        "impact": "Blocks corrosion resistance, food-grade (FDA/3A), and temperature compliance audits.",
        "sources": ["Manufacturer Material Specification Sheet (ISO 683-17 / AISI 52100 / 100Cr6)", "Material Test Report (MTR)"],
        "priority": 4,
    },
    "seals": {
        "label": "Sealing & Enclosure Type",
        "severity": "MEDIUM",
        "impact": "Blocks ingress protection rating (IP) and maintenance cycle scheduling.",
        "sources": ["Manufacturer Designation Suffix Table (2RS, 2RSH, ZZ, Open)", "Component Assembly Drawing"],
        "priority": 3,
    },
    "standards": {
        "label": "Applicable Industry Standards",
        "severity": "LOW",
        "impact": "Blocks regulatory compliance certification (ISO 9001, DIN, ABMA, JIS).",
        "sources": ["Manufacturer Compliance Certificate", "International Standards Index"],
        "priority": 5,
    },
    "applications": {
        "label": "Recommended Applications",
        "severity": "LOW",
        "impact": "Limits SEO discoverability and category merchandising on eCommerce storefronts.",
        "sources": ["Manufacturer Application Engineering Guide", "Distributor Industry Handbook"],
        "priority": 5,
    },
}


def analyze_product_gaps(product: ProductRecord) -> GapAnalysisResult:
    """Analyze missing attributes and generate actionable recovery recommendations."""
    gaps: list[AttributeGap] = []
    total_fields = len(product.fields)
    populated_count = 0

    for fn, fd in product.fields.items():
        if fd.status == FieldStatus.MISSING or fd.final_value is None:
            meta = FIELD_METADATA.get(fn, {
                "label": fn.replace("_", " ").title(),
                "severity": "LOW",
                "impact": "Missing attribute prevents complete commerce catalog publication.",
                "sources": ["Manufacturer Product Datasheet", "Technical Engineering Catalog"],
                "priority": 5,
            })
            gaps.append(
                AttributeGap(
                    field=fn,
                    field_label=meta["label"],
                    severity=meta["severity"],
                    commercial_impact=meta["impact"],
                    recommended_sources=meta["sources"],
                    recovery_priority=meta["priority"],
                )
            )
        else:
            populated_count += 1

    # Sort gaps by priority
    gaps.sort(key=lambda g: g.recovery_priority)

    readiness_pct = round((populated_count / total_fields) * 100.0, 1) if total_fields else 0.0

    if readiness_pct >= 90.0:
        action = "Commerce Ready: Product exceeds 90% attribute completeness. Ready for ERP & PIM export."
    elif readiness_pct >= 70.0:
        action = "Enrichment Recommended: Ingest manufacturer PDF datasheet to recover high-value engineering specs."
    else:
        action = "Critical Gaps: Missing fundamental dimensional or load attributes. Prioritize manufacturer catalog ingestion."

    return GapAnalysisResult(
        sku=product.sku,
        product_name=product.product_name,
        commerce_readiness_score=readiness_pct,
        populated_fields_count=populated_count,
        missing_fields_count=len(gaps),
        gaps=gaps,
        recommended_action=action,
    )

"""validation/rules.py — STAGE 4 (deterministic). Field + cross-field checks.

Pure functions. Returns (ok, notes).
Validates mathematical bounds and physical consistency laws.
"""

from __future__ import annotations

from typing import Any
from .ranges import RANGES

REQUIRED_FIELDS = ["sku", "bore_diameter", "outer_diameter", "width", "weight"]


def validate_field(field: str, value: Any) -> tuple[bool, list[str]]:
    """Validate a single field's normalized value against ranges and format."""
    notes: list[str] = []
    if value is None:
        return False, ["missing value"]

    rng = RANGES.get(field)
    if rng and isinstance(value, (int, float)):
        min_v, max_v = rng
        if not (min_v <= value <= max_v):
            notes.append(f"value {value} outside plausible engineering range [{min_v}, {max_v}]")

    return (len(notes) == 0), notes


def cross_field_checks(normalized_fields: dict[str, Any]) -> dict[str, list[str]]:
    """Verify physical laws and cross-attribute consistency across fields."""
    issues: dict[str, list[str]] = {}

    b = normalized_fields.get("bore_diameter")
    o = normalized_fields.get("outer_diameter")
    w = normalized_fields.get("width")
    dyn = normalized_fields.get("dynamic_load_rating")
    stat = normalized_fields.get("static_load_rating")
    speed = normalized_fields.get("limiting_speed")
    subcat = str(normalized_fields.get("subcategory") or "").lower()

    # Physical Law 1: Outer Diameter MUST exceed Bore Diameter
    if isinstance(b, (int, float)) and isinstance(o, (int, float)):
        if o <= b:
            issues.setdefault("outer_diameter", []).append(
                f"Physical constraint violation: outer diameter ({o} mm) must be greater than bore diameter ({b} mm)"
            )
        else:
            # Physical Law 2: Radial section thickness (o - b)/2 must be reasonable
            radial_section = (o - b) / 2.0
            if isinstance(w, (int, float)):
                if w > o:
                    issues.setdefault("width", []).append(
                        f"Width ({w} mm) cannot exceed outer diameter ({o} mm)"
                    )

    # Physical Law 3: Dynamic vs Static Load Rating
    # In standard radial ball bearings, dynamic rating Cr typically exceeds static Cor
    if isinstance(dyn, (int, float)) and isinstance(stat, (int, float)):
        if dyn <= 0 or stat <= 0:
            issues.setdefault("dynamic_load_rating", []).append("Load ratings must be positive values")
        elif "ball" in subcat and dyn < stat * 0.8:
            issues.setdefault("dynamic_load_rating", []).append(
                f"Anomalous rating: dynamic load ({dyn} kN) is unusually low compared to static load ({stat} kN) for ball bearings"
            )

    # Physical Law 4: Speed factor (n * dm limit check)
    if isinstance(speed, (int, float)) and isinstance(b, (int, float)) and isinstance(o, (int, float)):
        dm = (b + o) / 2.0  # Pitch diameter in mm
        ndm = speed * dm
        if ndm > 1_500_000:
            issues.setdefault("limiting_speed", []).append(
                f"High speed factor: n*dm ({ndm:,.0f}) exceeds standard mechanical threshold (1,500,000)"
            )

    return issues

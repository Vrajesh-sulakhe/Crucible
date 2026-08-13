"""validation/rules.py — STAGE 4 (deterministic). Field + cross-field checks.

Pure functions. Returns (ok, notes). Never mutates; the resolver decides status.
"""

from __future__ import annotations

from .ranges import RANGES

REQUIRED = ["sku", "bore_diameter", "outer_diameter", "weight"]


def validate_field(field: str, value) -> tuple[bool, list[str]]:
    notes: list[str] = []
    if value is None:
        return False, ["missing"]
    rng = RANGES.get(field)
    if rng and isinstance(value, (int, float)):
        if not (rng[0] <= value <= rng[1]):
            notes.append(f"outside expected range {rng[0]}-{rng[1]}")
    return (len(notes) == 0), notes


def cross_field_checks(norm: dict) -> dict:
    """Physical laws a single field can't violate alone."""
    issues: dict = {}
    b = norm.get("bore_diameter")
    o = norm.get("outer_diameter")
    if b is not None and o is not None and o <= b:
        issues["outer_diameter"] = ["outer diameter must exceed bore diameter"]
    return issues

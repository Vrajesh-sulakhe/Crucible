"""validation/ranges.py — STAGE 4 (deterministic). Plausible ranges per field.

Canonical units (mm, kg, kN, rpm). A value outside its plausible engineering range is flagged.
"""

from __future__ import annotations

RANGES: dict[str, tuple[float, float]] = {
    "bore_diameter": (0.5, 2500.0),       # mm (from miniature 0.5mm to massive industrial mill bearings)
    "outer_diameter": (1.5, 3500.0),     # mm
    "width": (0.2, 800.0),                # mm
    "weight": (0.001, 5000.0),            # kg (1 gram miniature to 5-ton industrial bearings)
    "dynamic_load_rating": (0.05, 25000.0), # kN
    "static_load_rating": (0.02, 35000.0),  # kN
    "limiting_speed": (10.0, 500000.0),   # rpm (from slow slewing rings to high speed dental spindles)
}

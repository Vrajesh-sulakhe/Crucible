"""validation/ranges.py — STAGE 4 (deterministic). Plausible ranges per field.

Canonical units (mm/kg/kN/rpm). A value outside its range is flagged, not
silently accepted. Tune per vertical; this is bearings.
"""

RANGES = {
    "bore_diameter": (1, 1000),
    "outer_diameter": (5, 2000),
    "width": (0.5, 500),
    "weight": (0.005, 200),
    "dynamic_load_rating": (0.1, 5000),
    "static_load_rating": (0.1, 5000),
    "limiting_speed": (10, 100000),
}

"""normalization/units.py — STAGE 3 (deterministic). Canonical units.

Pure function: raw quantity string -> (canonical value, canonical unit).
Canonical units: length=millimeter, mass=kilogram, force=kilonewton, speed=rpm.
Unparseable -> (None, None) so it surfaces as MISSING downstream, never a
silently-wrong number. The AI reads; the code decides — conversion is ours.
"""

from __future__ import annotations

import re
from typing import Optional

from pint import UnitRegistry

_ureg = UnitRegistry()
_NUM = re.compile(r"([-+]?\d+(?:\.\d+)?)\s*([A-Za-z°/%]+)?")

# field name -> canonical pint unit. Keys match BearingExtraction field names.
CANONICAL = {
    "bore_diameter": "millimeter",
    "outer_diameter": "millimeter",
    "width": "millimeter",
    "weight": "kilogram",
    "dynamic_load_rating": "kilonewton",
    "static_load_rating": "kilonewton",
    "limiting_speed": "rpm",
}


def normalize(field: str, raw) -> tuple[Optional[float], Optional[str]]:
    if raw is None:
        return None, None
    m = _NUM.search(str(raw))
    if not m:
        return None, None
    number, unit = float(m.group(1)), m.group(2)

    # Speed is reported in rpm; skip pint (it has no clean rpm target).
    if field == "limiting_speed":
        return number, "rpm"

    target = CANONICAL.get(field)
    if unit and target:
        try:
            return round(_ureg(f"{number} {unit}").to(target).magnitude, 3), target
        except Exception:
            return number, unit   # unknown unit: keep number, flag later
    return number, target

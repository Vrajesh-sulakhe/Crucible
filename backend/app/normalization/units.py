"""normalization/units.py — STAGE 3 (deterministic). Canonical units.

Pure function: raw quantity string -> (canonical value, canonical unit).
Canonical units:
  - length: millimeter (mm)
  - mass: kilogram (kg)
  - force / load rating: kilonewton (kN)
  - speed: rpm

Handles tolerances, dual units (e.g. "25.000 mm [0.9843 in]"), comma decimals, and pint conversions.
"""

from __future__ import annotations

import re
from typing import Optional

from pint import UnitRegistry

_ureg = UnitRegistry()

# Pattern matching number with optional unit, ignoring tolerance or brackets
_BRACKET_PATTERN = re.compile(r"\[.*?\]|\(.*?\)")
_TOLERANCE_PATTERN = re.compile(r"[±+\-]\s*\d+(?:\.\d+)?(?:\s*/\s*[+\-]?\d+(?:\.\d+)?)?")
_NUM_UNIT_PATTERN = re.compile(
    r"([-+]?\d+(?:[.,]\d+)?)\s*([\"'a-zA-Z°/%µμ]+(?:\s*[0-9/a-zA-Z]+)?)?"
)

# Field name -> canonical unit name
CANONICAL: dict[str, str] = {
    "bore_diameter": "millimeter",
    "outer_diameter": "millimeter",
    "width": "millimeter",
    "weight": "kilogram",
    "dynamic_load_rating": "kilonewton",
    "static_load_rating": "kilonewton",
    "limiting_speed": "rpm",
}

# Common synonym mappings before passing to Pint
UNIT_SYNONYMS: dict[str, str] = {
    "mm": "millimeter",
    "millimeter": "millimeter",
    "millimeters": "millimeter",
    "cm": "centimeter",
    "centimeter": "centimeter",
    "m": "meter",
    "meter": "meter",
    "in": "inch",
    "inch": "inch",
    "inches": "inch",
    '"': "inch",
    "''": "inch",
    "kg": "kilogram",
    "kilogram": "kilogram",
    "kilograms": "kilogram",
    "g": "gram",
    "gram": "gram",
    "grams": "gram",
    "lb": "pound",
    "lbs": "pound",
    "pound": "pound",
    "pounds": "pound",
    "oz": "ounce",
    "kn": "kilonewton",
    "kilonewton": "kilonewton",
    "kilonewtons": "kilonewton",
    "n": "newton",
    "newton": "newton",
    "newtons": "newton",
    "lbf": "force_pound",
    "rpm": "rpm",
    "r/min": "rpm",
    "1/min": "rpm",
    "rev/min": "rpm",
    "min-1": "rpm",
}


# Regex patterns for fractional measurements (e.g. 1-1/4", 1 1/4 in, 3/8", 5/8 in)
_MIXED_FRACTION_PATTERN = re.compile(
    r"^([-+]?\d+)\s*[-_ ]\s*(\d+)/(\d+)\s*([\"'a-zA-Z°/%µμ]+(?:\s*[0-9/a-zA-Z]+)?)?$"
)
_SIMPLE_FRACTION_PATTERN = re.compile(
    r"^([-+]?\d+)/(\d+)\s*([\"'a-zA-Z°/%µμ]+(?:\s*[0-9/a-zA-Z]+)?)?$"
)
_PREFIX_STRIP_PATTERN = re.compile(r"^(?:approx\.?|about|max\.?|min\.?|dia\.?|[~≥≤><=]+)\s*", re.IGNORECASE)


def normalize(field: str, raw: any) -> tuple[Optional[float], Optional[str]]:
    """Normalize any raw numeric/string quantity to its canonical float value and unit.

    Handles:
      - Fractional inches (e.g. '1-1/4"', '1 1/4 in', '3/8"', '5/8')
      - Thousands vs European decimal commas ('14,800 N' vs '25,4 mm')
      - Dual units ('52.000 mm [2.0472 in]') and tolerances ('25 ± 0.05 mm')
      - Qualitative prefixes ('~14.8 kN', '>= 8500 rpm')
    """
    if raw is None:
        return None, None

    s = str(raw).strip()
    if not s or s.lower() in ("null", "none", "n/a", "-", "--", "nan", "nil"):
        return None, None

    # Strip bracketed secondary measurements if present e.g. "25 mm [0.98 in]" -> "25 mm"
    if "[" in s:
        parts = s.split("[")
        if parts[0].strip():
            s = parts[0].strip()

    # Strip prefix qualifiers like '~', '>=', 'approx'
    s = _PREFIX_STRIP_PATTERN.sub("", s).strip()

    target = CANONICAL.get(field)

    # Check for mixed fraction FIRST (e.g. "1-1/4\"", "1 1/4 in") before tolerance regex eats "-1/4"
    mf = _MIXED_FRACTION_PATTERN.match(s)
    if mf:
        whole = float(mf.group(1))
        num = float(mf.group(2))
        den = float(mf.group(3))
        raw_unit_str = (mf.group(4) or "").strip().lower()
        if den != 0:
            val_in_inches = whole + (num / den if whole >= 0 else -num / den)
            unit_to_use = raw_unit_str or "inch"
            clean_unit = UNIT_SYNONYMS.get(unit_to_use, unit_to_use)
            if target:
                try:
                    qty = _ureg(f"{val_in_inches} {clean_unit}")
                    converted = qty.to(target).magnitude
                    return round(float(converted), 4), target
                except Exception:
                    return round(val_in_inches, 4), clean_unit
            return round(val_in_inches, 4), clean_unit

    # Check for simple fraction (e.g. "3/8\"", "5/8 in")
    sf = _SIMPLE_FRACTION_PATTERN.match(s)
    if sf:
        num = float(sf.group(1))
        den = float(sf.group(2))
        raw_unit_str = (sf.group(3) or "").strip().lower()
        if den != 0:
            val_in_inches = num / den
            unit_to_use = raw_unit_str or "inch"
            clean_unit = UNIT_SYNONYMS.get(unit_to_use, unit_to_use)
            if target:
                try:
                    qty = _ureg(f"{val_in_inches} {clean_unit}")
                    converted = qty.to(target).magnitude
                    return round(float(converted), 4), target
                except Exception:
                    return round(val_in_inches, 4), clean_unit
            return round(val_in_inches, 4), clean_unit

    # Strip tolerance e.g. "25 ± 0.05 mm" -> "25 mm"
    s = _TOLERANCE_PATTERN.sub("", s)

    # Intelligent comma handling:
    # 1. Thousands separator: e.g. "14,800 N" -> "14800 N"
    s = re.sub(r"(\d+),(\d{3})(?=\D|$)", r"\1\2", s)
    # 2. European decimal: e.g. "25,4 mm" -> "25.4 mm"
    s = re.sub(r"(\d+),(\d{1,2})(?=\D|$)", r"\1.\2", s)

    m = _NUM_UNIT_PATTERN.search(s)
    if not m:
        return None, None

    raw_num_str = m.group(1).strip()
    raw_unit_str = (m.group(2) or "").strip().lower()

    try:
        number = float(raw_num_str)
    except ValueError:
        return None, None

    # Speed fields
    if field == "limiting_speed" or target == "rpm":
        return round(number, 2), "rpm"

    # Default fallback if no unit was specified
    if not raw_unit_str:
        return round(number, 4), target

    # Map unit synonym
    clean_unit = UNIT_SYNONYMS.get(raw_unit_str, raw_unit_str)

    if clean_unit == target:
        return round(number, 4), target

    # Attempt Pint unit conversion
    if target:
        try:
            qty = _ureg(f"{number} {clean_unit}")
            converted = qty.to(target).magnitude
            return round(float(converted), 4), target
        except Exception:
            # If conversion fails, preserve number and report unit
            return round(number, 4), clean_unit

    return round(number, 4), target


"""normalization/cleaners.py — STAGE 3 (deterministic). Text canonicalization.

The text-side twin of units.py. Deterministic string cleanup for the TEXT_FIELDS.
The AI reads; the code decides — casing/synonyms are ours, not the model's.
"""

from __future__ import annotations

import re
from typing import Optional

CATEGORY_MAP = {
    "bearing": "Bearings", "bearings": "Bearings",
    "ball bearing": "Bearings", "deep groove ball bearing": "Bearings",
    "roller bearing": "Bearings",
}

MATERIAL_MAP = {
    "chrome steel": "Chrome Steel", "bearing steel": "Chrome Steel",
    "aisi 52100": "Chrome Steel", "52100": "Chrome Steel",
    "stainless steel": "Stainless Steel", "stainless": "Stainless Steel",
    "carbon steel": "Carbon Steel",
}


def clean_text(raw) -> Optional[str]:
    if raw is None:
        return None
    s = re.sub(r"\s+", " ", str(raw)).strip().strip(".,;:")
    return s or None


def clean_sku(raw) -> Optional[str]:
    s = clean_text(raw)
    if s is None:
        return None
    s = re.sub(r"[^A-Z0-9]+", "-", s.upper()).strip("-")
    return s or None


def _map_or_title(s: str, mapping: dict) -> str:
    return mapping.get(s.lower().strip(), s.title())


def clean_category(raw) -> Optional[str]:
    s = clean_text(raw)
    return _map_or_title(s, CATEGORY_MAP) if s else None


def clean_material(raw) -> Optional[str]:
    s = clean_text(raw)
    return _map_or_title(s, MATERIAL_MAP) if s else None


def clean(field: str, raw) -> Optional[str]:
    """Text-side dispatcher mirroring units.normalize. Routes by field name."""
    if raw is None:
        return None
    if field == "sku":
        return clean_sku(raw)
    if field == "category":
        return clean_category(raw)
    if field == "material":
        return clean_material(raw)
    return clean_text(raw)   # product_name, subcategory, applications, standards

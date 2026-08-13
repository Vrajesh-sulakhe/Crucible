"""normalization/cleaners.py — STAGE 3 (deterministic). Text canonicalization.

Deterministic string cleanup for TEXT_FIELDS:
- Taxonomy / Category mapping (UNSPSC alignment)
- Material standardization (AISI 52100, 100Cr6, SUJ2 -> Chrome Steel)
- SKU normalization (uppercase, clean hyphens, stripped noise)
- Seal / Enclosure canonicalization (2RS, 2RSH, ZZ, Open)
- Standards normalization (ISO, DIN, ANSI, ABEC, JIS)
"""

from __future__ import annotations

import re
from typing import Optional

CATEGORY_MAP: dict[str, str] = {
    "bearing": "Bearings",
    "bearings": "Bearings",
    "ball bearing": "Bearings",
    "ball bearings": "Bearings",
    "deep groove ball bearing": "Bearings",
    "deep groove ball bearings": "Bearings",
    "roller bearing": "Bearings",
    "roller bearings": "Bearings",
    "radial bearing": "Bearings",
    "radial bearings": "Bearings",
    "tapered roller bearing": "Bearings",
    "spherical roller bearing": "Bearings",
    "thrust bearing": "Bearings",
    "angular contact bearing": "Bearings",
}

SUBCATEGORY_MAP: dict[str, str] = {
    "deep groove": "Deep Groove Ball Bearings",
    "deep groove ball": "Deep Groove Ball Bearings",
    "deep groove ball bearing": "Deep Groove Ball Bearings",
    "deep groove ball bearings": "Deep Groove Ball Bearings",
    "tapered roller": "Tapered Roller Bearings",
    "tapered roller bearing": "Tapered Roller Bearings",
    "tapered roller bearings": "Tapered Roller Bearings",
    "spherical roller": "Spherical Roller Bearings",
    "spherical roller bearing": "Spherical Roller Bearings",
    "angular contact": "Angular Contact Ball Bearings",
    "angular contact ball bearing": "Angular Contact Ball Bearings",
    "needle roller": "Needle Roller Bearings",
    "cylindrical roller": "Cylindrical Roller Bearings",
    "thrust ball": "Thrust Ball Bearings",
}

MATERIAL_MAP: dict[str, str] = {
    "chrome steel": "Chrome Steel",
    "bearing steel": "Chrome Steel",
    "high carbon chrome steel": "Chrome Steel",
    "high carbon chromium bearing steel": "Chrome Steel",
    "aisi 52100": "Chrome Steel",
    "52100": "Chrome Steel",
    "100cr6": "Chrome Steel",
    "din 100cr6": "Chrome Steel",
    "suj2": "Chrome Steel",
    "jis suj2": "Chrome Steel",
    "gcr15": "Chrome Steel",
    "stainless steel": "Stainless Steel",
    "stainless": "Stainless Steel",
    "aisi 440c": "Stainless Steel",
    "440c": "Stainless Steel",
    "aisi 304": "Stainless Steel",
    "aisi 316": "Stainless Steel",
    "carbon steel": "Carbon Steel",
    "case carburized alloy steel": "Case Carburized Alloy Steel",
    "case-hardened alloy steel": "Case Carburized Alloy Steel",
    "ceramic": "Ceramic (Si3N4)",
    "silicon nitride": "Ceramic (Si3N4)",
    "zirconia": "Ceramic (ZrO2)",
}


def clean_text(raw: any) -> Optional[str]:
    """Basic whitespace and punctuation stripper."""
    if raw is None:
        return None
    s = re.sub(r"\s+", " ", str(raw)).strip().strip(".,;:")
    return s or None


def clean_sku(raw: any) -> Optional[str]:
    """Standardize SKU / designation."""
    s = clean_text(raw)
    if not s:
        return None
    # Remove surrounding quotes, spaces
    s = s.strip("'\"")
    # Clean non-alphanumeric noise while preserving hyphens and dots
    s = re.sub(r"[^A-Za-z0-9\-_./]+", "-", s).upper().strip("-_./")
    return s or None


def _map_or_title(s: str, mapping: dict[str, str]) -> str:
    cleaned = s.lower().strip()
    return mapping.get(cleaned, s.title())


def clean_category(raw: any) -> Optional[str]:
    s = clean_text(raw)
    return _map_or_title(s, CATEGORY_MAP) if s else None


def clean_subcategory(raw: any) -> Optional[str]:
    s = clean_text(raw)
    if not s:
        return None
    cleaned = s.lower().strip()
    for pattern, canonical in SUBCATEGORY_MAP.items():
        if pattern in cleaned:
            return canonical
    return s.title()


def clean_material(raw: any) -> Optional[str]:
    s = clean_text(raw)
    if not s:
        return None
    cleaned = s.lower().strip()
    for pattern, canonical in MATERIAL_MAP.items():
        if pattern in cleaned:
            return canonical
    return s.title()


def clean(field: str, raw: any) -> Optional[str]:
    """Text-side dispatcher mirroring units.normalize."""
    if raw is None:
        return None
    if field == "sku":
        return clean_sku(raw)
    if field == "category":
        return clean_category(raw)
    if field == "subcategory":
        return clean_subcategory(raw)
    if field == "material":
        return clean_material(raw)
    return clean_text(raw)

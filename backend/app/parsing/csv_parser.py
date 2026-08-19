"""parsing/csv_parser.py — STAGE 1 (deterministic). CSV -> list[dict[str, Any]].

Tolerant parser for messy, real-world industrial product CSV files:
- Handles case-insensitive headers, whitespace, and column name aliases.
- Ignores comment lines and empty rows.
- Returns clean dictionaries mapping canonical field names to raw string values.
"""

from __future__ import annotations

import csv
import io
import re
from typing import Any

HEADER_ALIASES: dict[str, str] = {
    # SKU / Designation
    "sku": "sku",
    "part_number": "sku",
    "part_no": "sku",
    "partno": "sku",
    "part_#": "sku",
    "part#": "sku",
    "item_#": "sku",
    "item_number": "sku",
    "item_no": "sku",
    "catalog_#": "sku",
    "catalog_no": "sku",
    "designation": "sku",
    "model": "sku",
    "model_number": "sku",
    "product_code": "sku",

    # Title / Name
    "product_name": "product_name",
    "name": "product_name",
    "title": "product_name",
    "description": "product_name",
    "item_name": "product_name",
    "product_title": "product_name",
    "item_description": "product_name",
    "part_description": "product_name",

    # Category / Taxonomy
    "category": "category",
    "cat": "category",
    "product_category": "category",
    "bearing_category": "category",
    "subcategory": "subcategory",
    "sub_category": "subcategory",
    "type": "subcategory",
    "bearing_type": "subcategory",

    # Dimensions (Length / Diameters)
    "bore_diameter": "bore_diameter",
    "bore": "bore_diameter",
    "bore_dia": "bore_diameter",
    "bore_d": "bore_diameter",
    "inner_diameter": "bore_diameter",
    "id": "bore_diameter",
    "d": "bore_diameter",
    "d_mm": "bore_diameter",
    "bore_mm": "bore_diameter",
    "d_in": "bore_diameter",
    "shaft_dia": "bore_diameter",
    "shaft_diameter": "bore_diameter",

    "outer_diameter": "outer_diameter",
    "outside_diameter": "outer_diameter",
    "od": "outer_diameter",
    "od_d": "outer_diameter",
    "od_mm": "outer_diameter",
    "outer_dia": "outer_diameter",
    "d_outer": "outer_diameter",
    "d2": "outer_diameter",
    "d_mm_od": "outer_diameter",

    "width": "width",
    "width_b": "width",
    "width_mm": "width",
    "thickness": "width",
    "b": "width",
    "b_width": "width",
    "height": "width",
    "w": "width",
    "w_b": "width",
    "t": "width",

    # Mass
    "weight": "weight",
    "mass": "weight",
    "mass_wt": "weight",
    "mass_kg": "weight",
    "weight_kg": "weight",
    "mass___wt": "weight",
    "mass_/_wt": "weight",
    "net_weight": "weight",
    "wt": "weight",
    "approx_weight": "weight",

    # Load Ratings
    "dynamic_load": "dynamic_load_rating",
    "dynamic_load_rating": "dynamic_load_rating",
    "dynamic_rating": "dynamic_load_rating",
    "c_dyn": "dynamic_load_rating",
    "c_dyn_kn": "dynamic_load_rating",
    "dyn_load_cr": "dynamic_load_rating",
    "dynamic_c": "dynamic_load_rating",
    "cr": "dynamic_load_rating",
    "c": "dynamic_load_rating",

    "static_load": "static_load_rating",
    "static_load_rating": "static_load_rating",
    "static_rating": "static_load_rating",
    "c0_stat": "static_load_rating",
    "stat_load_c0": "static_load_rating",
    "static_c0": "static_load_rating",
    "cor": "static_load_rating",
    "c0": "static_load_rating",
    "c0r": "static_load_rating",

    # Rotational Speed
    "limiting_speed": "limiting_speed",
    "speed_limit": "limiting_speed",
    "max_speed": "limiting_speed",
    "rpm": "limiting_speed",
    "rpm_lim": "limiting_speed",
    "max_rpm": "limiting_speed",
    "limiting_rpm": "limiting_speed",
    "reference_speed": "limiting_speed",

    # Material / Sealing / Standards
    "material": "material",
    "matl": "material",
    "material_spec": "material",
    "matl_spec": "material",
    "body_material": "material",
    "steel_type": "material",
    "ring_material": "material",

    "seals": "seals",
    "seal_type": "seals",
    "enclosure": "seals",
    "enclosure_seal": "seals",
    "closure": "seals",
    "closure_type": "seals",
    "shield": "seals",

    "standards": "standards",
    "standard": "standards",
    "standard_norms": "standards",
    "compliance": "standards",
    "iso_standard": "standards",
    "norms": "standards",

    "applications": "applications",
    "application": "applications",
    "usage": "applications",
}


def _normalize_header(h: str) -> str:
    # Strip units in parens/brackets first e.g. "Bore (mm)" -> "Bore", "Cr (kN)" -> "Cr"
    cleaned = re.sub(r"[\(\[].*?[\)\]]", "", h).strip()
    cleaned = (
        cleaned.lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace(".", "")
        .replace("/", "_")
    )
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    if cleaned in HEADER_ALIASES:
        return HEADER_ALIASES[cleaned]
    # Fallback to direct raw header cleanup
    raw_cleaned = (
        h.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace(".", "")
        .replace("/", "_")
    )
    raw_cleaned = re.sub(r"_+", "_", raw_cleaned).strip("_")
    return HEADER_ALIASES.get(raw_cleaned, raw_cleaned)



def parse_csv_content(content: str) -> list[dict[str, Any]]:
    """Parse CSV text content into a list of normalized row dictionaries."""
    rows: list[dict[str, Any]] = []
    stream = io.StringIO(content.strip())
    reader = csv.reader(stream)
    
    header_row = None
    for raw_row in reader:
        if not raw_row or all(not cell.strip() for cell in raw_row):
            continue
        # Skip comment lines
        if raw_row[0].strip().startswith("#"):
            continue
        if header_row is None:
            header_row = [_normalize_header(c) for c in raw_row]
            continue
        
        row_dict: dict[str, Any] = {}
        for idx, col_name in enumerate(header_row):
            if idx < len(raw_row):
                val = raw_row[idx].strip()
                if val:
                    row_dict[col_name] = val
        if row_dict:
            rows.append(row_dict)
            
    return rows


def parse_csv_file(file_path: str) -> list[dict[str, Any]]:
    """Parse a CSV file on disk."""
    with open(file_path, "r", encoding="utf-8-sig", errors="replace") as f:
        return parse_csv_content(f.read())

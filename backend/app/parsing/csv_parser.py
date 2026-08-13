"""parsing/csv_parser.py — STAGE 1 (deterministic). CSV -> list[dict[str, Any]].

Tolerant parser for messy, real-world industrial product CSV files:
- Handles case-insensitive headers, whitespace, and column name aliases.
- Ignores comment lines and empty rows.
- Returns clean dictionaries mapping canonical field names to raw string values.
"""

from __future__ import annotations

import csv
import io
from typing import Any

HEADER_ALIASES: dict[str, str] = {
    # SKU / Designation
    "sku": "sku",
    "part_number": "sku",
    "part_no": "sku",
    "partno": "sku",
    "designation": "sku",
    "model": "sku",
    "model_number": "sku",
    "item_number": "sku",
    
    # Title / Name
    "product_name": "product_name",
    "name": "product_name",
    "title": "product_name",
    "description": "product_name",
    "item_name": "product_name",
    
    # Category / Taxonomy
    "category": "category",
    "cat": "category",
    "product_category": "category",
    "subcategory": "subcategory",
    "sub_category": "subcategory",
    "type": "subcategory",
    
    # Dimensions (Length / Diameters)
    "bore_diameter": "bore_diameter",
    "bore": "bore_diameter",
    "bore_dia": "bore_diameter",
    "inner_diameter": "bore_diameter",
    "id": "bore_diameter",
    "d": "bore_diameter",
    
    "outer_diameter": "outer_diameter",
    "outside_diameter": "outer_diameter",
    "od": "outer_diameter",
    "outer_dia": "outer_diameter",
    "d_outer": "outer_diameter",
    "d2": "outer_diameter",
    
    "width": "width",
    "thickness": "width",
    "b": "width",
    "b_width": "width",
    "height": "width",
    
    # Mass
    "weight": "weight",
    "mass": "weight",
    "net_weight": "weight",
    "wt": "weight",
    
    # Load Ratings
    "dynamic_load": "dynamic_load_rating",
    "dynamic_load_rating": "dynamic_load_rating",
    "dynamic_rating": "dynamic_load_rating",
    "cr": "dynamic_load_rating",
    "c": "dynamic_load_rating",
    
    "static_load": "static_load_rating",
    "static_load_rating": "static_load_rating",
    "static_rating": "static_load_rating",
    "cor": "static_load_rating",
    "c0": "static_load_rating",
    
    # Rotational Speed
    "limiting_speed": "limiting_speed",
    "speed_limit": "limiting_speed",
    "max_speed": "limiting_speed",
    "rpm": "limiting_speed",
    "reference_speed": "limiting_speed",
    
    # Material / Sealing / Standards
    "material": "material",
    "body_material": "material",
    "steel_type": "material",
    
    "seals": "seals",
    "seal_type": "seals",
    "enclosure": "seals",
    "shield": "seals",
    
    "standards": "standards",
    "standard": "standards",
    "compliance": "standards",
    "iso_standard": "standards",
    
    "applications": "applications",
    "application": "applications",
    "usage": "applications",
}


def _normalize_header(h: str) -> str:
    cleaned = h.strip().lower().replace(" ", "_").replace("-", "_")
    return HEADER_ALIASES.get(cleaned, cleaned)


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

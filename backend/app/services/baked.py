"""services/baked.py — Baked Golden Dataset loader.

Loads pre-computed golden ProductRecords from data/golden/*.json.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.schemas.models import ProductRecord


def get_golden_data_path() -> Path:
    """Find data/golden directory relative to repository root."""
    # backend/app/services/baked.py -> 4 parents to repository root
    base = Path(__file__).resolve().parents[3]
    return base / "data" / "golden"


def load_golden_records() -> list[ProductRecord]:
    """Load all golden product records from disk."""
    golden_dir = get_golden_data_path()
    records: list[ProductRecord] = []
    
    if not golden_dir.exists():
        return records

    for json_file in golden_dir.glob("*.json"):
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                content = json.load(f)
                if isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and "sku" in item and "fields" in item:
                            records.append(ProductRecord.model_validate(item))
                elif isinstance(content, dict) and "sku" in content and "fields" in content:
                    records.append(ProductRecord.model_validate(content))
        except Exception as e:
            pass

    return records

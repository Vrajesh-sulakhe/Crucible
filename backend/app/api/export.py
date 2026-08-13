"""api/export.py — Commerce Export and Quality Intelligence Metrics Endpoints."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from app.api.deps import get_store
from app.core.store import ProductStore
from app.services.exporter import compute_metrics, export_csv, export_json

router = APIRouter(prefix="", tags=["Export & Metrics"])


class MetricsResponse(BaseModel):
    total_products: int
    avg_confidence: float
    validated_count: int
    conflict_resolved_count: int
    needs_review_count: int
    total_fields: int
    populated_fields: int
    enrichment_rate_pct: float
    estimated_hours_saved: float


@router.get("/export/json")
def get_export_json(
    store: ProductStore = Depends(get_store),
) -> list[dict[str, Any]]:
    """Export clean, structured commerce-ready product data in JSON format."""
    records = store.get_all()
    return export_json(records)


@router.get("/export/csv")
def get_export_csv(
    store: ProductStore = Depends(get_store),
) -> Response:
    """Download flat CSV catalog formatted for eCommerce and ERP systems."""
    records = store.get_all()
    csv_data = export_csv(records)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="crucible_commerce_catalog.csv"'},
    )


@router.get("/metrics", response_model=MetricsResponse)
def get_catalog_metrics(
    store: ProductStore = Depends(get_store),
) -> MetricsResponse:
    """Compute automated enrichment rates, accuracy distributions, and labor-savings metrics."""
    records = store.get_all()
    metrics = compute_metrics(records)
    return MetricsResponse.model_validate(metrics)

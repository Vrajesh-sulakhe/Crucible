"""api/review.py — Human-in-the-Loop Review Queue and Conflict Override Endpoints."""

from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.deps import get_store
from app.core.store import ProductStore
from app.schemas.models import ProductRecord

router = APIRouter(prefix="", tags=["Review Queue"])


class ReviewQueueItem(BaseModel):
    sku: str
    product_name: Optional[str] = None
    field: str
    current_value: Any
    status: str
    confidence: float
    decision_reason: str
    validation_notes: list[str]
    candidates: list[dict[str, Any]]


class ReviewActionRequest(BaseModel):
    action: str = "ACCEPT"  # ACCEPT, REJECT, EDIT
    value: Optional[Any] = None
    notes: Optional[str] = None


@router.get("/review", response_model=list[ReviewQueueItem])
def get_review_queue(
    store: ProductStore = Depends(get_store),
) -> list[ReviewQueueItem]:
    """Retrieve all fields across the catalog currently requiring human review or conflict arbitration."""
    queue = store.get_review_queue()
    return [ReviewQueueItem.model_validate(item) for item in queue]


@router.post("/products/{sku}/review/{field}", response_model=ProductRecord)
def submit_review_decision(
    sku: str,
    field: str,
    request: ReviewActionRequest,
    store: ProductStore = Depends(get_store),
) -> ProductRecord:
    """Submit a human override or approval decision for a conflicting/uncertain field."""
    updated = store.update_field_decision(
        sku=sku,
        field=field,
        new_value=request.value,
        action=request.action.upper(),
        reviewer_notes=request.notes,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unable to update decision for field '{field}' on SKU '{sku}'. Product or field not found.",
        )
    return updated

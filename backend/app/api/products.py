"""api/products.py — Product catalog queries and deep explainability endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_store
from app.core.store import ProductStore
from app.schemas.models import FieldDecision, FieldStatus, ProductRecord

router = APIRouter(prefix="", tags=["Products"])


@router.get("/products", response_model=list[ProductRecord])
def list_products(
    status_filter: Optional[FieldStatus] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None, description="Search by SKU or product name"),
    min_confidence: Optional[float] = Query(default=None, ge=0.0, le=1.0),
    store: ProductStore = Depends(get_store),
) -> list[ProductRecord]:
    """Retrieve catalog products with optional status, search, and confidence filtering."""
    products = store.get_all()

    if status_filter:
        products = [p for p in products if p.overall_status == status_filter]

    if min_confidence is not None:
        products = [p for p in products if p.overall_confidence >= min_confidence]

    if search:
        q = search.lower().strip()
        products = [
            p for p in products
            if q in p.sku.lower() or (p.product_name and q in p.product_name.lower())
        ]

    return products


@router.get("/products/{sku}", response_model=ProductRecord)
def get_product(
    sku: str,
    store: ProductStore = Depends(get_store),
) -> ProductRecord:
    """Retrieve a single complete product record by SKU."""
    product = store.get_by_sku(sku)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with SKU '{sku}' not found in catalog.",
        )
    return product


@router.get("/products/{sku}/explain/{field}", response_model=FieldDecision)
def explain_field(
    sku: str,
    field: str,
    store: ProductStore = Depends(get_store),
) -> FieldDecision:
    """Retrieve deep audit trail, verbatim citation snippets, and validation notes for one field."""
    product = store.get_by_sku(sku)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with SKU '{sku}' not found.",
        )

    if field not in product.fields:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Field '{field}' does not exist on product '{sku}'.",
        )

    return product.fields[field]

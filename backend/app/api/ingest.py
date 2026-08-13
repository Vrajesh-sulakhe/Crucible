"""api/ingest.py — Ingestion endpoint (POST /process).

Supports multipart file uploads (CSV + PDF datasheets) and baked mode bypass.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel

from app.api.deps import get_store
from app.core.auth import require_demo_token
from app.core.store import ProductStore
from app.schemas.models import ProductRecord
from app.services.pipeline import process_or_baked

router = APIRouter(prefix="", tags=["Ingest"])


class IngestResponse(BaseModel):
    success: bool
    mode: str
    count: int
    products: list[ProductRecord]


@router.post("/process", response_model=IngestResponse, dependencies=[Depends(require_demo_token)])
async def process_inputs(
    csv_file: Optional[UploadFile] = File(default=None),
    pdf_files: Optional[list[UploadFile]] = File(default=None),
    demo_mode: Optional[str] = Form(default=None),
    store: ProductStore = Depends(get_store),
) -> IngestResponse:
    """Process uploaded CSV and/or PDF datasheets, or trigger baked golden catalog."""
    csv_text = None
    if csv_file:
        raw_csv_bytes = await csv_file.read()
        csv_text = raw_csv_bytes.decode("utf-8-sig", errors="replace")

    parsed_pdfs: list[tuple[str, bytes]] = []
    if pdf_files:
        for f in pdf_files:
            if f.filename and f.filename.lower().endswith(".pdf"):
                b = await f.read()
                parsed_pdfs.append((f.filename, b))

    # Run pipeline or return baked dataset
    records = process_or_baked(csv_text, parsed_pdfs)
    
    return IngestResponse(
        success=True,
        mode="baked" if not csv_text and not parsed_pdfs else "live",
        count=len(records),
        products=records,
    )

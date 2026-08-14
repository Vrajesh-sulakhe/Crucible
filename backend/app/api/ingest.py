"""api/ingest.py — Ingestion & reset endpoints (POST /process, POST /reset).

Supports multipart file uploads (CSV + PDF datasheets) and live AI extraction.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel

from app.api.deps import get_store
from app.core.auth import require_demo_token
from app.core.config import settings
from app.core.store import ProductStore
from app.schemas.models import ProductRecord
from app.services.baked import load_golden_records
from app.services.pipeline import process_or_baked, run_pipeline

router = APIRouter(prefix="", tags=["Ingest"])


class IngestResponse(BaseModel):
    success: bool
    mode: str
    llm_provider: str
    count: int
    products: list[ProductRecord]


@router.post("/process", response_model=IngestResponse, dependencies=[Depends(require_demo_token)])
async def process_inputs(
    csv_file: Optional[UploadFile] = File(default=None),
    pdf_files: Optional[list[UploadFile]] = File(default=None),
    store: ProductStore = Depends(get_store),
) -> IngestResponse:
    """Process uploaded CSV and/or PDF datasheets through the live 6-stage pipeline."""
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

    # Run live pipeline on files
    records = process_or_baked(csv_text, parsed_pdfs)
    
    return IngestResponse(
        success=True,
        mode="live" if (csv_text or parsed_pdfs) else settings.demo_mode,
        llm_provider=settings.llm_provider,
        count=len(records),
        products=records,
    )


@router.post("/reset", response_model=IngestResponse, dependencies=[Depends(require_demo_token)])
def reset_to_golden(
    store: ProductStore = Depends(get_store),
) -> IngestResponse:
    """Reset catalog store to the verified ground-truth golden benchmark dataset."""
    records = load_golden_records()
    store.set_products(records)
    return IngestResponse(
        success=True,
        mode="golden_reset",
        llm_provider=settings.llm_provider,
        count=len(records),
        products=records,
    )

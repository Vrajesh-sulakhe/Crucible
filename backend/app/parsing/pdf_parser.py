"""parsing/pdf_parser.py — STAGE 1 (deterministic). PDF -> PageBlock[].

Extracts text and table rows from PDF datasheets while preserving page numbers for citations.
Uses pdfplumber with PyMuPDF (fitz) fallback.
"""

from __future__ import annotations

import io
import os
from dataclasses import dataclass
from typing import Optional

import pdfplumber


@dataclass(frozen=True)
class PageBlock:
    """One page of one source, as clean text. The unit stage 2 extracts from."""
    source_name: str
    source_type: str        # one of schemas.models.SourceType values
    page: int
    text: str


def parse_pdf_bytes(
    pdf_bytes: bytes,
    source_name: str = "uploaded_datasheet.pdf",
    source_type: str = "manufacturer_datasheet",
) -> list[PageBlock]:
    """Parse raw PDF bytes into a list of PageBlock objects."""
    blocks: list[PageBlock] = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                parts: list[str] = []
                body = (page.extract_text() or "").strip()
                if body:
                    parts.append(body)
                try:
                    for table in (page.extract_tables() or []):
                        for row in table:
                            cells = [(c or "").strip() for c in row]
                            cells = [c for c in cells if c]
                            if cells:
                                parts.append(" | ".join(cells))
                except Exception:
                    pass
                if parts:
                    blocks.append(PageBlock(source_name, source_type, page_number, "\n".join(parts)))
    except Exception:
        # Fallback to pymupdf if pdfplumber fails
        try:
            import fitz
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page_number, page in enumerate(doc, start=1):
                text = page.get_text().strip()
                if text:
                    blocks.append(PageBlock(source_name, source_type, page_number, text))
        except Exception:
            pass
    return blocks


def parse_pdf(
    path: str,
    source_name: str | None = None,
    source_type: str = "manufacturer_datasheet",
) -> list[PageBlock]:
    """Parse a PDF file on disk into PageBlock objects."""
    if source_name is None:
        source_name = os.path.basename(path)
    with open(path, "rb") as f:
        return parse_pdf_bytes(f.read(), source_name, source_type)
